import Board from './board/board.js';
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

    #validateArgs(name, isHuman, board) {
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
