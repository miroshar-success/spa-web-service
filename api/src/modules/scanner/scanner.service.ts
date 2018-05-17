import * as cheerio from 'cheerio';
import * as needle from 'needle';
import * as path from 'url';
import {Component} from '@nestjs/common';
import {SELECTORS, ScannerInstance} from './scanner.instance';
import {CssPath, Sample, SampleList} from './scanner.csspath';

@Component()
export class ScannerService {

    fetchAll = async (url: string) => {
        const html = (await this.download(url)).body;
        const cheerioInstance: ScannerInstance = this.parse(html);
        const listNodes: CheerioElement[] = cheerioInstance.select(SELECTORS.LINKS).toArray();
        const cssPaths: CssPath[] = listNodes.map(node => CssPath.fromNode(node));
        const listPaths: SampleList = SampleList.fromPaths(cssPaths, 0)
            .groupBy('selector')
            .orderByAsc()
            .take(1);
        return this.resolveRelativeUrlList(listPaths, url);
    }

    fetchOne = async (url: string, selector: string) => {
        const html = (await this.download(url)).body;
        const cheerioInstance: ScannerInstance = this.parse(html);
        const listNodes: CheerioElement[] = cheerioInstance.select(selector).toArray();
        const urls: string[] = listNodes.map(x => this.resolveRelativeUrl(x.attribs.href, url));
        const uniqueUrls = urls.filter((value, index, self) => self.indexOf(value) === index);
        return uniqueUrls;
    }

    resolveRelativeUrlList = (list: SampleList, baseUrl: string): SampleList => {
        const result = list.sample.map(x => {
            const absUrls = x.sampleUrl.map(y => this.resolveRelativeUrl(y, baseUrl));
            return new Sample(x.selector, absUrls);
        });
        return new SampleList(result);
    }

    resolveRelativeUrl = (url: string, baseUrl: string): string => {
        return new path.URL(url, baseUrl).href;
    }

    parse = (html: string): ScannerInstance => {
        const instance = cheerio.load(html);
        return new ScannerInstance(instance);
    }

    download: Promise<any> = async (url: string) => {
        return needle('get', url);
    }
}