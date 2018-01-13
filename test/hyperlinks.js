import { transformTextNode } from '../src/hyperlinks';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

// Create a fake DOM to do testing with.
const dom = new JSDOM(`
    <p id="simple-text-node">abc</p>
    <p id="simple-link">[text](url)</p>
    <p id="text-around-link">Click [here](url).</p>
`);

const doc = dom.window.document;
const simpleText = doc.querySelector('#simple-text-node').firstChild;
const simpleLink = doc.querySelector('#simple-link').firstChild;
const textAroundLink = doc.querySelector('#text-around-link').firstChild;
const Node = dom.window.Node;

function expectAnchor(node, {text, href}) {
    expect(node.nodeType).to.equal(Node.ELEMENT_NODE); 
    expect(node.nodeName).to.equal('A');    
    expect(node.childNodes).to.have.lengthOf(1);
    expect(node.childNodes[0].data).to.equal(text);
    expect(node.getAttribute('href')).to.equal(href);
}

describe('hyperlinks', () => {
    describe('transformTextNode', () => {

        it('should return array of same node given simple text node', () => {
            expect(transformTextNode(simpleText)).to.be.null; 
        });

        it('should return anchor node given markdown link', () => {
            const node = transformTextNode(simpleLink);
            expectAnchor(node, { text: 'text', href: 'url' });
        });

        it('should keep text around transformed anchor', () => {
            const node = transformTextNode(textAroundLink);
            expect(node.childNodes).to.have.lengthOf(3);

            const left = node.childNodes[0];
            const anchor = node.childNodes[1];
            const right = node.childNodes[2];

            expectAnchor(anchor, { text: 'here', href: 'url' });
        });

    });
});
