import eventBus from './event-bus.js';
import game from './game.js';
import gameView from './game-view.js';

function start(root) {
    game.init(eventBus, {
        onEnterRound: handleEnterRound,
        onDeclareWinner: handleDeclareWinner,
        onAttack: gameView.renderAttack,
    });

    const gameContainer = root.querySelector("[data-role='game-container']");

    gameView.init(gameContainer, game.boardSize, eventBus, {
        getShipCoordinates: game.getShipCoordinates,
        isPlayer1Turn: () => game.isPlayer1Turn,
        shipValid: game.shipValid,
        onShipPreviewSubmit: submitShipPreview,
        onSubmitAttack: game.submitAttack,
    });

    gameView.submitPlayerCreation = submitPlayerCreation;
    gameView.submitShipPlacements = game.submitShipPlacements;
    gameView.restartGame = game.restart;

    game.start();
}

function submitPlayerCreation(
    player1Type,
    player1Name,
    player2Type,
    player2Name,
) {
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

function submitShipPreview(id, x, y, direction) {
    return game.placeShip(id, x, y, direction);
}

function handleEnterRound(isPlayer1Turn, playerName) {
    gameView.showRound(isPlayer1Turn, playerName);
}

function handleDeclareWinner(name) {
    gameView.handleWin(name);
}

const gameController = {
    start,
};

export default gameController;
