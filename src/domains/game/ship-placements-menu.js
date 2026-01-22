import { validateElements } from '@/shared/utils.js';

let container;

function init(containerElement) {
    cacheElements(containerElement);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });
}

const shipPlacementsMenu = {
    init,
};

export default shipPlacementsMenu;
