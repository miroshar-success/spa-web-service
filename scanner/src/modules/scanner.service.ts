import * as cheerio from 'cheerio';
import {resolve, URL} from 'url';
import {Component} from '@nestjs/common';
import {SELECTORS, ScannerInstance, FILTERS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {FetchOut, Meta, SampleList, SampleOut, SampleResponse, SelectorOut} from './scanner.sample';
import {EuristicMeta} from './scanner.euristic';

const Horseman = require('node-horseman');


import {ApiClient} from './scanner.api.client';
import HorsemanDownloader from './downloader/HorsemanDownloader';
import JSDOMDownloader from './downloader/JSDOMDownloader';

const needle = require('needle');

const metascraper = require('metascraper').load([
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-logo')()
]);

@Component()
export class ScannerService {

    constructor(private readonly apiClient: ApiClient) {
    }

    fetchAll = async ({fetchId, fetchUrl: url}) => {
        const result: FetchOut = await this.fetchAllResult(url);
        this.apiClient.produceFetchExploreResult({fetchId, fetchUrl: url, ...result});
    };

    fetchAllResult = async (url: string): Promise<FetchOut> => {
        let meta: Meta, html: string;
        try {
            let response = (await this.download(url));
            meta = response.meta;
            html = response.html;
        }
        catch (e) {
            return e;
        }

        const listPaths: SelectorOut[] = this.fetchAllPure(url, html);

        const selectorList: SelectorOut[] = await this.updateMeta(listPaths, url);
        return {selectors: selectorList, meta: meta};
    };

    fetchAllPure = (url: string, html: string): SelectorOut[] => {

        const sortEuristic: EuristicMeta = new EuristicMeta();
        sortEuristic.url = new URL(url);
        let cssPaths: CssPath[] = this.getPathsByHtml(url, html, SELECTORS.LINKS);

        const listPaths: SelectorOut[] = SampleList.fromPaths(cssPaths, 0)
            .groupBy('selector')
            .distinct()
            .orderByDesc(sortEuristic)
            .takeSample(1)
            .unique()
            .take(0, 10)
            .toOut();
        return listPaths;
    };

    fetchOne = async ({fetchId, fetchUrl: url, selector, lastResult: before}) => {
        const response: SampleResponse = await this.fetchOneResult(url, selector, before);
        this.apiClient.produceFetchResult({fetchId, fetchUrl: url, ...response});
    };

    fetchOneResult = async (url: string, selector: string, before?: string): Promise<SampleResponse> => {
        let meta: Meta, html: string;
        const response: SampleResponse = new SampleResponse();
        let selectorList: SelectorOut[];

        try {
            let response = (await this.download(url));
            meta = response.meta;
            html = response.html;
        }
        catch (e) {
            return e;
        }

        [selectorList, response.isSelectorEmpty, response.isSampleUrlNotFound] = this.fetchOnePure(url, html, selector, before);
        selectorList = await this.updateMeta(selectorList, url);
        response.sampleUrl = selectorList.map(x => x.sample);
        return response;
    };

    fetchOnePure = (url: string, html: string, selector: string, before?: string): [SelectorOut[], boolean, boolean] => {
        let isSelectorEmpty = false, isSampleUrlNotFound = false;
        let cssPaths: CssPath[] = this.getPathsByHtml(url, html, selector);
        let listPaths: SampleList = SampleList.fromPaths(cssPaths, 0);
        if (listPaths.sample.length === 0)
            isSelectorEmpty = true;
        else {
            listPaths = listPaths.unique().take(0, 20);
            if (before !== undefined) {
                const beforeIndex = listPaths.sample.findIndex(x => x.data[0].href === before);
                if (beforeIndex !== -1) {
                    listPaths = listPaths.take(0, beforeIndex);
                } else {
                    isSampleUrlNotFound = true;
                }
            }
        }
        return [listPaths.toOut(), isSelectorEmpty, isSampleUrlNotFound]
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
        const cheerioObject: CheerioStatic = this.parse(res.html);
        const scannerInstance: ScannerInstance = ScannerInstance.fromCheerio(cheerioObject, selector);
        return [scannerInstance.resolve(url).filter(FILTERS.INVALID_HREF, {}).getPaths(), meta];
    };

    getPathsByHtml = (url: string, html: string, selector: string): CssPath[] => {
        const cheerioObject: CheerioStatic = this.parse(html);
        const scannerInstance: ScannerInstance = ScannerInstance.fromCheerio(cheerioObject, selector);
        return scannerInstance.resolve(url).filter(FILTERS.INVALID_HREF, {}).getPaths();
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
        let domHtml;
        try {
            domHtml = await HorsemanDownloader.download(url);
        } catch (e) {
            try {
                domHtml = await JSDOMDownloader.download(url);
            }
            catch (e){
                throw e;
            }
        }
        const meta = await this.scrapeMeta(url, domHtml as string);
        return {html: domHtml, meta};
    };

    downloadMeta = async (url: string): Promise<Meta> => {
        let options = {
            compressed: true, // sets 'Accept-Encoding' to 'gzip,deflate'
            follow_max: 10,    // follow up to five redirects
            rejectUnauthorized: false,  // verify SSL certificate
            user_agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        };
        const html = await needle('get', url, options).then(res => {
            return res.body;
        }).catch(err => {
            return undefined;
        });
        if (html === undefined)
            return undefined;

        return await this.scrapeMeta(url, html);
    };

    protected scrapeMeta = async (url: string, html: string): Promise<Meta> => {
        let meta = await metascraper({url, html});
        if (!meta.image && meta.logo) {
            meta.image = meta.logo;
        }
        delete meta.logo;
        return meta;
    }
}

export default ScannerService;
