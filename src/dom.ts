export class TextNotInRootError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TextNotInRootError";
        this.stack = (<any> new Error()).stack;

        // Error is strange. It doesn't have the right prototype set if you 
        // extend it. This fixes it.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function cleave(root: HTMLElement, splitNode: Text, splitOffset: number): DocumentFragment {
    if (!root.contains(splitNode)) {
        throw new TextNotInRootError('Node to split on was not within the root element to split.');
    }

    const frag = document.createDocumentFragment();

    const afterText = splitNode.splitText(splitOffset);
    const beforeText = splitNode;

    const p1 = document.createElement('p');
    p1.appendChild(beforeText);

    const p2 = document.createElement('p');
    p2.appendChild(afterText);

    frag.appendChild(p1);
    frag.appendChild(p2);
    return frag;
}

export interface ElArgs {
    tag: string;
    attrs?: Attr[];
    contents?: Node[];
}

export function attr(name: string, value: string) {
    const a = document.createAttribute(name);
    a.value = value;
    return a;
}

export function text(value: string) {
    return document.createTextNode(value);
}

export function el(args: string | ElArgs): HTMLElement {
    if (typeof args == 'string') {
        return el({ tag: args });
    }
    const root = document.createElement(args.tag);
    for (let attr of args.attrs || []) {
        root.setAttributeNode(attr);
    }
    for (let sub of args.contents || []) {
        root.appendChild(sub);
    }
    return root;
}

