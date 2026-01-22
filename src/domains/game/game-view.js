import '@/shared/styles/utilities.css';
import './styles/button.css';
import './styles/input.css';
import './styles/menu.css';

import { validateElements } from '@/shared/utils.js';

let container;

const player1 = {
    creationMenu: undefined,
};

const player2 = {
    creationMenu: undefined,
};

function init(containerElement) {
    cacheElements(containerElement);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });

    player1.creationMenu = container.querySelector(
        "[data-role='player-1-creation']",
    );
    player2.creationMenu = container.querySelector(
        "[data-role='player-2-creation']",
    );

    validateElements({
        'player1.creationMenu': player1.creationMenu,
        'player2.creationMenu': player2.creationMenu,
    });
}

function showPlayerCreation() {
    player1.creationMenu.classList.remove('hidden');
    player2.creationMenu.classList.remove('hidden');
}

const gameView = {
    init,
    showPlayerCreation,
};

export default gameView;
