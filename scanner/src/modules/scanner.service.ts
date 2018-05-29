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
    require('metascraper-logo')()
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
            .takeSample(1)
            .unique()
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
        let res, meta;
        try {
            res = (await this.download(url));
        }
        catch (e) {
            throw e;
        }
        meta = res.meta;
        const cheerioObject: CheerioStatic = this.parse(res.body);
        const scannerInstance: ScannerInstance = ScannerInstance.fromCheerio(cheerioObject, selector);
        return [scannerInstance.resolve(url).filter(FILTERS.INVALID_HREF, {}).getPaths(), meta];
    };

    protected updateMeta = async (selectors: SelectorOut[], url: string): Promise<SelectorOut[]> => {
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
                userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
                features: {
                    FetchExternalResources: ['script'],
                    ProcessExternalResources: ['script'],
                    SkipExternalResources: false
                },
                headers: {
                    "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
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
        const meta = await this.scrapeMeta(url, domHtml as string);
        return {body: domHtml, meta};
    };

    downloadMeta = async (url: string): Promise<Meta> => {
        let options = {
            compressed: true, // sets 'Accept-Encoding' to 'gzip,deflate'
            follow_max: 10,    // follow up to five redirects
            rejectUnauthorized: true  // verify SSL certificate
        };
        const html = await needle('get', url, options).then(res => {
            return res.body;
        }).catch(err => {
            return undefined;
        });

        return await this.scrapeMeta(url,html);
    };

    protected scrapeMeta = async (url: string, html: string): Promise<Meta> => {
        let meta = await metascraper({url,html});
        if(!meta.image && meta.logo) {
            meta.image = meta.logo;
        }
        delete meta.logo;
        return meta;
    }
}

export default ScannerService;