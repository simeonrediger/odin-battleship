import game from './game.js';
import gameView from './game-view.js';

let continueHandler;

let gameCompleted = false;

let player = 1;
let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0;

function start(root) {
    game.init({
        onEnterPlayerCreation: handleEnterPlayerCreation,
        onPlayerChange: handlePlayerChange,
        onEnterShipPlacements: handleEnterShipPlacements,
        onEnterRound: handleEnterRound,
        onDeclareWinner: handleDeclareWinner,
    });

    const gameContainer = root.querySelector("[data-role='game-container']");

    gameView.init(gameContainer, {
        onContinueClick: (...args) => continueHandler(...args),
    });

    game.start();
}

function handleEnterPlayerCreation() {
    continueHandler = submitPlayerCreation;

    if (gameCompleted) {
        console.log('Game restarted');
        return;
    }

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

function handlePlayerChange(name) {
    console.log('Current player:', name);
    player = name === 'P1' ? 1 : 2;
}

function handleEnterShipPlacements(shipIds) {
    console.log('Entered ship placements. Received:', shipIds);
    game.placeShip(shipIds[0].id, 4, 3);
    game.placeShip(shipIds[1].id, 4, 4);
    game.placeShip(shipIds[2].id, 4, 5);
    game.placeShip(shipIds[3].id, 4, 6);
    game.placeShip(shipIds[4].id, 4, 7);
    game.submitShipPlacements();
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
    gameCompleted = true;
    game.restart();
}

const gameDriver = {
    start,
};

export default gameDriver;
