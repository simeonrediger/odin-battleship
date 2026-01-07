export default class Ship {
    #length;
    #hits = 0;

    constructor(length) {
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
