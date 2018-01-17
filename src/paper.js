import _ from 'lodash';

export default class Paper {
    constructor(container, plugins) {
        this.container = container;
        this.shortcuts = [];

        const hw = window.document.createTextNode('Hello, world!');
        container.appendChild(hw);

        container.setAttribute('contenteditable', true);
        container.addEventListener('input', this.handleInput.bind(this));
        container.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        for (const plugin of plugins) {
            plugin.registerWith(this);
        }
    }

    addKeyboardShortcut(shortcutKey, callback) {
        this.shortcuts.push({ shortcutKey, callback });        
    }

    handleKeyDown(e) {
        const base = { ctrlKey: false, altKey: false, shiftKey: false, metaKey: false };
        const attempted = { 
            ctrlKey: e.ctrlKey, 
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            key: e.key
        };

        if (attempted.ctrlKey || attempted.shiftKey || attempted.altKey || attempted.metaKey) {
            for (const shortcut of this.shortcuts) {
                const registered = { ...base, ...shortcut.shortcutKey};

                if (_.isEqual(attempted, registered)) {
                    const selection = window.getSelection();
                    e.preventDefault();
                    const cursor = shortcut.callback({
                        container: this.container,
                        currentSelection: selection,
                    });                    

                    if (cursor) {
                        selection.removeAllRanges();
                        selection.addRange(cursor);
                    }
                }
            }
        }
    }

    // A selection that begins and ends in our container.


    handleSelectionChange(e) {
    }

    handleInput(e) {
    }
};
