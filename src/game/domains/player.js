import Board from './board.js';

export default class Player {
    #id;
    #name;
    #isHuman;
    #board;

    constructor(name, isHuman, board) {
        this.#validateArgs(name, isHuman, board);
        this.#id = crypto.randomUUID();
        this.#name = name;
        this.#isHuman = isHuman;
        this.#board = board;
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
    }
}
