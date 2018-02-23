declare module "*.html" {
    const content: any;
    export default content;
}

interface Node {
    getRootNode(): Node;
}

interface Window {
    createDocumentFragment(): DocumentFragment
}

interface ChildNode {
    before(n: Node): void;
}
