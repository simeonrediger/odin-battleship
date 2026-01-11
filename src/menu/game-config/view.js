import './style.css';

import { validateElements } from '@/shared/utils.js';

let form;
const player1 = { typeInput: undefined, nameInput: undefined };
const player2 = { typeInput: undefined, nameInput: undefined };
let submitButton;

let onSubmit;

function render(root, onSubmitHandler) {
    onSubmit = onSubmitHandler;
    cacheElements(root);
    bindEvents();
}

function cacheElements(root) {
    form = root.querySelector("[data-form='game-config']");
    validateElements({ form });

    player1.typeInput = form.querySelector("[data-input='player-1-type']");
    player1.nameInput = form.querySelector("[data-input='player-1-name']");
    player2.typeInput = form.querySelector("[data-input='player-2-type']");
    player2.nameInput = form.querySelector("[data-input='player-2-name']");
    submitButton = form.querySelector("[data-action='submit-game-config']");

    validateElements({
        'player1.typeInput': player1.typeInput,
        'player1.nameInput': player1.nameInput,
        'player2.typeInput': player2.typeInput,
        'player2.nameInput': player2.nameInput,
        submitButton,
    });
}

function bindEvents() {
    form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();
    cachePlayerData(player1);
    cachePlayerData(player2);

    onSubmit({
        player1Data: { isHuman: player1.isHuman, name: player1.name },
        player2Data: { isHuman: player2.isHuman, name: player2.name },
    });
}

function cachePlayerData(player) {
    player.isHuman = player.typeInput.value === 'human';

    player.name =
        player.isHuman && player.nameInput.value.trim()
            ? player.nameInput.value.trim()
            : player.nameInput.placeholder;
}

const gameConfigView = {
    render,
};

export default gameConfigView;
