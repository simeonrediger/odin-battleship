import { adoptValuesOfCommonKeys } from '@/shared/utils.js';
import Board from '../board/board.js';
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
let shipsToPlace;

const current = {
    phase: phases.GAME_INACTIVE,
    player: undefined,
    opponent: undefined,
};

let eventBus;

const handlers = {
    onPlayerChange: undefined,
    onEnterShipPlacements: undefined,
    onAllShipsPlaced: undefined,
    onEnterRound: undefined,
    onDeclareWinner: undefined,
    onAttack: undefined,
};

function init(eventBusObj, handlersObj) {
    eventBus = eventBusObj;
    validatePhase(phases.GAME_INACTIVE);
    adoptValuesOfCommonKeys(handlers, handlersObj);
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

function placeShip(shipId, x, y, direction) {
    validatePhase(phases.SHIP_PLACEMENTS_1, phases.SHIP_PLACEMENTS_2);
    const ship = shipsToPlace.find(ship => ship.id === shipId);
    const placedShipData = current.player.board.placeShip(
        ship,
        x,
        y,
        direction,
    );
    shipsToPlace = shipsToPlace.filter(remainingShip => remainingShip !== ship);

    if (shipsToPlace.length === 0) {
        handlers.onAllShipsPlaced();
    }

    return placedShipData;
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

    if (current.opponent.board.coordinateHit(x, y)) {
        return;
    }

    const shipHit = current.opponent.board.hit(x, y);

    handlers.onAttack(
        current.player === player1,
        shipHit,
        x,
        y,
        current.opponent.board.getSunkShipCoordinates(x, y),
    );

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

    shipsToPlace = createShips(shipLengths);

    handlers.onEnterShipPlacements(
        shipsToPlace.map(ship => ({
            id: ship.id,
            length: ship.length,
            direction: Ship.directions.RIGHT,
        })),
    );
}

function enterRound() {
    if (current.phase !== phases.PLAYER_1_ATTACK) {
        current.phase = phases.PLAYER_1_ATTACK;
    } else {
        current.phase = phases.PLAYER_2_ATTACK;
    }

    handlers.onEnterRound(current.player === player1, current.player.name);
}

function declareWinner(winner) {
    current.phase = phases.GAME_OVER;
    handlers.onDeclareWinner(winner.name);
}

function setPlayer(player) {
    current.player = player;
    current.opponent = player === player1 ? player2 : player1;
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
    restart,

    getShipCoordinates: Board.getNearestInBoundsShipCoordinates,

    shipValid(id, x, y, direction) {
        const length = shipsToPlace.find(ship => ship.id === id).length;
        return current.player.board.shipValid({ x, y, direction, length });
    },

    get boardSize() {
        return Board.size;
    },

    get currentPlayerName() {
        return current.player.name;
    },

    get currentOpponentName() {
        return current.opponent.name;
    },

    get isPlayer1Turn() {
        return current.player === player1;
    },
};

export default game;
