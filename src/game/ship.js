export default class Ship {
    static directions = Object.freeze({
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
    });

    direction;

    #length;
    #hits = 0;

    constructor(length, direction) {
        if (length <= 0) {
            throw new RangeError('Length must be a positive integer');
        }

        if (!Object.values(Ship.directions).includes(direction)) {
            throw new TypeError(`Invalid direction: ${direction}`);
        }

        this.#length = length;
        this.direction = direction;
    }

    get length() {
        return this.#length;
    }

    get sunk() {
        return this.#hits >= this.#length;
    }

    hit() {
        this.#hits++;
    }
}
