export default class LocalStorageSaver {
    constructor() {
        this.key = 'oak-local-storage-saver';
    }

    registerWith(paper) {
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

};
