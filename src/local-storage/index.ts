import Paper from '../paper';

export default class LocalStorageSaver {
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
        this.container.innerHTML = localStorage.getItem(this.key);
    }

    container: Element;
    key: string;
};
