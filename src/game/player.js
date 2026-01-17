export default class Player {
    #name;
    #isHuman;
    #board;

    constructor(name, isHuman, board) {
        this.#validateArgs(name, isHuman);
        this.#name = name;
        this.#isHuman = isHuman;
        this.#board = board;
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

    #validateArgs(name, isHuman) {
        if (typeof name !== 'string') {
            throw new TypeError(`Name must be a string. Got ${typeof name}`);
        }

        if (typeof isHuman !== 'boolean') {
            throw new TypeError(
                `isHuman must be a boolean. Got ${typeof isHuman}`,
            );
        }
    }
}
