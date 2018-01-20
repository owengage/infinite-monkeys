import Paper from './paper';
import Hyperlinker from './hyperlinker';
import LocalStorange from './local-storage';

const hyperlinker = new Hyperlinker();
const localStore = new LocalStorange();

const paperContainer = document.getElementById('paper');
const paper = new Paper(paperContainer, [
    localStore,
    hyperlinker
]);
