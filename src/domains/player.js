import Board from './board/board.js';
import eventBus from './game/event-bus.js';
import * as events from './game/events.js';
import Ship from './ship/ship.js';

export default class Player {
    #id;
    #name;
    #isHuman;
    #board;
    #shipsToPlace;

    constructor(name, isHuman, board, shipsToPlace) {
        this.#validateArgs(name, isHuman, board, shipsToPlace);
        this.#id = crypto.randomUUID();
        this.#name = name;
        this.#isHuman = isHuman;
        this.#board = board;
        this.#shipsToPlace = shipsToPlace;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get isHuman() {
        return this.#isHuman;
    }

    get board() {
        return this.#board;
    }

    get defeated() {
        return this.#board.allShipsSunk;
    }

    get shipsToPlaceData() {
        return this.#shipsToPlace.map(ship => ({
            id: ship.id,
            length: ship.length,
        }));
    }

    shipValid(id, x, y, direction) {
        const length = this.#shipsToPlace.find(ship => ship.id === id).length;
        return this.#board.shipValid({ x, y, direction, length });
    }

    placeShip(
        id,
        x,
        y,
        direction,
        {
            board = this.#board,
            onAllShipsPlaced = this.#handleAllShipsPlaced,
        } = {},
    ) {
        const ship = this.#shipsToPlace.find(ship => ship.id === id);
        board.placeShip(ship, x, y, direction);

        this.#shipsToPlace = this.#shipsToPlace.filter(
            remainingShip => remainingShip !== ship,
        );

        if (this.#shipsToPlace.length === 0) {
            onAllShipsPlaced();
        }
    }

    #handleAllShipsPlaced() {
        eventBus.emit(events.ALL_SHIPS_PLACED);
    }

    #validateArgs(name, isHuman, board, shipsToPlace) {
        if (typeof name !== 'string') {
            throw new TypeError(`Name must be a string. Got ${typeof name}`);
        }

        if (typeof isHuman !== 'boolean') {
            throw new TypeError(
                `isHuman must be a boolean. Got ${typeof isHuman}`,
            );
        }

        if (!(board instanceof Board)) {
            throw new TypeError('board must be an instance of Board');
        }

        if (!Array.isArray(shipsToPlace)) {
            throw new TypeError('shipsToPlace must be an Array');
        }

        if (shipsToPlace.some(element => !(element instanceof Ship))) {
            throw new TypeError(
                'shipsToPlace elements must be instances of Ship',
            );
        }
    }
}
