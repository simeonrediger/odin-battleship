import Board from './board/board.js';
import Player from './player.js';
import Ship from './ship.js';

const phases = Object.freeze({
    PLAYER_CREATION: 'PLAYER_CREATION',
    SHIP_PLACEMENTS_1: 'SHIP_PLACEMENTS_1',
});

let player1;
let player2;

const shipLengths = Object.freeze([5, 4, 3, 3, 2]);
let shipsToPlace;

const current = {
    phase: undefined,
    player: undefined,
};

const handlers = {
    onEnterPlayerCreation: undefined,
    onPlayerChange: undefined,
    onEnterShipPlacements: undefined,
};

function init({
    onEnterPlayerCreation,
    onPlayerChange,
    onEnterShipPlacements,
}) {
    handlers.onEnterPlayerCreation = onEnterPlayerCreation;
    handlers.onPlayerChange = onPlayerChange;
    handlers.onEnterShipPlacements = onEnterShipPlacements;
}

function start() {
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

function enterPlayerCreation() {
    current.phase = phases.PLAYER_CREATION;
    handlers.onEnterPlayerCreation();
}

function enterShipPlacements() {
    current.phase = phases.SHIP_PLACEMENTS_1;
    shipsToPlace = createShips(shipLengths);
    handlers.onEnterShipPlacements(shipsToPlace.map(ship => ({ id: ship.id })));
}

function setPlayer(player) {
    current.player = player;
    handlers.onPlayerChange(player.name);
}

function createPlayer(isHuman, name) {
    return new Player(name, isHuman, new Board());
}

function createShips(shipLengths) {
    return shipLengths.map(length => new Ship(length, Ship.directions.RIGHT));
}

function validatePhase(phase) {
    if (current.phase !== phase) {
        throw new Error(
            `Action only allowed for ${phase}, not ${current.phase}`,
        );
    }
}

const game = {
    init,
    start,
    submitPlayerCreation,
};

export default game;
