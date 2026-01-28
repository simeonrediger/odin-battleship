import Board from '../board/board.js';
import eventBus from './event-bus.js';
import * as events from './events.js';
import Player from '../player.js';
import Ship from '../ship/ship.js';

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

const current = {
    phase: phases.GAME_INACTIVE,
    player: undefined,
    opponent: undefined,
};

function init() {
    bindEvents();
}

function bindEvents() {
    eventBus.on(events.PLAYERS_SUBMITTED, submitPlayerCreation);
    eventBus.on(events.SHIP_PLACEMENT_REQUESTED, handleShipPlacementRequest);
    eventBus.on(events.SHIP_PLACEMENTS_SUBMITTED, submitShipPlacements);
    eventBus.on(events.BOARD_ATTACK_REQUESTED, submitAttack);
    eventBus.on(events.GAME_RESTART_REQUESTED, restart);
}

function start() {
    validatePhase(phases.GAME_INACTIVE);
    enterPlayerCreation();
}

function submitPlayerCreation({
    player1IsHuman,
    player1Name,
    player2IsHuman,
    player2Name,
}) {
    validatePhase(phases.PLAYER_CREATION);
    player1 = createPlayer(player1IsHuman, player1Name || 'Player 1');
    player2 = createPlayer(player2IsHuman, player2Name || 'Player 2');
    setPlayer(player1);
    enterShipPlacements();
}

function handleShipPlacementRequest({ id, x, y, direction }) {
    validatePhase(phases.SHIP_PLACEMENTS_1, phases.SHIP_PLACEMENTS_2);
    current.player.placeShip(id, x, y, direction);
}

function submitShipPlacements() {
    validatePhase(phases.SHIP_PLACEMENTS_1, phases.SHIP_PLACEMENTS_2);

    eventBus.emit(events.SHIP_PLACEMENTS_COMPLETED, {
        wasPlayer1Turn: isPlayer1Turn(),
    });

    if (current.phase === phases.SHIP_PLACEMENTS_1) {
        setPlayer(player2);
        enterShipPlacements();
    } else {
        setPlayer(player1);
        enterRound();
    }
}

function submitAttack({ x, y }) {
    validatePhase(phases.PLAYER_1_ATTACK, phases.PLAYER_2_ATTACK);

    if (current.opponent.board.coordinateHit(x, y)) {
        return;
    }

    const shipHit = current.opponent.board.hit(x, y);

    eventBus.emit(events.BOARD_ATTACKED, {
        x,
        y,
        shipHit,
        sunkShipCoordinates: current.opponent.board.getSunkShipCoordinates(
            x,
            y,
        ),
    });

    if (shipHit) {
        if (current.opponent.defeated) {
            declareWinner(current.player);
            return;
        }
    } else {
        switchAttacker();
        enterRound();
    }
}

function switchAttacker() {
    if (current.phase === phases.PLAYER_1_ATTACK) {
        setPlayer(player2);
    } else {
        setPlayer(player1);
    }
}

function restart() {
    validatePhase(phases.GAME_OVER);
    current.phase = phases.GAME_INACTIVE;
    start();
    eventBus.emit(events.GAME_RESTART_COMPLETED);
}

function enterPlayerCreation() {
    current.phase = phases.PLAYER_CREATION;
    eventBus.emit(events.ENTERED_PLAYER_CREATION);
}

function enterShipPlacements() {
    if (current.phase !== phases.SHIP_PLACEMENTS_1) {
        current.phase = phases.SHIP_PLACEMENTS_1;
    } else {
        current.phase = phases.SHIP_PLACEMENTS_2;
    }

    const shipsData = current.player.shipsToPlaceData;
    shipsData.forEach(shipData => (shipData.direction = Ship.directions.RIGHT));

    eventBus.emit(events.ENTERED_SHIP_PLACEMENTS, {
        playerName: current.player.name,
        opponentName: current.opponent.name,
        shipsData,
    });
}

function enterRound() {
    if (current.phase !== phases.PLAYER_1_ATTACK) {
        current.phase = phases.PLAYER_1_ATTACK;
    } else {
        current.phase = phases.PLAYER_2_ATTACK;
    }

    eventBus.emit(events.ENTERED_ROUND, {
        playerName: current.player.name,
    });
}

function declareWinner(winner) {
    current.phase = phases.GAME_OVER;
    eventBus.emit(events.GAME_WON, { winnerName: winner.name });
}

function shipValid(id, x, y, direction) {
    const shipsData = current.player.shipsToPlaceData;
    const length = shipsData.find(ship => ship.id === id).length;
    return current.player.board.shipValid({ x, y, direction, length });
}

function isPlayer1Turn() {
    return current.player === player1;
}

function setPlayer(player) {
    current.player = player;
    current.opponent = player === player1 ? player2 : player1;
}

function createPlayer(isHuman, name) {
    return new Player(name, isHuman, new Board(), createShips(shipLengths));
}

function createShips(shipLengths) {
    return shipLengths.map(length => new Ship(length));
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
    shipValid,
    isPlayer1Turn,
};

export default game;
