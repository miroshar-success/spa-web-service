import {ScannerService} from './scanner.service';
import {ScannerInstance, SELECTORS} from './scanner.instance';
import {FetchOut, Meta, Sample, SampleList, SampleResponse, SelectorOut} from './scanner.sample';

const fs = require('fs');


const testMuchTemplate = (site, urls) => {
    urls.forEach((x, index) => {
        describe(site + ` test ${index + 1}`, () => testTemplate(x.url, x.regex));
    });
};

const testTemplate = (url, regex) => {
    let allExamples: FetchOut;
    let oneGroup: SampleResponse;
    let scannerService;
    let html;

    beforeAll(async () => {

        scannerService = new ScannerService();

        html = (await scannerService.download(url)).html;

        allExamples = await scannerService.fetchAllResult(url,html);
        oneGroup = await scannerService.fetchOneResult(url,html,allExamples.selectors[0].selector);
    });

    it('sample list isn\'t empty', () => {
        expect(allExamples.selectors.length).toBeGreaterThan(0);
    });

    it('first sample look like good url', () => {
        allExamples.selectors.forEach((x, index) => {
                if (regex.test(x.sample.url))
                    console.log('look like good:', index);
            }
        );
        expect(regex.test(allExamples.selectors[0].sample.url)).toBeTruthy();
    });

   /* it('another not', () => {
        allExamples.filter((item, index) => index !== 0).map(x =>
            expect(regex.test(x.sample.url)).toBeFalsy()
        );
    });*/

    it('should have similar url for each sample', async () => {
        expect(oneGroup.isSelectorEmpty).toBeFalsy();
        oneGroup.sampleUrl.map(x => {
            expect(regex.test(x.url)).toBeTruthy()
        })
    });

    it('should have meta for each sample', async () => {
        expect(oneGroup.isSelectorEmpty).toBeFalsy();
        oneGroup.sampleUrl.map(x => {
            expect(x.meta.image).not.toBe(null);
            expect(x.meta.title).not.toBe(null);
        })
    });
};


