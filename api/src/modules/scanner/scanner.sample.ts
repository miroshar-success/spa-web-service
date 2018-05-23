import {CssPath, CssValue} from './scanner.csspath';
import * as path from 'url';
import {EuristicMeta, EuristicOrderService} from './scanner.euristic';
import {resolve} from 'url';

export class SampleList {
    constructor(readonly sample: Sample[]) {
    };

    static fromPaths(paths: CssPath[], deep: number = 1): SampleList {
        const sample = paths.map(x => {
            const group: Sample = new Sample(
                [...x.path].splice(0, x.path.length - deep).join(' > ') + '[href]',
                [{...x.value}]
            );
            return group;
        });
        return new SampleList(sample);
    };

    groupBy = (key: string = 'selector'): SampleList => {
        const sample = Array.from(this.sample.reduce(
            (sum, item) => {
                const groupByVal = item[key];
                const groupedItems = sum.get(groupByVal) || [];
                groupedItems.push(item);
                return sum.set(groupByVal, groupedItems);
            },
            new Map()
        )).map(v => new Sample(v[0], v[1].map(link => link.sampleUrl[0])));
        return new SampleList(sample);
    };

    orderByDesc = (meta: EuristicMeta): SampleList => {
        const result = [...this.sample].sort((x, y) => EuristicOrderService.compare(y.sampleUrl, x.sampleUrl, meta));
        return new SampleList(result);
    };

    take = (count: number = 1): SampleList => {
        const result = this.sample.map(x => {
            if (!Array.isArray(x.sampleUrl))
                return new Sample(x.selector, undefined);
            return new Sample(x.selector, x.sampleUrl.splice(0, count));
        });
        return new SampleList(result);
    };

    distinct = (): SampleList => {
        const result = this.sample.map(sample => {
            return new Sample(sample.selector, sample.sampleUrl.filter((value, index, self) => self.indexOf(value) === index));
        });
        return new SampleList(result);
    };

    resolveRelativeUrl = (baseUrl: string): SampleList => {
        const result = this.sample.map(x => {
            const absUrls = x.sampleUrl.map(y => {
                return {...y, href: resolve(baseUrl, y.href)};
            });
            return new Sample(x.selector, absUrls);
        });
        return new SampleList(result);
    };

    firstUnique = (count: number = 10): SampleList => {
        const result = this.sample
            .map(x => x.sampleUrl.map(hrefs => hrefs.href).join(','))
            .reduce((res, y) =>
                    res.indexOf(y) === -1 ? res.concat(y) : res
                , []).map(rez => rez.split(','));
        return new SampleList(result);
    };

    onlyUniqueUrlList = (): UrlSample[] => {
        const indices = [];
        const keys = [];
        const urlList = this.sample
            .map(x => UrlSample.fromSample(x));

        urlList
            .map(urlList => urlList.sampleUrl.join(','))
            .forEach((item, index) => {
                if (keys.indexOf(item) === -1) {
                    keys.push(item);
                    indices.push(index);
                }
            });
        return urlList.filter((x, index) => indices.indexOf(index) !== -1);
    };

}

export class UrlSampleList {
    constructor(readonly sample: UrlSample[]) {
    };

    static onlyUniqueUrlList(instance: SampleList): UrlSampleList {
        const indices = [];
        const keys = [];
        const urlList = instance.sample
            .map(x => UrlSample.fromSample(x));

        urlList
            .map(urlList => urlList.sampleUrl.join(','))
            .forEach((item, index) => {
                if (keys.indexOf(item) === -1) {
                    keys.push(item);
                    indices.push(index);
                }
            });
        return new UrlSampleList(urlList.filter((x, index) => indices.indexOf(index) !== -1));
    }
}

export class Sample {
    selector: string;
    sampleUrl: CssValue[];

    constructor(selector: string, value: CssValue[] = []) {
        this.selector = selector;
        this.sampleUrl = value;
    }
}

export class UrlSample {
    selector: string;
    sampleUrl: string[];

    static fromSample = (sample: Sample) => {
        return new UrlSample(sample.selector, sample.sampleUrl.map(x => x.href));
    };

    constructor(selector: string, value: string[] = []) {
        this.selector = selector;
        this.sampleUrl = value;
    }
}

export class SampleResponse {
    // ссылки на найденные примеры
    sampleUrl: string[] = [];
    // ссылки по селектору не найдены
    isSelectorEmpty: boolean = false;
    // заданный пример не найден
    isSampleUrlNotFound: boolean = false;
}
