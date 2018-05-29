import * as cheerio from 'cheerio';
import {resolve, URL} from 'url';
import {Component} from '@nestjs/common';
import {SELECTORS, ScannerInstance, FILTERS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {FetchOut, Meta, SampleList, SampleOut, SampleResponse, SelectorOut} from './scanner.sample';
import {EuristicMeta} from './scanner.euristic';

const needle = require('needle');

const metascraper = require('metascraper').load([
    require('metascraper-image')(),
    require('metascraper-title')(),
]);

@Component()
export class ScannerService {

    constructor() {

    }

    fetchAll = async (url: string): Promise<FetchOut> => {
        const sortEuristic: EuristicMeta = new EuristicMeta();
        let cssPaths: CssPath[], meta: Meta;
        try {
            [cssPaths,meta] = await this.getPathsByUrl(url, SELECTORS.LINKS);
        } catch (e) {
            return e;
        }

        sortEuristic.url = new URL(url);

        const listPaths: SampleList = SampleList.fromPaths(cssPaths, 0)
            .groupBy('selector')
            .distinct()
            .orderByDesc(sortEuristic)
            .unique()
            .takeSample(1)
            .take(0, 10);

        const selectorList: SelectorOut[] = await this.updateMeta(listPaths.toOut(), url);

        return {selectors: selectorList, meta: meta};
    };

    fetchOne = async (url: string, selector: string, before?: string): Promise<SampleResponse> => {
        const response: SampleResponse = new SampleResponse();
        let cssPaths: CssPath[], meta: Meta;
        try {
            [cssPaths,meta] = await this.getPathsByUrl(url, selector);
        } catch (e) {
            return e;
        }
        let listPaths: SampleList = SampleList.fromPaths(cssPaths, 0);
        if (listPaths.sample.length === 0)
            response.isSelectorEmpty = true;
        else {
            listPaths = listPaths.unique().take(0, 20);
            if (before !== undefined) {
                const beforeIndex = listPaths.sample.findIndex(x => x.data[0].href === before);
                if (beforeIndex !== -1) {
                    listPaths = listPaths.take(0, beforeIndex);
                } else {
                    response.isSampleUrlNotFound = true;
                }
            }
        }

        const selectorList: SelectorOut[] = await this.updateMeta(listPaths.toOut(), url);

        response.sampleUrl = selectorList.map(x => x.sample);
        return response;
    };

    getPathsByUrl = async (url: string, selector: string): Promise<[CssPath[], Meta]> => {
        let res;
        try {
            res = (await this.download(url));
        }
        catch (e) {
            throw e;
        }
        const cheerioObject: CheerioStatic = this.parse(res.body);
        const scannerInstance: ScannerInstance = ScannerInstance.fromCheerio(cheerioObject, selector);
        return [scannerInstance.resolve(url).filter(FILTERS.INVALID_HREF, {}).getPaths(), res.meta];
    };

    updateMeta = async (selectors: SelectorOut[], url: string): Promise<SelectorOut[]> => {
        const promises = selectors.map(async (x) => {
            if (!Meta.isCompleted(x.sample.meta)) {
                const newMeta = await this.downloadMeta(x.sample.url);
                if (newMeta !== undefined)
                    x.sample.meta = newMeta;
            }
            return x;
        });
        return await Promise.all(promises);
    };


    parse = (html: string): CheerioStatic => {
        return cheerio.load(html);
    };

    download = async (url: string): Promise<any> => {
        /*const request = (await needle('get', url));
        const html = request.body;*/
        const jsdom = require('jsdom');
        const jar = jsdom.createCookieJar();
        const domHtml = await (new Promise((resolve, reject) => {
            jsdom.env({
                url,
                cookieJar: jar,
                features: {
                    FetchExternalResources: ['script'],
                    ProcessExternalResources: ['script'],
                    SkipExternalResources: false
                },
                // proxy: 'https://api.enthought.com/',
                done: function (err, window) {
                    if (err) {
                        reject(err);
                    } else {
                        const output = jsdom.serializeDocument(window.document);
                        setTimeout(() => window.close(), 100);
                        resolve(output);
                    }
                },
            });
        }));
        const meta = metascraper({url, html: domHtml});
        return {body: domHtml, meta};
    };

    downloadMeta = async (url: string): Promise<Meta> => {
        let options = {
            compressed: true, // sets 'Accept-Encoding' to 'gzip,deflate'
            follow_max: 10,    // follow up to five redirects
            rejectUnauthorized: true  // verify SSL certificate
        };
        const meta = await needle('get', url, options).then(res => {
            return metascraper({url, html: res.body});
        }).catch(err => {
            return undefined;
        });
        return await meta;
    }
}

export default ScannerService;