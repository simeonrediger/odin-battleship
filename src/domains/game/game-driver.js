import game from './game.js';
import gameView from './game-view.js';

let continueHandler;

let player = 1;
let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0;

function start(root) {
    game.init({
        onEnterPlayerCreation: handleEnterPlayerCreation,
        onEnterShipPlacements: handleEnterShipPlacements,
        onEnterRound: handleEnterRound,
        onDeclareWinner: handleDeclareWinner,
    });

    const gameContainer = root.querySelector("[data-role='game-container']");

    gameView.init(gameContainer, game.boardSize, {
        onContinueClick: (...args) => continueHandler(...args),
    });

    game.start();
}

function handleEnterPlayerCreation() {
    continueHandler = submitPlayerCreation;
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

function handleEnterShipPlacements(shipIds) {
    gameView.showShipPlacements(
        game.currentPlayerName,
        game.currentOpponentName,
        game.isPlayer1Turn,
        shipIds,
    );
}

function handleEnterRound() {
    console.log('Entered round');

    if (player === 1) {
        y1 = x1 < 10 ? y1 : y1 + 1;
        x1 = x1 < 10 ? x1 : 0;
        console.log(`Submitting attack to (${x1}, ${y1})`);
        game.submitAttack(x1++, y1);
    } else {
        y2 = x2 < 10 ? y2 : y2 + 1;
        x2 = x2 < 10 ? x2 : 0;
        console.log(`Submitting attack to (${x2}, ${y2})`);
        game.submitAttack(x2++, y2);
    }
}

function handleDeclareWinner(name) {
    console.log(`${name} wins`);
    game.restart();
}

const gameDriver = {
    start,
};

export default gameDriver;
