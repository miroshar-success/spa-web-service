import * as cheerio from 'cheerio';
import * as needle from 'needle';
import {resolve, URL} from 'url';
import * as jsdom from 'jsdom'
import {Component, Inject} from '@nestjs/common';
import {SELECTORS, ScannerInstance, FILTERS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {SampleList, SampleResponse, UrlSample, UrlSampleList} from './scanner.sample';
import {EuristicMeta} from './scanner.euristic';

@Component()
export class ScannerService {

    constructor() {

    }

    fetchAll = async (url: string): Promise<UrlSampleList> => {
        const sortEuristic: EuristicMeta = new EuristicMeta();
        const cssPaths: CssPath[] = await this.getPathsByUrl(url, SELECTORS.LINKS);

        sortEuristic.url = new URL(url);

        const listPaths: SampleList = SampleList.fromPaths(cssPaths, 0)
            .groupBy('selector')
            .distinct()
            .orderByDesc(sortEuristic)
                .take(1);

        return UrlSampleList.onlyUniqueUrlList(listPaths);
    };

    fetchOne = async (url: string, selector: string, before?: string): Promise<SampleResponse> => {
        const response: SampleResponse = new SampleResponse();
        const cssPaths: CssPath[] = await this.getPathsByUrl(url, selector);
        const urls: string[] = cssPaths.map(x => x.value.href);
        if (urls.length === 0)
            response.isSelectorEmpty = true;
        let uniqueUrls = urls.filter((value, index, self) => self.indexOf(value) === index);
        if (before !== undefined) {
            const beforeIndex = uniqueUrls.indexOf(before);
            if (beforeIndex !== -1) {
                uniqueUrls = uniqueUrls.splice(0, beforeIndex);
            } else {
                response.isSampleUrlNotFound = true;
            }
        }
        response.sampleUrl = uniqueUrls.map(x => resolve(url, x));
        return response;
    };

    getPathsByUrl = async (url: string, selector: string): Promise<CssPath[]> => {
        const html = (await this.download(url)).body;
        const cheerioObject: CheerioStatic = this.parse(html);
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
        const domHtml = await (new Promise((resolve, reject) => {
            jsdom.env({
                url,
                features: {
                    FetchExternalResources: ['script'],
                    ProcessExternalResources: ['script'],
                    SkipExternalResources: false
                },
                // proxy: 'https://api.enthought.com/',
                done: function (err, window) {
                    if (err) {
                        // reject(err);
                    } else {
                        const output = jsdom.serializeDocument(window.document);
                        window.close();
                        resolve(output);
                    }
                },
            });
        }));
        return {body: domHtml};
    };
}

export default ScannerService;