import './style.css';

import { validateElements } from '@/shared/utils.js';

let container;

function render(root) {
    cacheElements(root);
}

function cacheElements(root) {
    container = root.querySelector("[data-role='board']");
    validateElements({ container });
}

const gameView = {
    render,
};

export default gameView;
