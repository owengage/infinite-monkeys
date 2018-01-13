import React, { Component } from 'react';
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

export default class Paper extends Component {
    render() {
        return <div onInput={this.handleInput} contentEditable={true}>
            Edit <a href='#'>me</a> test.
        </div>;
    }

    handleInput(e) {
        e.persist();
        //console.log(e);

        //console.log('Printing child nodes');
        //for (const node of e.target.childNodes) {
        //    console.log({node});
        //}        

        linkTest(e.target);

//        const el = e.target;
//        const range = document.createRange();
//        const sel = window.getSelection();
//        range.setStart(el.childNodes[0], 1);
//        range.collapse(true);
//        sel.removeAllRanges();
//        sel.addRange(range);
//        el.focus();
    }
}

