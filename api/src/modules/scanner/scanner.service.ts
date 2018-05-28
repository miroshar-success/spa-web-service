import * as cheerio from 'cheerio';
import {resolve, URL} from 'url';
import {Component} from '@nestjs/common';
import {SELECTORS, ScannerInstance, FILTERS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {FetchOut, Meta, SampleList, SampleOut, SampleResponse, SelectorOut} from './scanner.sample';
import {EuristicMeta} from './scanner.euristic';

@Component()
export class ScannerService {

    constructor() {

    }

    fetchAll = async (url: string): Promise<FetchOut> => {
        const sortEuristic: EuristicMeta = new EuristicMeta();
        let cssPaths: CssPath[];
        try {
            cssPaths = await this.getPathsByUrl(url, SELECTORS.LINKS);
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

        return {selectors: listPaths.toOut(), meta: {image: 'ggg', title: 'dfghdfhdhf'}};
    };

    fetchOne = async (url: string, selector: string, before?: string): Promise<SampleResponse> => {
        const response: SampleResponse = new SampleResponse();
        let cssPaths: CssPath[];
        try {
            cssPaths = await this.getPathsByUrl(url, selector);
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

        response.sampleUrl = listPaths.toOut().map(x => x.sample);
        return response;
    };

    getPathsByUrl = async (url: string, selector: string): Promise<CssPath[]> => {
        let res;
        try {
            res = (await this.download(url)).body;
        }
        catch (e) {
            throw e;
        }
        const cheerioObject: CheerioStatic = this.parse(res);
        const scannerInstance: ScannerInstance = ScannerInstance.fromCheerio(cheerioObject, selector);
        return scannerInstance.resolve(url).filter(FILTERS.INVALID_HREF, {}).getPaths();
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
                        //  window.close();
                        resolve(output);
                    }
                },
            });
        }));
        return {body: domHtml};
    };
}

export default ScannerService;
