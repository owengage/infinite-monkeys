declare module "*.html" {
    const content: any;
    export default content;
}

interface Node {
    getRootNode(): Node;
}

interface ChildNode {
    before(n: Node): void;
}
