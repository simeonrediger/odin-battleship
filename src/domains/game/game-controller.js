import game from './game.js';
import gameView from './game-view.js';

function start(root) {
    game.init({
        onEnterPlayerCreation: handleEnterPlayerCreation,
        onEnterShipPlacements: handleEnterShipPlacements,
        onAllShipsPlaced: gameView.enableContinueButton,
        onEnterRound: handleEnterRound,
        onDeclareWinner: handleDeclareWinner,
    });

    const gameContainer = root.querySelector("[data-role='game-container']");

    gameView.init(gameContainer, game.boardSize, {
        getShipCoordinates: game.getShipCoordinates,
        isPlayer1Turn: () => game.isPlayer1Turn,
        shipValid: game.shipValid,
        onShipPreviewSubmit: submitShipPreview,
    });

    gameView.submitPlayerCreation = submitPlayerCreation;
    gameView.submitShipPlacements = game.submitShipPlacements;
    gameView.restartGame = game.restart;

    game.start();
}

function handleEnterPlayerCreation() {
    gameView.showPlayerCreation();
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

function handleEnterShipPlacements(shipsData) {
    gameView.showShipPlacements(
        game.currentPlayerName,
        game.currentOpponentName,
        game.isPlayer1Turn,
        shipsData,
    );
}

function submitShipPreview(id, x, y, direction) {
    return game.placeShip(id, x, y, direction);
}

function handleEnterRound() {}

function handleDeclareWinner(name) {}

const gameController = {
    start,
};

export default gameController;
