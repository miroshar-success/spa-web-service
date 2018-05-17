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
        const html = (await this.download(url)).body;
        const cheerioInstance: ScannerInstance = this.parse(html);
        const listNodes: CheerioElement[] = cheerioInstance.select(SELECTORS.LINKS).toArray();
        const cssPaths: CssPath[] = listNodes.map(node => CssPath.fromNode(node));
        const listPaths: SampleList = SampleList.fromPaths(cssPaths, 0)
            .groupBy('selector')
            .distinct()
            .orderByAsc()
            .take(1)
            .resolveRelativeUrl(url);
        return listPaths;
    };

    fetchOne = async (url: string, selector: string, before?: string): Promise<SampleResponse> => {
        const response: SampleResponse = new SampleResponse();

        const html = (await this.download(url)).body;
        const cheerioInstance: ScannerInstance = this.parse(html);
        const listNodes: CheerioElement[] = cheerioInstance.select(selector).toArray();
        const urls: string[] =  listNodes.map(x =>  new path.URL(x.attribs.href, url).href);
        if(urls.length === 0)
            response.isSelectorEmpty = true;
        let uniqueUrls = urls.filter((value, index, self) => self.indexOf(value) === index);
        if(before !== undefined)
        {
            const beforeIndex = uniqueUrls.indexOf(before);
            if(beforeIndex !== -1){
                uniqueUrls = uniqueUrls.splice(0, beforeIndex);
            }else{
                response.isSampleUrlNotFound = true;
            }
        }
        response.sampleUrl = uniqueUrls;
        return response;
    };

    parse = (html: string): ScannerInstance => {
        const instance = cheerio.load(html);
        return new ScannerInstance(instance);
    };

    download = async (url: string): Promise<any> => {
        return needle('get', url);
    };
}