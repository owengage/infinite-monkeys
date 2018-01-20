import Paper from './paper';
import Hyperlinker from './hyperlinker'

const hyperlinker = new Hyperlinker();
const paperContainer = document.getElementById('paper');
const paper = new Paper(paperContainer, [
    hyperlinker
]);
