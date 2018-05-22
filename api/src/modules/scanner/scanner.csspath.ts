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

    static buildPath = (node: CheerioElement): string => {
        return node.name;
    }

    cssSelector = (): string => {
        return this.path.join(' > ');
    }
}
