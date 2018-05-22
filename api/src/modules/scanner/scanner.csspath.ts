import * as _ from "lodash"

export class CssValue {
    href: string;
    isImageInside: boolean;
}

export class CssPath {

    path: string[];
    value: CssValue;

    static fromNode = (node: CheerioElement): CssPath => {
        const parents: string[] = [];
        const value = node.attribs.href;
        //объект, чтобы рвботать по ссылке а не по значению
        let flags = {isRouted: false};
        while (node !== null) {
            let domMeta = {};
            const path: string = CssPath.buildPath(node, flags, domMeta);
            parents.push(path);
            node = node.parent;
        }
        const result: CssPath = new CssPath();
        result.path = parents.reverse();
        result.value = {href: value, isImageInside: false};
        return result;
    };

    static buildPath = (node: CheerioElement, flags: any, domMeta: any): string => {
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
