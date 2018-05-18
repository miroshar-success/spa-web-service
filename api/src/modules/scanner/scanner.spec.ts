import {ScannerService} from './scanner.service';
import {SELECTORS} from './scanner.instance';
import {CssPath} from './scanner.csspath';
import {SampleList} from './scanner.sample';

const fs = require('fs');

describe('scanner test', () => {
    let scannerService: ScannerService;
    jest.mock('../../../__mocks__/needle.js');
    const cssPath = JSON.parse(fs.readFileSync('./__mocks__/__mockData__/csspaths.json'));
    const selectorPath = [ 'html', 'body', 'div', 'div', 'div', 'ul', 'li', 'a' ];
    const urlPath = 'https://www.tut.by/resource/';
    beforeAll(() => {
        scannerService = new ScannerService();
    });
    describe('download', () => {
        it('should return string containing html', async () => {
            const html = (await scannerService.download()).body;
            expect(typeof html).toBe('string');
            expect(html.length).toBeGreaterThan(0);
        });
    });

    describe('parse', () => {
        it('should return ScannerInstance', async () => {
            const html = (await scannerService.download()).body;
            const scanner = scannerService.parse(html);
            expect(scanner.instance).not.toBeUndefined();
        });
    });

    describe('fetchAll', () => {
        it('should return list Cheerio Element containings only links with href', async () => {
            const html = (await scannerService.download()).body;
            const cheerioInstance = scannerService.parse(html);
            const listNodes: CheerioElement[] = cheerioInstance.select(SELECTORS.LINKS).toArray();
            expect(listNodes.length).toBeGreaterThan(0);
            const listLinks = listNodes.filter(x => x.name === 'a' && x.attribs.href !== undefined);
            expect(listNodes.length).toBe(listLinks.length);
        });

        it('should build CssPath by Cheerio Element', async () => {
            const html = (await scannerService.download()).body;
            const cheerioInstance = scannerService.parse(html);
            const listNodes: CheerioElement[] = cheerioInstance.select(SELECTORS.LINKS).toArray();
            const csspath = CssPath.fromNode(listNodes[0]);
            expect(csspath.path).toEqual(selectorPath);
            expect(csspath.value).toEqual(urlPath);
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

        it('should find all samples', async () => {
            const allSamples = await scannerService.fetchAll();
            expect(allSamples.sample.length).toBe(17);
        });
    });
});