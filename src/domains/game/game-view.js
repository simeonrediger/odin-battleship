import { validateElements } from '@/shared/utils.js';

let container;

function init(containerElement) {
    cacheElements(containerElement);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });
}

const gameView = {
    init,
};

export default gameView;
