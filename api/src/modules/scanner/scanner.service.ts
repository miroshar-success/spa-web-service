import * as cheerio from 'cheerio';
import * as needle from 'needle';
import * as path from 'url';
import {Component} from '@nestjs/common';
import {SELECTORS, ScannerInstance} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {SampleList, SampleResponse} from './scanner.sample';

@Component()
export class ScannerService {

    fetchAll = async (url: string): Promise<SampleList> => {
        const cssPaths: CssPath[] = await this.getPathsByUrl(url,SELECTORS.LINKS);
        const listPaths: SampleList = SampleList.fromPaths(cssPaths, 0)
            .groupBy('selector')
            .distinct()
            .orderByDesc()
            .take(1)
            .resolveRelativeUrl(url);
        return listPaths;
    };

    fetchOne = async (url: string, selector: string, before?: string): Promise<SampleResponse> => {
        const response: SampleResponse = new SampleResponse();
        const cssPaths: CssPath[] = await this.getPathsByUrl(url,selector);
        const urls: string[] = cssPaths.map(x => x.value);
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
        response.sampleUrl = uniqueUrls;
        return response;
    };

    getPathsByUrl = async (url: string, selector: string):Promise<CssPath[]> => {
        const html = (await this.download(url)).body;
        const cheerioObject: CheerioStatic = this.parse(html);
        const scannerInstance: ScannerInstance = ScannerInstance.fromCheerio(cheerioObject,selector);
        return scannerInstance.getPaths();
    };


    parse = (html: string): CheerioStatic => {
        return cheerio.load(html);
    };

    download = async (url: string): Promise<any> => {
        return needle('get', url);
    };
}