import window from '../window';
import { isTextNode, isElementNode } from '../node-utils';

function isInsideLink(root, node) {
    let current = node;

    while ((current = current.parentNode) !== root) {
        if (isElementNode(current) && current.tagName === 'A') {
            return true;
        }
    }

    return false;
}

export default class Hyperlinker {
    constructor() {
        this.keyboardShortcut = {
            ctrlKey: true,
            key: 'k',
        };
    }

    registerWith(paper) {
        paper.addKeyboardShortcut(
            this.keyboardShortcut,
            this.trigger.bind(this));
    }
    
    trigger({ container, currentSelection }) {
        const { anchorNode, anchorOffset, focusNode, focusOffset } = currentSelection;

        // Not handling links spanning more than one node for now.
        if (this.isInternalSelection(container, currentSelection) 
            && anchorNode.isSameNode(focusNode)
            && isTextNode(anchorNode)
            && ! isInsideLink(container, anchorNode)) {

            const node = anchorNode;
            const left = Math.min(anchorOffset, focusOffset);
            const right = Math.max(anchorOffset, focusOffset);

            const linkText = node.splitText(left);
            const trailingText = linkText.splitText(right - left);

            const a = window.document.createElement('a');
            a.setAttribute('href', '#');
            a.appendChild(linkText);

            container.insertBefore(a, trailingText); 
         
            // We want to return a new range that should be the new selection
            // if the caller deems it should move the cursor.
            const cursor = window.document.createRange();
            cursor.setStart(trailingText, 0);
            cursor.setEnd(trailingText, 0);
            return cursor;
        }

        console.info('Selection was not valid for a hyperlink.');
        return null;
    }

    isInternalSelection(container, selection) {
       return container.contains(selection.anchorNode)
            && container.contains(selection.focusNode);
    }
}
