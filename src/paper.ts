import KeyCombination from './key-combination';

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

    handleKeyDown(e: KeyboardEvent) {
        if (this.handleShortcutKey(e)) {
            return;
        }

        if (e.key === 'Enter') {
            console.log('enter pressed', e);
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