describe('scanner test', () => {

    let scannerService: ScannerService;
    const cssPath = JSON.parse(fs.readFileSync('./__mocks__/__mockData__/csspaths.json'));
    const selectorPath = ['html', 'body', 'div', 'div', 'div', 'ul', 'li', 'a'];
    const urlPath = 'https://www.tut.by/resource/';
    const url = 'https://www.ebay.com/';
    const defaultHtml = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');

    beforeAll(() => {
        scannerService = new ScannerService();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    describe('download', () => {
        beforeAll(() => {
            scannerService = new ScannerService();
        });

        it('should return string containing html ', async () => {
            const html = (await scannerService.download(urlPath)).html;
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

    describe('findAll', () => {

        beforeAll(() => {
            jest.mock('needle');
        });

        it('should return list Cheerio Element containings only links with href', async () => {
            const html = defaultHtml;
            const cheerioObject = scannerService.parse(html);
            const listNodes = ScannerInstance.fromCheerio(cheerioObject, SELECTORS.LINKS).instance;
            expect(listNodes.length).toBeGreaterThan(0);
            const listLinks = listNodes.filter(x => x.name === 'a' && x.attribs.href !== undefined);
            expect(listNodes.length).toBe(listLinks.length);
        });

        it('should build CssPath from scanner instance', async () => {
            const html = defaultHtml;
            const cheerioObject = scannerService.parse(html);
            const csspath = ScannerInstance.fromCheerio(cheerioObject, SELECTORS.LINKS).getPaths();
            expect(csspath[0].path).toEqual(selectorPath);
            expect(csspath[0].value.href).toEqual(urlPath);
            expect(csspath[0].value.isImageInside).toEqual(false);
            expect(csspath[0].value.meta.title).toEqual(null);
            expect(csspath[0].value.meta.image).toEqual(null);
        });

        it('should build SampleList from CssPath', async () => {
            const sampleList = SampleList.fromPaths(cssPath, 0);
            expect(sampleList.sample[0].selector).toBe(selectorPath.join(' > ') + '[href]');
            expect(sampleList.sample[0].data[0].href).toBe(urlPath);
        });

        it('should grouping by selector', async () => {
            const sampleList = SampleList.fromPaths(cssPath, 0);
            const firstGroup = sampleList.groupBy('selector').sample[0];
            expect(firstGroup.selector).toBe(selectorPath.join(' > ') + '[href]');
            expect(firstGroup.data.length).toBe(18);
        });

        it('should distinct elements', async () => {
            const sampleList = SampleList.fromPaths(cssPath, 0);
            const groups = sampleList.groupBy('selector');
            const unique = groups.sample[0].data.filter((value, index, self) => self.findIndex(x => x.href === value.href) === index);
            expect(groups.distinct().sample[0].data.length).toBe(unique.length);
        });

        it('should order by sample length descending elements', async () => {
            const sampleList = SampleList.fromPaths(cssPath, 0);
            const groups = sampleList.groupBy('selector').orderByDesc();
            for (let i = 0; i < groups.sample.length - 1; i++) {
                expect(groups.sample[i].data.length).toBeGreaterThanOrEqual(groups.sample[i + 1].data.length)
            }
        });

        it('should take as much first examples as need', async () => {
            const sampleList = SampleList.fromPaths(cssPath, 0);
            const groups = sampleList.groupBy('selector').orderByDesc();
            const groupsOne = sampleList.take(1);
            for (let i = 0; i < groupsOne.sample.length - 1; i++) {
                expect(groupsOne.sample[i].data.length).toBeLessThanOrEqual(1)
            }
            const groupsTwo = sampleList.take(4);
            for (let i = 0; i < groupsTwo.sample.length - 1; i++) {
                expect(groupsTwo.sample[i].data.length).toBeLessThanOrEqual(4)
            }
        });

        it('should resolve relative urls', async () => {
            const sample: Sample[] = [new Sample('test', [{href: 'test'}])];
            const list: SampleList = new SampleList(sample);
            const groups = list.resolveRelativeUrl('http://test.com/');
            expect(groups.sample[0].data[0].href).toBe('http://test.com/test')
        });

        it('should find all group and return one sample per group', async () => {
            const allSamples = await scannerService.fetchAllPure(urlPath, defaultHtml);
            expect(allSamples.length).toBeGreaterThan(0);
            expect(allSamples.length).toBeLessThanOrEqual(10);
            allSamples.map(x =>
                expect(typeof x.sample.length).toBe('undefined')
            );

        });
    });

    describe('findOne', () => {

        beforeAll(() => {
            jest.mock('needle');
        });

        it('should return all sample by url and selector', async () => {
            const [result,isSelectorEmpty,isSampleUrlNotFound] = await scannerService.fetchOnePure(urlPath, defaultHtml, selectorPath.join(' > ') + '[href]');
            expect(isSampleUrlNotFound).toBeFalsy();
            expect(isSelectorEmpty).toBeFalsy();
            expect(result.length).toBe(15);
        });

        it('should setup isSelectorEmpty if any nodes not found', async () => {
            const [result,isSelectorEmpty,isSampleUrlNotFound] = await scannerService.fetchOnePure(urlPath,defaultHtml, 'bad selector');
            expect(isSelectorEmpty).toBeTruthy();
        });

        it('should return all sample before given if found', async () => {
            const sampleUrl = 'https://jobs.tut.by/#ua:top_menu_news.tut.by~12';
            const [result,isSelectorEmpty,isSampleUrlNotFound] = await scannerService.fetchOnePure(urlPath,defaultHtml, selectorPath.join(' > ') + '[href]');
            const [beforeResult,beforeIsSelectorEmpty,beforeIsSampleUrlNotFound] = await scannerService.fetchOnePure(urlPath, defaultHtml, selectorPath.join(' > ') + '[href]', sampleUrl);
            const index = result.findIndex(x => x.sample.url === sampleUrl);
            expect(beforeResult.length).toBe(index);
        });

        it('should setup isSampleUrlNotFound if given url doesn\'t contains', async () => {
            const [result,isSelectorEmpty,isSampleUrlNotFound] = await scannerService.fetchOnePure(urlPath,defaultHtml, selectorPath.join(' > ') + '[href]', 'sample');
            expect(isSampleUrlNotFound).toBe(true);
            expect(result.length).toBe(15);
        });
    });

    describe('updateMeta', () => {
        beforeAll(() => {
            jest.mock('needle');
            scannerService = new ScannerService();
        });

        it('should download meta from html', async () => {
            const meta = (await scannerService.downloadMeta(urlPath));
            expect(meta.title).not.toEqual(null);
            expect(meta.image).not.toEqual(null);
        });

        it('should add meta where need', async () => {
            let selectors: SelectorOut[] = [{sample: {meta: {}}}];
            selectors = (await scannerService.updateMeta(selectors, urlPath));
            expect(selectors[0].sample.meta.title).not.toEqual(null);
            expect(selectors[0].sample.meta.image).not.toEqual(null);
        });
    });

    describe('site test', () => {

        describe('airbnb', () => testTemplate(
            'https://www.airbnb.ru/s/Paris/homes?refinement_paths%5B%5D=%2Fhomes&allow_override%5B%5D=&s_tag=uYpZSDbN',
            /(https)(:)(\/)(\/)(www\.airbnb\.ru)(\/)(rooms)(\/)(\d+)(\?)(location)(=)((?:[a-z][a-z]+))/i
        ));

        describe('allegro', () => testTemplate(
            'https://allegro.pl/kategoria/samochody-osobowe-4029?order=n',
            /^(https?)(:)(\/)(\/)(allegro\.pl)(\/)([a-z\d\\-]+)(\.)(html)/
        ));

        describe('av', () => testMuchTemplate('av', [
                {
                    url: 'https://cars.av.by/infiniti?sort=date&order=desc',
                    regex: /(https)(:)(\/)(\/)(cars\.av\.by)(\/)(infiniti)(\/)([a-z\d\\-]+)(\/)(\d+)/i
                },
                {
                    url: 'https://cars.av.by/search?year_from=&year_to=&currency=USD&price_from=&price_to=&sort=date&order=desc',
                    regex: /(https)(:)(\/)(\/)(cars\.av\.by)(\/)((?:[a-z][a-z]+)).*?(\/).*?((?:[a-z0-9]+)).*?(\/)(\d+)/i
                }
            ]
        ));

        describe('booking', () => testTemplate(
            'https://www.booking.com/searchresults.ru.html?city=-1941830',
            /^https:\/\/www\.booking\.com\/hotel\/by\/(.*)/
        ));

        describe('ebay', () => testTemplate(
            'https://www.ebay.com/sch/Laptops-Netbooks-/175672/i.html',
            /^https:\/\/www\.ebay\.com\/itm\/(.*)\/(.*)/
        ));

    });
});
