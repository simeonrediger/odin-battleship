import '@/shared/styles/utilities.css';
import './styles/button.css';
import './styles/input.css';
import './styles/menu.css';

import { validateElements } from '@/shared/utils.js';

let container;
let player1Creation;
let player2Creation;

function init(containerElement) {
    cacheElements(containerElement);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });

    player1Creation = container.querySelector(
        "[data-role='player-1-creation']",
    );
    player2Creation = container.querySelector(
        "[data-role='player-2-creation']",
    );
    validateElements({ player1Creation, player2Creation });
}

function showPlayerCreation() {
    player1Creation.classList.remove('hidden');
    player2Creation.classList.remove('hidden');
}

const gameView = {
    init,
    showPlayerCreation,
};

export default gameView;
