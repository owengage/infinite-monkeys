import KeyCombination from './key-combination';
import { setCursor } from './node-utils';

export interface PluginCallbackParams {
    container: Element;
    selectedRange: Range;
    originalEvent: Event;
}

export interface ShortcutAction {
    shortcutKey: KeyCombination;
    callback(p: PluginCallbackParams): void;
}

export interface Plugin {
    registerWith(paper: Paper): Promise<void>;
    trigger?(params: PluginCallbackParams): void;
}

export default class Paper {
    constructor(container: Element, plugins: Plugin[]) {
        this.container = container;
        this.shortcuts = [];

        const hw = window.document.createTextNode('Hello, world!');
        container.appendChild(hw);

        const pluginLoadings = [];

        for (const plugin of plugins) {
            const name = plugin.constructor.name;
            console.info('Loading', name);
            pluginLoadings.push(
                plugin
                    .registerWith(this)
                    .then(() => console.info('Loaded', name))
            );
        }

        Promise.all(pluginLoadings).then(() => {
            console.info('Loaded all plug-ins for Paper');
            container.setAttribute('contenteditable', 'true');
            container.addEventListener('input', this.handleInput.bind(this));
            container.addEventListener('keydown', this.handleKeyDown.bind(this));
        }).catch(e => {
            console.error('Failed to load all plug-ins for Paper', e);
        });
    }

    getContainer() {
        return this.container;
    }

    addKeyboardShortcut(shortcutKey: KeyCombination, callback: (p:PluginCallbackParams) => void) {
        this.shortcuts.push({ shortcutKey, callback });        
    }

    currentParagraph(): HTMLElement {
        // Fix case where selection is null somehow.
        const selection = window.getSelection();
        let current: Node = selection!.anchorNode;
        let last = current;

        while ((current = current.parentNode!) !== this.container) {
            last = current;
        }

        if (last instanceof HTMLElement) {
            return last;
        } else {
            throw new Error('Tried to add paragraph, but top level node was not an element.'); 
        }
    }

    /**
     * Split the paragraph currently selected at the selection point.
     */
    splitCurrentParagraph(): void {
        const currentPara = this.currentParagraph();

        // What about text after the cursor? Wants to be moved to the next
        // paragraph.
        //
        // Steps:
        // 1. Create new paragraph tag after current.
        // 2. Split current text node.
        // 3. Move all nodes after the split point to the new paragraph.
        // 4. Add a <br/> tag if no nodes were moved.

        const newPara = document.createElement('p');

        const selection = window.getSelection();

        if (!selection) {
            return; // not actually looking at a paragraph.
        }

        const selectedNode = selection.anchorNode;

        if (!(selectedNode instanceof Text)) {
            throw new Error('Expected current node to be a text node.');
        }

        const startNode = selectedNode.splitText(selection.anchorOffset);


        const br = document.createElement('br');
        newPara.appendChild(br);
        currentPara.insertAdjacentElement('afterend', newPara);
        setCursor(newPara, 0);
    }

    handleKeyDown(e: KeyboardEvent) {
        if (this.handleShortcutKey(e)) {
            return;
        }

        const keyCombo = KeyCombination.fromEvent(e);

        if (!keyCombo.hasModifier()) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.splitCurrentParagraph();
                return;
            }
        }
    }

    handleShortcutKey(e: KeyboardEvent) {
        const attempted = KeyCombination.fromEvent(e);

        if (attempted.hasModifier()) {
            for (const shortcut of this.shortcuts) {
                if (attempted.equals(shortcut.shortcutKey)) {
                    shortcut.callback({
                        container: this.container,
                        selectedRange: window.getSelection().getRangeAt(0),
                        originalEvent: e,
                    });                    
                    return true;
                }
            }
        }

        return false;
    }

    handleSelectionChange(e: Event) {
    }

    handleInput(e: Event) {
    }

    container: Element;
    shortcuts: ShortcutAction[];
};
