import { JSDOM } from 'jsdom'
import { expect } from 'chai'
import 'mocha'

const dom = new JSDOM();
(<any>global)['window'] = dom.window;
(<any>global)['document'] = dom.window.document;

const { cleave, TextNotInRootError, el, attr, text } = require('../src/dom');

describe('el', () => {
    it('should let you create a simple p tag', () => {
        expect(el({tag: 'p'}) instanceof HTMLParagraphElement).to.be.true;
    });

    it('should let you create a simple p tag with shorthand', () => {
        expect(el('p') instanceof HTMLParagraphElement).to.be.true;
    });

    it('should let you add attributes', () => {
        const e = el({ tag: 'p', attrs: [
            attr('data-test', '123'),
            attr('data-hello', 'world'),
        ]});
        expect(e.getAttribute('data-test')).to.equal('123');
        expect(e.getAttribute('data-hello')).to.equal('world');
    });

    it('should let you add child elements', () => {
        const e = el({ tag: 'ul', contents: [
            el('li'),
        ]});

        expect(e instanceof HTMLUListElement).to.be.true;
        expect(e.children).to.have.lengthOf(1);
        expect(e.childNodes[0] instanceof HTMLLIElement).to.be.true;

    });

    it('should let you add text', () => {
        const e = el({ tag: 'p', contents: [
            text('testing'),
        ]});

        expect(e.innerHTML).to.equal('testing');
    });
});

describe('cleave', () => {

    it('should throw if node to split is not under root', () => {
        const p = el('p');
        const t = text('Not in p');
        expect(() => cleave(p, t, 0)).to.throw(TextNotInRootError);
    });

    it('should split simple text node', () => {
        // <p>onetwo</p> --> <p>one</p><p>two</p>
        const t = text('onetwo');
        const p = el({ tag: 'p', contents: [t] });

        const root = cleave(p, t, 3);
        expect(root.children).to.have.lengthOf(2);
        expect(root.childNodes[0].innerHTML).to.equal('one');
        expect(root.childNodes[1].innerHTML).to.equal('two');
    });

    it('should keep a link before the split', () => {
        
    });

    // What to do about the cursor? Do we need to have that in this cleave or
    // can it be done around it?
});


