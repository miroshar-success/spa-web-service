import * as path from 'url';

export const SELECTORS = {
    LINKS: 'a[href]'
};
export const FILTERS = {
    IMG: inst => inst.filterChild(y => y.name === 'img'),
    EMPTY_HREF: inst => inst.filterAttr(y => y.href === ''),
    HOME_HREF: (inst, params) => inst.filterAttr(y => y.href === new path.URL(params.url).origin),
    HREF: (inst, params) => inst.filterAttr(y => params.url.test(y.href)),
};

export class ScannerInstance {
    constructor(private readonly _instance: Cheerio) {
    }

    select = (...linkTypes: string[]): ScannerInstance => {
        return new ScannerInstance(this._instance(...linkTypes));
    }
    filter = (predicate: (node: Cheerio) => ScannerInstance, params: any): ScannerInstance => {
        return predicate(this, params);
    }
    filterChild = (predicate: (node: Cheerio) => boolean): ScannerInstance => {
        const result = this._instance.filter((index, node) => {
            return node.children !== undefined ? !node.children.some(child => predicate(child)) : false;
        });
        return new ScannerInstance(result);
    }
    filterAttr = (predicate: (node: Cheerio) => boolean): ScannerInstance => {
        const result = this._instance.filter((index, node) => node.attribs !== undefined ? !predicate(node.attribs) : false);
        return new ScannerInstance(result);
    }
    get instance(): CheerioElement[]{
        return this._instance;
    }

    toArray(): CheerioElement[]{
        return this._instance.toArray();
    }
}