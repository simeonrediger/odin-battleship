import { create2dArray } from '../shared/utils.js';

export default class Board {
    #grid;

    constructor(size) {
        this.#createGrid(size);
    }

    #createGrid(size) {
        this.#grid = create2dArray(size, size, this.#createCoordinate);
    }

    #createCoordinate() {
        return { occupant: null, attacked: false };
    }
}
