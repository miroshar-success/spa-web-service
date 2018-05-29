import * as _ from 'lodash'
import {Meta} from './scanner.sample';

export class CssValue {
    href: string;
    isImageInside: boolean;
    meta: Meta;
}

export class CssPath {

    path: string[];
    value: CssValue;

    static fromNode = (node: CheerioElement): CssPath => {
        const parents: string[] = [];

        const value = CssPath.buildValue(node);
        //объект, чтобы работать по ссылке а не по значению
        let flags = {isRouted: false};

        while (node !== null) {
            const path: string = CssPath.buildPath(node, flags);
            parents.push(path);
            node = node.parent;
        }

        const result: CssPath = new CssPath();
        result.path = parents.reverse();
        result.value = value;
        return result;
    };

    static buildValue = (node: CheerioElement): CssValue => {
        const value = node.attribs.href;
        let isImageInside = false;
        let meta = {image: null, title: null};

        let imagePart = node.children.find(x => x.name === 'img');
        if(imagePart !== undefined) {
            isImageInside = true;
        }

        return {href: value, isImageInside, meta}
    };

    static buildPath = (node: CheerioElement, flags: any): string => {
        const parent = node.parent;
        if (parent === null || parent.children.length <= 1)
            return node.name;
        const filtered = parent.children.filter(x => x.name && x.name.trim().length > 0);
        let isEqualChildTag;
        if (filtered.length > 1)
            isEqualChildTag = filtered.every(x => x.name === filtered[0].name &&
                _.isEqual(x.children.map(ch1 => ch1.name), filtered[0].children.map(ch2 => ch2.name)));
        else
            isEqualChildTag = false;
        if (isEqualChildTag) {
            if (flags.isRouted) {
                const index = filtered.findIndex(x => x === node);
                return node.name + `:nth-child(${index + 1})`;
            }
            else {
                flags.isRouted = true;
                return node.name;
            }
        }
        else {
            return node.name;
        }
    };

    cssSelector = (): string => {
        return this.path.join(' > ');
    }
}
