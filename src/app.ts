import Paper from './paper';
import Hyperlinker from './hyperlinker';
import LocalStorange from './local-storage';

const hyperlinker = new Hyperlinker();
const localStore = new LocalStorange();

const paperContainer = document.getElementById('paper');

if (!paperContainer) {
    throw new Error('Did not find element with id paper to create Paper within.');
}

const paper = new Paper(paperContainer, [
    localStore,
    hyperlinker
]);
