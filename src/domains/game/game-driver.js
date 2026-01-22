import game from './game.js';
import gameView from './game-view.js';

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

    gameView.init(gameContainer);
    game.start();
}

function handleEnterPlayerCreation() {
    if (gameCompleted) {
        console.log('Game restarted');
        return;
    }

    gameView.showPlayerCreation();
    game.submitPlayerCreation(true, 'P1', true, 'P2');
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
