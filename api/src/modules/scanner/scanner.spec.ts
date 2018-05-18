import {ScannerService} from './scanner.service';
import {ScannerInstance, SELECTORS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {Sample, SampleList} from './scanner.sample';

const fs = require('fs');

describe('scanner test', () => {
    let scannerService: ScannerService;
    jest.mock('../../../__mocks__/needle.js');
    const cssPath = JSON.parse(fs.readFileSync('./__mocks__/__mockData__/csspaths.json'));
    const selectorPath = [ 'html', 'body', 'div', 'div', 'div', 'ul', 'li', 'a' ];
    const urlPath = 'https://www.tut.by/resource/';
    const defaultHtml = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');
    beforeAll(() => {
        scannerService = new ScannerService();
    });
    describe('download', () => {
        it('should return string containing html', async () => {
            const html = (await scannerService.download(urlPath)).body;
            expect(typeof html).toBe('string');
            expect(html.length).toBeGreaterThan(0);
        });
    });

    describe('parse', () => {
        it('should return cheerio static object', async () => {
            const html = defaultHtml;
            const cheerioObject = scannerService.parse(html);
            expect(cheerioObject.parseHTML).not.toBeUndefined();
        });
    });

    describe('fetchAll', () => {
        it('should return list Cheerio Element containings only links with href', async () => {
            const html = defaultHtml;
            const cheerioObject = scannerService.parse(html);
            const listNodes = ScannerInstance.fromCheerio(cheerioObject,SELECTORS.LINKS).instance;
            expect(listNodes.length).toBeGreaterThan(0);
            const listLinks = listNodes.filter(x => x.name === 'a' && x.attribs.href !== undefined);
            expect(listNodes.length).toBe(listLinks.length);
        });

        it('should build CssPath from scanner instance', async () => {
            const html = defaultHtml;
            const cheerioObject = scannerService.parse(html);
            const csspath = ScannerInstance.fromCheerio(cheerioObject,SELECTORS.LINKS).getPaths();
            expect(csspath[0].path).toEqual(selectorPath);
            expect(csspath[0].value).toEqual(urlPath);
        });

        it('should build SampleList from CssPath', async () => {
            const sampleList = SampleList.fromPaths(cssPath,0);
            expect(sampleList.sample[0].selector).toBe(selectorPath.join(' > ') + '[href]');
            expect(sampleList.sample[0].sampleUrl[0]).toBe(urlPath);
        });

        it('should grouping by selector', async () => {
            const sampleList = SampleList.fromPaths(cssPath,0);
            const firstGroup = sampleList.groupBy('selector').sample[0];
            expect(firstGroup.selector).toBe(selectorPath.join(' > ') + '[href]');
            expect(firstGroup.sampleUrl.length).toBe(18);
        });

        it('should distinct elements', async () => {
            const sampleList = SampleList.fromPaths(cssPath,0);
            const groups = sampleList.groupBy('selector');
            const unique = groups.sample[0].sampleUrl.filter((value, index, self) => self.indexOf(value) === index);
            expect(groups.distinct().sample[0].sampleUrl.length).toBe(unique.length);
        });

        it('should order by sample length descending elements', async () => {
            const sampleList = SampleList.fromPaths(cssPath,0);
            const groups = sampleList.groupBy('selector').orderByDesc();
            for(let i=0;i<groups.sample.length - 1; i++){
                expect(groups.sample[i].sampleUrl.length).toBeGreaterThanOrEqual(groups.sample[i + 1].sampleUrl.length)
            }
        });

        it('should take as much first examples as need', async () => {
            const sampleList = SampleList.fromPaths(cssPath,0);
            const groups = sampleList.groupBy('selector').orderByDesc();
            const groupsOne = sampleList.take(1);
            for(let i=0;i<groupsOne.sample.length - 1; i++){
                expect(groupsOne.sample[i].sampleUrl.length).toBeLessThanOrEqual(1)
            }
            const groupsTwo = sampleList.take(4);
            for(let i=0;i<groupsTwo.sample.length - 1; i++){
                expect(groupsTwo.sample[i].sampleUrl.length).toBeLessThanOrEqual(4)
            }
        });

        it('should resolve relative urls', async () => {
            const sample: Sample[] = [new Sample("test",["test"])];
            const list: SampleList = new SampleList(sample);
            const groups = list.resolveRelativeUrl('http://test.com/');
            expect(groups.sample[0].sampleUrl[0]).toBe('http://test.com/test')
        });

        it('should find all samples', async () => {
            const allSamples = await scannerService.fetchAll(urlPath);
            expect(allSamples.sample.length).toBe(17);
        });
    });

    describe('findOne', () => {
        it('should return all sample by url and selector', async () => {
            const result = await scannerService.fetchOne(urlPath,selectorPath.join(' > ') + '[href]');
            expect(result.isSampleUrlNotFound).toBeFalsy();
            expect(result.isSelectorEmpty).toBeFalsy();
            expect(result.sampleUrl.length).toBe(17);
        });

        it('should setup isSelectorEmpty if any nodes not found', async () => {
            const result = await scannerService.fetchOne(urlPath,'bad selector');
            expect(result.isSelectorEmpty).toBeTruthy();
        });

        it('should return all sample before given if found', async () => {
            const sampleUrl = 'https://jobs.tut.by/#ua:top_menu_news.tut.by~12';
            const result = await scannerService.fetchOne(urlPath,selectorPath.join(' > ') + '[href]');
            const resultBeforeSample = await scannerService.fetchOne(urlPath,selectorPath.join(' > ') + '[href]', sampleUrl);
            const index = result.sampleUrl.indexOf(sampleUrl);
            expect(resultBeforeSample.sampleUrl.length).toBe(index);
        });

        it('should setup isSampleUrlNotFound if given url doesn\'t contains', async () => {
            const result = await scannerService.fetchOne(urlPath,selectorPath.join(' > ') + '[href]','sample');
            expect(result.isSampleUrlNotFound).toBe(true);
            expect(result.sampleUrl.length).toBe(17);
        });
    });
});