import modalSource from './modal.html';
import KeyCombination from '../key-combination';
import { isTextNode, isElementNode, deferFocus, setCursor } from '../node-utils';

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
        this.keyboardShortcut = new KeyCombination({
            ctrl: true,
            key: 'k',
        });
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
            this.modalElement = window.document.createElement('div');
            this.modalElement.innerHTML = modalSource;
            this.initModal();
            resolve();
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
            if (e.target === curtain) {
                this.onCancel();
            }
        };
    }

    onCancel() {
        this.modalElement.querySelector('form').reset();
        this.hideModal();
    }

    getUrlEl() {
        return this.modalElement.querySelector('input[name=link_url]'); 
    }

    getTitleEl() {
        return this.modalElement.querySelector('input[name=link_title]');
    }

    onSubmit(e) {
        e.preventDefault();
        const { startContainer, startOffset, endOffset } = this.linkRange;

        const linkText = startContainer.splitText(startOffset);
        const trailingText = linkText.splitText(endOffset - startOffset);
        linkText.remove(); 

        const a = this.createLink(
            this.getTitleEl().value,
            this.getUrlEl().value);

        trailingText.before(a); 

        this.hideModal();
        setCursor(trailingText, 0);
    }

    createLink(title, url) {
        const a = window.document.createElement('a');
        a.setAttribute('href', url);
        a.appendChild(document.createTextNode(title));
        return a;
    }

    showModal({ selectedRange }) {
        window.addEventListener('keydown', this.escListener);
        window.addEventListener('click', this.curtainListener);
        document.body.appendChild(this.modalElement);
        this.linkRange = selectedRange;

        const title = selectedRange.toString();
        const titleEl = this.getTitleEl();

        if (title) {
            const urlEl = this.getUrlEl();
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
    
    trigger({ selectedRange, originalEvent }) {
        originalEvent.preventDefault();

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
            console.info('Selection was not valid for a hyperlink.', selectedRange);
        }
    }

    rangeInsideContainer(range) {
       return this.container.contains(range.startContainer)
            && this.container.contains(range.endContainer);
    }
}
