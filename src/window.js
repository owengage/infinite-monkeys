// Detect whether we are in a NodeJS environment, otherwise assume we're in the browser.
const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'

if (isNode) {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('');
    module.exports = dom.window;
} else {
    module.exports = window;
}


