import { transformTextNode } from './hyperlinks';

function getNodeTypeString(node) {
    if (isTextNode(node)) {
        return 'TEXT';
    } else if (isElementNode(node)) {
        return 'ELEMENT';
    } else {
        return 'UNKNOWN';
    }
}

const isNodeType = (node, type) => node.nodeType === type;
const isTextNode = node => isNodeType(node, Node.TEXT_NODE);
const isElementNode = node => isNodeType(node, Node.ELEMENT_NODE);

function linkTest(target) {
    for (const node of target.childNodes) {
        if (isTextNode(node)) {
            const expanded = transformTextNode(node);
            if (expanded) {
                target.replaceChild(expanded, node);
            }
        }
    }
}

/**
 * Get the total text offset from the start of the container node of the given selection.
 */ 
function textOffsetFromDomOffset(container, domOffset) {
    let offset = 0;
    let it = document.createNodeIterator(container, NodeFilter.SHOW_TEXT);
    let node;
    while (node = it.nextNode()) {
        if (node.isSameNode(domOffset.node)) {
            return offset + domOffset.offset;
        }
        offset += node.data.length;
    }
}

/**
 * Find the node and offset within that node that would be find if counting the
 * characters in the entire cotnainer.
 * 
 * returns { node, offset }
 */
function domOffsetFromTextOffset(container, textOffset) {
    let currentOffset = 0;
    let it = document.createNodeIterator(container, NodeFilter.SHOW_TEXT);
    let node;
    let lastNode; // if we run off the end, we need to remember the last text node.

    while (node = it.nextNode()) {
        if (currentOffset + node.data.length > textOffset) {
            return { node, offset: textOffset - currentOffset };
        }
        currentOffset += node.data.length;
        lastNode = node;
    }

    return { node: lastNode, offset: lastNode.data.length };
}

function debugSelectionInfo(e) {
    const selection = window.getSelection();

    let cursorLeft = textOffsetFromDomOffset(e.target, {
        node: selection.anchorNode, 
        offset: selection.anchorOffset
    });

    // Get the node back for sanity check.
    let { node, offset } = domOffsetFromTextOffset(e.target, cursorLeft);

    console.log('left:', cursorLeft);
    console.log('node:', node, 'offset:', offset);
}

export default class Paper {
    constructor(container) {
        const hw = window.document.createTextNode('Hello, world!');
        container.appendChild(hw);

        container.setAttribute('contenteditable', true);
        container.addEventListener('input', this.handleInput);
        container.addEventListener('selectionchange', this.handleSelectionChange);
        container.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        console.log('key pressed');
    }

    handleSelectionChange(e) {
        console.log('selection changed');
        debugSelectionInfo(e);
    }

    handleInput(e) {
        console.log('Printing child nodes');
        for (const node of e.target.childNodes) {
            console.log({node});
        }        

        linkTest(e.target);

//        const el = e.target;
//        const range = document.createRange();
//        const sel = window.getSelection();
//        range.setStart(el.childNodes[0], 1);
//        range.collapse(true);
//        sel.removeAllRanges();
//        sel.addRange(range);
//        el.focus();

        const selection = window.getSelection();
        console.log(selection.anchorOffset);
    }
};
