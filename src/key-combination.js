import _ from 'lodash';

export default class KeyCombination {
    constructor({key, ctrl, alt, shift, meta}) {
        this.key = key;
        this.ctrl = ctrl || false;
        this.alt = alt || false;
        this.shift = shift || false;
        this.meta = meta || false;
    }

    static fromEvent(e) {
        return new KeyCombination({
            key: e.key,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey,
            meta: e.metaKey
        });
    }
    
    equals(keyCombo) {
        if (!(keyCombo instanceof KeyCombination)) {
            throw new Error('Not given a key combination.');
        }
        return _.isEqual(this, keyCombo);
    }

    hasModifier() {
        return this.ctrl || this.alt || this.shift || this.meta;
    }
}
