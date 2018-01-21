export const isNodeType = (node, type) => node.nodeType === type;
export const isTextNode = node => isNodeType(node, Node.TEXT_NODE);
export const isElementNode = node => isNodeType(node, Node.ELEMENT_NODE);


/**
 * Focus on an element. Works for elements just appended to the DOM.
 *
 * It appears that just setting focus is not reliable for elements being added
 * to the DOM in the same function. I suspect because the element hasn't
 * actually been put into the DOM yet. By setting a zero timeout it gets
 * deferred until the current queue is cleared (I believe).
 */
export function deferFocus(element) {
    setTimeout(() => {
        element.focus();
    }, 0);
}

export function setCursor(node, offset) {
    const newRange = document.createRange();
    newRange.setStart(node, offset);
    newRange.setEnd(node, offset);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(newRange);
}
