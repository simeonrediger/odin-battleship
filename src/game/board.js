import { create2dArray } from '../shared/utils.js';

export default class Board {
    static directions = Object.freeze({
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
    });

    #grid;
    #ships = [];
    #onDefeat;

    constructor(size, onDefeat) {
        if (!(size >= 0)) {
            const errorType = size < 0 ? RangeError : TypeError;
            throw new errorType('Size must be a non-negative integer');
        }

        this.#createGrid(size);
        this.#onDefeat = onDefeat;
    }

    placeShip(ship, x, y, direction) {
        const shipCoordinates = [];

        for (let i = 0; i < ship.length; i++) {
            const coordinate = this.#getCoordinate(x, y);

            if (!coordinate) {
                throw new RangeError(
                    `Coordinate is out of bounds: (${x}, ${y})`,
                );
            }

            if (coordinate.occupant) {
                throw new Error(`Coordinate is occupied: (${x}, ${y})`);
            }

            shipCoordinates.push(coordinate);
            [x, y] = this.#getAdjacentCoordinate(x, y, direction);
        }

        shipCoordinates.forEach(coordinate => (coordinate.occupant = ship));
        this.#ships.push(ship);
    }

    hit(x, y) {
        const coordinate = this.#getCoordinate(x, y);

        if (coordinate.attacked) {
            throw new Error('Coordinate has already been attacked');
        }

        coordinate.attacked = true;

        if (coordinate.occupant) {
            coordinate.occupant.hit();
        }

        this.#checkDefeat();
    }

    #checkDefeat() {
        if (this.#ships.every(ship => ship.sunk)) {
            this.#onDefeat?.();
        }
    }

    #createGrid(size) {
        this.#grid = create2dArray(size, size, this.#createCoordinate);
    }

    #createCoordinate() {
        return { occupant: null, attacked: false };
    }

    #getCoordinate(x, y) {
        const row = this.#grid.length - 1 - y;
        const column = x;
        return this.#grid[row]?.[column];
    }

    #getAdjacentCoordinate(x, y, direction) {
        switch (direction) {
            case Board.directions.UP:
                y++;
                break;
            case Board.directions.DOWN:
                y--;
                break;
            case Board.directions.LEFT:
                x--;
                break;
            case Board.directions.RIGHT:
                x++;
                break;
            default:
                throw new TypeError('Invalid direction:', direction);
        }

        return [x, y];
    }
}
