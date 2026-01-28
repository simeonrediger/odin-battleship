import eventBus from './event-bus.js';
import * as events from './events.js';
import game from './game.js';
import gameView from './game-view.js';

function init() {
    bindEvents();
}

function bindEvents() {
    eventBus.on(events.PLAYERS_SUBMITTED, submitPlayerCreation);
}

function start(root) {
    game.init();
    const gameContainer = root.querySelector("[data-role='game-container']");
    gameView.init(gameContainer, game.boardSize);
    gameView.submitPlayerCreation = submitPlayerCreation;
    game.start();
}

function submitPlayerCreation({
    player1Type,
    player1Name,
    player2Type,
    player2Name,
}) {
    const player1IsHuman = playerTypeIsHuman(player1Type);
    player1Name = normalizePlayerName(player1Name, true);
    const player2IsHuman = playerTypeIsHuman(player2Type);
    player2Name = normalizePlayerName(player2Name, false);

    game.submitPlayerCreation(
        player1IsHuman,
        player1Name,
        player2IsHuman,
        player2Name,
    );
}

function playerTypeIsHuman(type) {
    return type === 'human';
}

function normalizePlayerName(name, isPlayer1) {
    const fallback = isPlayer1 ? 'Player 1' : 'Player 2';
    name = name.trim();
    return name === '' ? fallback : name;
}

const gameController = {
    init,
    start,
};

export default gameController;
