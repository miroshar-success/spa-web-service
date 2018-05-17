import * as url from "url"
export class CssPath {
    path: string[];
    value: string;

    static fromNode(node: CheerioElement) {
        const parents: string[] = [];
        const value = node.attribs.href;
        while (node !== null) {
            const path: string = CssPath.buildPath(node);
            parents.push(path);
            node = node.parent;
        }
        const result: CssPath = new CssPath();
        result.path = parents.reverse();
        result.value = value;
        return result;
    }

    static buildPath = (node: Cheerio): string => {
        let selector: string = '';
        selector += node.name;
        if (node.attribs.id !== undefined) {
            selector += '#' + node.attribs.id;
        }
        if (node.attribs.class !== undefined) {
            selector += '.' + node.attribs.class.split(' ').join('.');
        }
        return selector;
    }

    cssSelector = (): string => {
        return this.path.join(' > ');
    }
}

export class SampleList {
    constructor(private readonly _sample: Sample[]) {
    }

    get sample() {
        return this._sample;
    }

    set sample(sample: Sample[]) {
        this._sample = sample;
    }

    static fromPaths(paths: CssPath[], deep: number = 1): SampleList {
        const sample = paths.map(x => {
            const group: Sample = new Sample();
            group.sampleUrl = [x.value];
            group.selector = x.path.splice(0, x.path.length - deep).join(' > ');
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

    orderByAsc = (): SampleList => {
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

    distinct = (): SampleList => {}
}

export class Sample {
    selector: string;
    sampleUrl: string[];

    constructor(selector: string, value: string[] = []) {
        this.selector = selector;
        this.sampleUrl = value;
    }
}
