import { create2dArray } from '@/shared/utils.js';
import Ship from '../ship.js';

export default class Board {
    #size = 10;
    #grid;
    #ships = [];
    #onDefeat;
    #reportsDefeat = false;

    constructor(onDefeat) {
        this.#createGrid(this.#size);

        if (onDefeat) {
            this.#onDefeat = onDefeat;
            this.#reportsDefeat = true;
        }
    }

    get size() {
        return this.#size;
    }

    get shipCount() {
        return this.#ships.length;
    }

    placeShip(ship, x, y) {
        const shipCoordinates = this.getShipCoordinates(
            x,
            y,
            ship.direction,
            ship.length,
        );

        for (const [x, y] of shipCoordinates) {
            if (!this.#coordinateInBounds(x, y)) {
                throw new RangeError(
                    `Coordinate is out of bounds: (${x}, ${y})`,
                );
            }

            if (this.#coordinateOccupied(x, y)) {
                throw new Error(`Coordinate is occupied: (${x}, ${y})`);
            }
        }

        shipCoordinates.forEach(([x, y]) => {
            const cell = this.#getCell(x, y);
            cell.occupant = ship;
        });

        this.#ships.push(ship);

        const placedShipData = {
            x,
            y,
            direction: ship.direction,
            length: ship.length,
        };

        return placedShipData;
    }

    coordinateHit(x, y) {
        const cell = this.#getCell(x, y);
        return cell.attacked;
    }

    hit(x, y) {
        const cell = this.#getCell(x, y);

        if (cell.attacked) {
            throw new Error('Coordinate has already been attacked');
        }

        cell.attacked = true;
        const shipHit = Boolean(cell.occupant);

        if (shipHit) {
            cell.occupant.hit();
        }

        this.#checkDefeat();
        return shipHit;
    }

    getShipCoordinates(x, y, direction, length) {
        const coordinates = [];

        for (let i = 0; i < length; i++) {
            coordinates.push([x, y]);
            [x, y] = this.#getAdjacentCoordinate(x, y, direction);
        }

        return coordinates;
    }

    shipInBounds(x, y, direction, length) {
        const shipCoordinates = this.getShipCoordinates(
            x,
            y,
            direction,
            length,
        );

        return shipCoordinates.every(([x, y]) =>
            this.#coordinateInBounds(x, y),
        );
    }

    shipOverlaps(x, y, direction, length) {
        const shipCoordinates = this.getShipCoordinates(
            x,
            y,
            direction,
            length,
        );

        return shipCoordinates.some(([x, y]) => this.#coordinateOccupied(x, y));
    }

    shipValid({ x, y, direction, length }) {
        return (
            this.shipInBounds(x, y, direction, length) &&
            !this.shipOverlaps(x, y, direction, length)
        );
    }

    getNearestInBoundsAnchorCoordinate(x, y, direction, length) {
        const original = { x, y };
        const outOfBoundsDelta = { x: 0, y: 0 };

        for (let i = 0; i < length; i++) {
            if (x < 0 && x < outOfBoundsDelta.x) {
                outOfBoundsDelta.x = x;
            } else if (x >= this.#size && x > outOfBoundsDelta.x) {
                outOfBoundsDelta.x = x - this.#size + 1;
            }

            if (y < 0 && y < outOfBoundsDelta.y) {
                outOfBoundsDelta.y = y;
            } else if (y >= this.#size && y > outOfBoundsDelta.y) {
                outOfBoundsDelta.y = y - this.#size + 1;
            }

            [x, y] = this.#getAdjacentCoordinate(x, y, direction);
        }

        return [
            original.x - outOfBoundsDelta.x,
            original.y - outOfBoundsDelta.y,
        ];
    }

    #coordinateInBounds(x, y) {
        return x >= 0 && x < this.#size && y >= 0 && y < this.#size;
    }

    #coordinateOccupied(x, y) {
        const cell = this.#getCell(x, y);
        return Boolean(cell.occupant);
    }

    #checkDefeat() {
        if (this.#reportsDefeat && this.#ships.every(ship => ship.sunk)) {
            this.#onDefeat();
        }
    }

    #createGrid(size) {
        this.#grid = create2dArray(size, size, this.#createCell);
    }

    #createCell() {
        return { occupant: null, attacked: false };
    }

    #getCell(x, y) {
        const row = this.#size - 1 - y;
        const column = x;
        return this.#grid[row]?.[column];
    }

    #getAdjacentCoordinate(x, y, direction) {
        switch (direction) {
            case Ship.directions.UP:
                y++;
                break;
            case Ship.directions.DOWN:
                y--;
                break;
            case Ship.directions.LEFT:
                x--;
                break;
            case Ship.directions.RIGHT:
                x++;
                break;
            default:
                throw new TypeError(`Invalid direction: ${direction}`);
        }

        return [x, y];
    }
}
