import { JSDOM } from 'jsdom'
import { expect } from 'chai'
import 'mocha'

const dom = new JSDOM();
(<any>global)['window'] = dom.window;
(<any>global)['document'] = dom.window.document;

const {cleave} = require('../src/dom'); //import { cleave } from '../src/dom'

describe('cleave', () => {
    it('should split simple text node', () => {
        // <p>onetwo</p> --> <p>one</p><p>two</p>
        const p = document.createElement('p');
        const text = document.createTextNode('onetwo');
        p.appendChild(text);
        const root = cleave(p, text, 3);
        expect(root instanceof HTMLElement).to.be.true;
    });
});


