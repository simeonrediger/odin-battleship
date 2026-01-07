export default class Ship {
    #length;
    #hits = 0;

    constructor(length) {
        if (length <= 0) {
            throw new RangeError('Length must be a positive integer');
        }

        this.#length = length;
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
