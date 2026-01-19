import Board from './board/board.js';
import Player from './player.js';
import Ship from './ship.js';

const phases = Object.freeze({
    GAME_INACTIVE: 'GAME_INACTIVE',
    PLAYER_CREATION: 'PLAYER_CREATION',
    SHIP_PLACEMENTS_1: 'SHIP_PLACEMENTS_1',
    SHIP_PLACEMENTS_2: 'SHIP_PLACEMENTS_2',
    PLAYER_1_ATTACK: 'PLAYER_1_ATTACK',
    PLAYER_2_ATTACK: 'PLAYER_2_ATTACK',
    GAME_OVER: 'GAME_OVER',
});

let player1;
let player2;

const shipLengths = Object.freeze([5, 4, 3, 3, 2]);
let shipsToPlace;

const current = {
    phase: phases.GAME_INACTIVE,
    player: undefined,
    opponent: undefined,
};

const handlers = {
    onEnterPlayerCreation: undefined,
    onPlayerChange: undefined,
    onEnterShipPlacements: undefined,
    onEnterRound: undefined,
    onDeclareWinner: undefined,
};

function init(handlersObj) {
    Object.keys(handlers).forEach(key => (handlers[key] = handlersObj[key]));
}

function start() {
    validatePhase(phases.GAME_INACTIVE);
    enterPlayerCreation();
}

function submitPlayerCreation(
    player1IsHuman,
    player1Name,
    player2IsHuman,
    player2Name,
) {
    validatePhase(phases.PLAYER_CREATION);
    player1 = createPlayer(player1IsHuman, player1Name);
    player2 = createPlayer(player2IsHuman, player2Name);
    setPlayer(player1);
    enterShipPlacements();
}

function placeShip(shipId, x, y) {
    validatePhase(phases.SHIP_PLACEMENTS_1, phases.SHIP_PLACEMENTS_2);
    const ship = shipsToPlace.find(ship => ship.id === shipId);
    current.player.board.placeShip(ship, x, y);
}

function submitShipPlacements() {
    validatePhase(phases.SHIP_PLACEMENTS_1, phases.SHIP_PLACEMENTS_2);

    if (current.phase === phases.SHIP_PLACEMENTS_1) {
        setPlayer(player2);
        enterShipPlacements();
    } else {
        setPlayer(player1);
        enterRound();
    }
}

function submitAttack(x, y) {
    validatePhase(phases.PLAYER_1_ATTACK, phases.PLAYER_2_ATTACK);
    const shipHit = current.opponent.board.hit(x, y);

    if (current.opponent.defeated) {
        declareWinner(current.player);
        return;
    } else if (shipHit) {
        enterRound();
        return;
    } else if (current.phase === phases.PLAYER_1_ATTACK) {
        setPlayer(player2);
    } else {
        setPlayer(player1);
    }

    enterRound();
}

function enterPlayerCreation() {
    current.phase = phases.PLAYER_CREATION;
    handlers.onEnterPlayerCreation();
}

function enterShipPlacements() {
    if (current.phase !== phases.SHIP_PLACEMENTS_1) {
        current.phase = phases.SHIP_PLACEMENTS_1;
    } else {
        current.phase = phases.SHIP_PLACEMENTS_2;
    }

    shipsToPlace = createShips(shipLengths);
    handlers.onEnterShipPlacements(shipsToPlace.map(ship => ({ id: ship.id })));
}

function enterRound() {
    if (current.phase !== phases.PLAYER_1_ATTACK) {
        current.phase = phases.PLAYER_1_ATTACK;
    } else {
        current.phase = phases.PLAYER_2_ATTACK;
    }

    handlers.onEnterRound();
}

function declareWinner(winner) {
    current.phase = phases.GAME_OVER;
    handlers.onDeclareWinner(winner.name);
}

function setPlayer(player) {
    current.player = player;
    current.opponent = player === player1 ? player2 : player1;
    handlers.onPlayerChange(player.name);
}

function createPlayer(isHuman, name) {
    return new Player(name, isHuman, new Board());
}

function createShips(shipLengths) {
    return shipLengths.map(length => new Ship(length, Ship.directions.RIGHT));
}

function validatePhase(...validPhases) {
    if (!validPhases.includes(current.phase)) {
        const validPhasesList = validPhases.join(', ');
        throw new Error(
            `Action only allowed for ${validPhasesList}, not ${current.phase}`,
        );
    }
}

const game = {
    init,
    start,
    submitPlayerCreation,
    placeShip,
    submitShipPlacements,
    submitAttack,
};

export default game;
