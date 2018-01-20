import window from '../window';

import modalPath from './modal.wc.html';
import { isTextNode, isElementNode, deferFocus } from '../node-utils';

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
        this.container = paper.getContainer();
        paper.addKeyboardShortcut(
            this.keyboardShortcut,
            this.trigger.bind(this));

        return this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            const link = window.document.createElement('link');
            link.rel = 'import';
            link.href = modalPath;
            link.onload = e => {
                this.modalElement = link.import.body
                this.initModal();
                resolve();
            };
            link.onerror = e => {
                reject();
            };

            // Cause download of our HTML.
            window.document.head.appendChild(link);
        });
    }

    initModal() {
        const modal = this.modalElement;
        const curtain = modal.querySelector('.curtain');
        const form = modal.querySelector('form');
        const cancel = form.querySelector('#cancel');

        form.onsubmit = this.onSubmit.bind(this);
        cancel.onclick = this.onCancel.bind(this);

        this.escListener = e => {
            if (e.key === 'Escape') {
                this.onCancel();
            }
        };

        this.curtainListener = e => {
            console.log('curtain listen');
            if (e.target === curtain) {
                this.onCancel();
            }
        };
    }

    onCancel() {
        this.modalElement.querySelector('form').reset();
        this.hideModal();
    }

    onSubmit(e) {
        e.preventDefault();

        const formUrl = this.modalElement.querySelector('input[name=link_url]').value;
        const formTitle = this.modalElement.querySelector('input[name=link_title]').value;

        const { startContainer, startOffset, endContainer, endOffset } = this.linkRange;
        const node = startContainer;
        const left = Math.min(startOffset, endOffset);
        const right = Math.max(startOffset, endOffset);

        const linkText = node.splitText(left);
        const trailingText = linkText.splitText(right - left);

        linkText.remove(); 

        const a = window.document.createElement('a');
        a.setAttribute('href', formUrl);
        a.appendChild(document.createTextNode(formTitle));

        this.container.insertBefore(a, trailingText); 
        this.hideModal();

        const newRange = document.createRange();
        newRange.setStart(trailingText, 0);
        newRange.setEnd(trailingText, 0);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);
    }

    showModal({ selectedRange }) {
        window.addEventListener('keydown', this.escListener);
        window.addEventListener('click', this.curtainListener);
        document.body.appendChild(this.modalElement);
        this.linkRange = selectedRange;

        const title = selectedRange.toString();
        const titleEl = this.modalElement.querySelector('input[name=link_title]');

        if (title) {
            const urlEl = this.modalElement.querySelector('input[name=link_url]');
            titleEl.value = title;
            deferFocus(urlEl);
        } else {
            deferFocus(titleEl);
        }
    }

    hideModal() {
        this.modalElement.querySelector('form').reset();
        this.linkRange = null;
        window.removeEventListener('keydown', this.escListener);
        window.removeEventListener('click', this.curtainListener);
        this.modalElement.remove();
    }

    isModalShowing() {
        return this.modalElement.getRootNode() === document;
    }
    
    trigger({ selectedRange }) {
        
        // If the modal is already showing ignore a trigger.
        if (this.isModalShowing()) {
            return;
        }

        const { startContainer, endContainer } = selectedRange;

        // Not handling links spanning more than one node for now.
        if (this.rangeInsideContainer(selectedRange) 
            && startContainer.isSameNode(endContainer)
            && isTextNode(startContainer)
            && ! isInsideLink(this.container, startContainer)) {

            this.showModal({
                selectedRange
            });
        } else {
            console.info('Selection was not valid for a hyperlink.');
        }
    }

    rangeInsideContainer(range) {
       return this.container.contains(range.startContainer)
            && this.container.contains(range.endContainer);
    }
}
