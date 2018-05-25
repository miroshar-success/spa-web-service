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
        )).map(v => new Sample(v[0], v[1].map(link => link.data[0])));
        return new SampleList(sample);
    };

    orderByDesc = (meta: EuristicMeta): SampleList => {
        const result = [...this.sample].sort((x, y) => EuristicOrderService.compare(y.data, x.data, meta));
        return new SampleList(result);
    };

    takeSample = (count: number = 1): SampleList => {
        const result = this.sample.map(x => {
            if (!Array.isArray(x.data))
                return new Sample(x.selector, undefined);
            return new Sample(x.selector, x.data.splice(0, count));
        });
        return new SampleList(result);
    };

    take = (from: number = 0, count: number = 10) : SampleList => {
        return new SampleList([...this.sample].slice(from,count));
    };

    distinct = (): SampleList => {
        const result = this.sample.map(sample => {
            return new Sample(sample.selector, sample.data.filter((value, index, self) => self.findIndex(x=> x.href === value.href) === index));
        });
        return new SampleList(result);
    };

    resolveRelativeUrl = (baseUrl: string): SampleList => {
        const result = this.sample.map(x => {
            const absUrls = x.data.map(y => {
                return {...y, href: resolve(baseUrl, y.href)};
            });
            return new Sample(x.selector, absUrls);
        });
        return new SampleList(result);
    };

    unique = (): SampleList => {
        const indices = [];
        const keys = [];

        this.sample
            .map(urlList => urlList.data.map(elem=>elem.href).join(','))
            .forEach((item, index) => {
                if (keys.indexOf(item) === -1) {
                    keys.push(item);
                    indices.push(index);
                }
            });
        return new SampleList(this.sample.filter((x, index) => indices.indexOf(index) !== -1));
    };

    toOut = (): SelectorOut[] => {
        return this.sample.map(x => {
            return {
                selector: x.selector,
                sample: {
                    url: x.data[0].href,
                    meta: x.data[0].meta
                }
            }
        })
    }
}

export class Sample {

    constructor(public readonly selector: string, public readonly data: CssValue[]){

    }
}


export class FetchOut{
    meta: Meta;
    selectors: SelectorOut[]
}

export class SelectorOut {
    selector: string;
    sample: SampleOut;
}

export class SampleOut {
    url: string;
    meta: Meta;
}

export class Meta {
    image: string;
    title: string;
}

export class SampleResponse {
    // ссылки на найденные примеры
    sampleUrl: SampleOut[] = [];
    // ссылки по селектору не найдены
    isSelectorEmpty: boolean = false;
    // заданный пример не найден
    isSampleUrlNotFound: boolean = false;
}
