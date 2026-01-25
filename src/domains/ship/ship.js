export default class Ship {
    static directions = Object.freeze({
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
    });

    #id;
    #length;
    #hits = 0;

    constructor(length) {
        if (length <= 0) {
            throw new RangeError('Length must be a positive integer');
        }

        this.#id = crypto.randomUUID();
        this.#length = length;
    }

    get id() {
        return this.#id;
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
