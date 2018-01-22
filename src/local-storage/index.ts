import Paper, { Plugin } from '../paper';

export default class LocalStorageSaver implements Plugin {
    constructor() {
        this.key = 'oak-local-storage-saver';
    }

    registerWith(paper: Paper) {
        this.container = paper.getContainer();

        window.addEventListener('beforeunload', e => {
            localStorage.setItem(this.key, this.container.innerHTML);
        });

        this.load();

        return Promise.resolve();
    }; 

    load() {
        const dom = localStorage.getItem(this.key);
        if (dom) {
            this.container.innerHTML = dom;
        } else {
            console.info('LocalStorageSaver: No previous save. Making new one.');
            this.container.innerHTML = 'Hello, world!';
        }
    }

    container: Element;
    key: string;
};
