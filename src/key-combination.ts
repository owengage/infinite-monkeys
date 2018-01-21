import { isEqual } from 'lodash';

export interface KeyCombinationOptions {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
}

export default class KeyCombination {
    constructor(o: KeyCombinationOptions) {
        this.key = o.key;
        this.ctrl = o.ctrl || false;
        this.alt = o.alt || false;
        this.shift = o.shift || false;
        this.meta = o.meta || false;
    }

    static fromEvent(e: KeyboardEvent) {
        return new KeyCombination({
            key: e.key,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey,
            meta: e.metaKey
        });
    }
    
    equals(keyCombo: KeyCombination) {
        return isEqual(this, keyCombo);
    }

    hasModifier() {
        return this.ctrl || this.alt || this.shift || this.meta;
    }

    key: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
}
