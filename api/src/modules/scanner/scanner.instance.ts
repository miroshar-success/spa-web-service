import * as path from 'url';
import {CssPath} from './scanner.csspath';

export const SELECTORS = {
    LINKS: 'a[href]'
};
export const FILTERS = {
    IMG: inst => inst.filterChild(y => y.name === 'img'),
    EMPTY_HREF: inst => inst.filterAttr(y => y.href === ''),
    HOME_HREF: (inst, params) => inst.filterAttr(y => y.href === new path.URL(params.url).origin),
    INVALID_HREF: (inst) => inst.filterAttr(y => /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(y.href)),
    HREF: (inst, params) => inst.filterAttr(y => params.url.test(y.href)),
};

export class ScannerInstance {
    constructor(readonly instance: CheerioElement[]) {
    }

    static fromCheerio = (node: CheerioStatic, ...linkTypes: string[]) : ScannerInstance => {
        return new ScannerInstance(node(...linkTypes).toArray());
    }
    filter = (predicate: (node: Cheerio) => ScannerInstance, params: any): ScannerInstance => {
        return predicate(this, params);
    }
    filterChild = (predicate: (node: Cheerio) => boolean): ScannerInstance => {
        const result = this.instance.filter((node, index) => {
            return node.children !== undefined ? !node.children.some(child => predicate(child)) : false;
        });
        return new ScannerInstance(result);
    }
    filterAttr = (predicate: (node: Cheerio) => boolean): ScannerInstance => {
        const result = this.instance.filter((node, index) => node.attribs !== undefined ? !predicate(node.attribs) : false);
        return new ScannerInstance(result);
    }
    getPaths = (): CssPath[] => {
       return this.instance.map(node => CssPath.fromNode(node));
    }

}