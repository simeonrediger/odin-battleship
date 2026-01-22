import '@/shared/styles/utilities.css';
import './styles/button.css';
import './styles/input.css';
import './styles/layout.css';

import { adoptValuesOfCommonKeys, validateElements } from '@/shared/utils.js';

let container;
let announcer;
let continueButton;

const player1 = {
    creationMenu: undefined,
    typeInput: undefined,
    nameInput: undefined,
};

const player2 = {
    creationMenu: undefined,
    typeInput: undefined,
    nameInput: undefined,
};

const handlers = {
    onContinueClick: undefined,
};

function init(containerElement, handlersObj) {
    cacheElements(containerElement);
    adoptValuesOfCommonKeys(handlers, handlersObj);
    Object.keys(handlers).forEach(key => (handlers[key] = handlersObj[key]));
    bindEvents();
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });

    announcer = container.querySelector("[data-role='announcer']");
    continueButton = container.querySelector("[data-action='continue']");

    player1.creationMenu = container.querySelector(
        "[data-role='player-1-creation']",
    );
    player1.typeInput = container.querySelector("[data-input='player-1-type']");
    player1.nameInput = container.querySelector("[data-input='player-1-name']");

    player2.creationMenu = container.querySelector(
        "[data-role='player-2-creation']",
    );
    player2.typeInput = container.querySelector("[data-input='player-2-type']");
    player2.nameInput = container.querySelector("[data-input='player-2-name']");

    validateElements({
        announcer,
        continueButton,
        'player1.creationMenu': player1.creationMenu,
        'player1.typeInput': player1.typeInput,
        'player1.nameInput': player1.nameInput,
        'player2.creationMenu': player2.creationMenu,
        'player2.typeInput': player2.typeInput,
        'player2.nameInput': player2.nameInput,
    });
}

function bindEvents() {
    continueButton.addEventListener('click', handleContinueClick);
}

function handleContinueClick() {
    handlers.onContinueClick(
        player1.typeInput.value,
        player1.nameInput.value,
        player2.typeInput.value,
        player2.nameInput.value,
    );
}

function showPlayerCreation() {
    announcer.textContent = "Who's playing?";
    player1.creationMenu.classList.remove('hidden');
    player2.creationMenu.classList.remove('hidden');
}

const gameView = {
    init,
    showPlayerCreation,
};

export default gameView;
