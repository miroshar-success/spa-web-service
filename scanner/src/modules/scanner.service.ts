import * as cheerio from 'cheerio';
import {resolve, URL} from 'url';
import {Component} from '@nestjs/common';
import {SELECTORS, ScannerInstance, FILTERS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {FetchOut, Meta, SampleList, SampleOut, SampleResponse, SelectorOut} from './scanner.sample';
import {EuristicMeta} from './scanner.euristic';
const Horseman = require('node-horseman');


import {ApiClient} from "./scanner.api.client";

const needle = require('needle');

const metascraper = require('metascraper').load([
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-logo')()
]);

@Component()
export class ScannerService {

    constructor(private readonly apiClient: ApiClient) {}

    fetchAll = async ({fetchId, fetchUrl: url}): Promise<FetchOut> => {
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
            .take(0, 10);

        const selectorList: SelectorOut[] = await this.updateMeta(listPaths.toOut(), url);

        const fetchExploreResult = {fetchId,selectors: selectorList, meta: meta};
        this.apiClient.produceFetchExploreResult(fetchExploreResult);
    };

    fetchOne = async ({fetchId, fetchUrl:url, selector, lastResult:before}): Promise<SampleResponse> => {
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
        const res = await this.apiClient.produceFetchResult({fetchId,fetchUrl:url,...response});
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
        let horseman = new Horseman();
        const domHtml = await horseman
            .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
            .open(url)
            .waitForNextPage()
            .html()
            .then( body =>{
                return body;
            })
            .catch( error => {
                return error;
            });
        const meta = await this.scrapeMeta(url, domHtml as string);
        return {html: domHtml, meta};
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
        if(html === undefined)
            return undefined;

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
