import {CssPath} from './scanner.csspath';
import * as path from 'url';

export class SampleList {
    constructor(readonly sample: Sample[]) {
    }

    static fromPaths(paths: CssPath[], deep: number = 1): SampleList {
        const sample = paths.map(x => {
            const group: Sample = new Sample(
                [...x.path].splice(0, x.path.length - deep).join(' > ') + '[href]',
                [x.value]
            );
            return group;
        });
        return new SampleList(sample);
    }

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
    }

    orderByDesc = (): SampleList => {
        const result = [...this.sample].sort((x, y) => y.sampleUrl.length - x.sampleUrl.length);
        return new SampleList(result);
    }

    take = (count: number = 1): SampleList => {
        const result = this.sample.map(x => {
            if (!Array.isArray(x.sampleUrl))
                return new Sample(x.selector, undefined);
            return new Sample(x.selector, x.sampleUrl.splice(0, count));
        });
        return new SampleList(result);
    }

    distinct = (): SampleList => {
        const result = this.sample.map(sample=>{
            return new Sample(sample.selector,sample.sampleUrl.filter((value, index, self) => self.indexOf(value) === index));
        });
        return new SampleList(result);
    }

    resolveRelativeUrl = (baseUrl: string): SampleList => {
        const result = this.sample.map(x => {
            const absUrls = x.sampleUrl.map(y =>  new path.URL(y, baseUrl).href);
            return new Sample(x.selector, absUrls);
        });
        return new SampleList(result);
    }
}

export class Sample {
    selector: string;
    sampleUrl: string[];

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
