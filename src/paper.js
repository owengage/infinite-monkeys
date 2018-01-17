const isNodeType = (node, type) => node.nodeType === type;
const isTextNode = node => isNodeType(node, Node.TEXT_NODE);
const isElementNode = node => isNodeType(node, Node.ELEMENT_NODE);

export default class Paper {
    constructor(container) {
        this.container = container;

        const hw = window.document.createTextNode('Hello, world!');
        container.appendChild(hw);

        container.setAttribute('contenteditable', true);
        container.addEventListener('input', this.handleInput.bind(this));
        container.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Selection change only fires on the document, not individual elements
        // We'd have to filter out selection events not in our container.
        //window.document.addEventListener('selectionchange', this.handleSelectionChange);
    }

    handleKeyDown(e) {
        console.log('key pressed');
        const { key, ctrlKey, altKey, shiftKey, metaKey } = e
        console.log({key, ctrlKey, altKey, shiftKey, metaKey});

        // Create a link.
        if (key === 'k' && ctrlKey) {
            e.preventDefault();
            const selection = window.getSelection();
            const cursor = this.makeLink(selection);
            selection.removeAllRanges();
            selection.addRange(cursor);
        }
    }

    // A selection that begins and ends in our container.
    isInternalSelection(selection) {
       return this.container.contains(selection.anchorNode)
            && this.container.contains(selection.focusNode);
    }

    makeLink(selection) {
        // Not handling links spanning more than one node for now.
        if (this.isInternalSelection(selection) 
            && selection.anchorNode.isSameNode(selection.focusNode)
            && isTextNode(selection.anchorNode)) {

            const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
            const node = selection.anchorNode;
            const left = Math.min(anchorOffset, focusOffset);
            const right = Math.max(anchorOffset, focusOffset);

            const linkText = node.splitText(left);
            const trailingText = linkText.splitText(right - left);

            const a = window.document.createElement('a');
            a.setAttribute('href', '#');
            a.appendChild(linkText);

            this.container.insertBefore(a, trailingText); 
         
            // We want to return a new range that should be the new selection
            // if the caller deems it should move the cursor.
            const cursor = window.document.createRange();
            cursor.setStart(trailingText, 0);
            cursor.setEnd(trailingText, 0);
            return cursor;
        }
    }

    handleSelectionChange(e) {
    }

    handleInput(e) {
    }
};
