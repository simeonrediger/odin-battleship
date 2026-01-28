import { create2dArray } from '@/shared/utils.js';
import eventBus from '../game/event-bus.js';
import * as events from '../game/events.js';
import Ship from '../ship/ship.js';

export default class Board {
    static #size = 10;

    static get size() {
        return Board.#size;
    }

    static getShipCoordinates(x, y, direction, length) {
        const coordinates = [];

        for (let i = 0; i < length; i++) {
            coordinates.push([x, y]);
            [x, y] = Board.#getAdjacentCoordinate(x, y, direction);
        }

        return coordinates;
    }

    static getNearestInBoundsShipCoordinates(x, y, direction, length) {
        const original = { x, y };
        const outOfBoundsDelta = { x: 0, y: 0 };

        for (let i = 0; i < length; i++) {
            if (x < 0 && x < outOfBoundsDelta.x) {
                outOfBoundsDelta.x = x;
            } else if (x >= Board.#size && x > outOfBoundsDelta.x) {
                outOfBoundsDelta.x = x - Board.#size + 1;
            }

            if (y < 0 && y < outOfBoundsDelta.y) {
                outOfBoundsDelta.y = y;
            } else if (y >= Board.#size && y > outOfBoundsDelta.y) {
                outOfBoundsDelta.y = y - Board.#size + 1;
            }

            [x, y] = Board.#getAdjacentCoordinate(x, y, direction);
        }

        const adjusted = {
            x: original.x - outOfBoundsDelta.x,
            y: original.y - outOfBoundsDelta.y,
        };

        const coordinates = Board.getShipCoordinates(
            adjusted.x,
            adjusted.y,
            direction,
            length,
        );

        return coordinates;
    }

    static shipInBounds(x, y, direction, length) {
        const shipCoordinates = Board.getShipCoordinates(
            x,
            y,
            direction,
            length,
        );

        return shipCoordinates.every(([x, y]) =>
            Board.#coordinateInBounds(x, y),
        );
    }

    static #coordinateInBounds(x, y) {
        return x >= 0 && x < Board.#size && y >= 0 && y < Board.#size;
    }

    static #getAdjacentCoordinate(x, y, direction) {
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

    #id;
    #grid;
    #ships = [];

    constructor() {
        this.#id = crypto.randomUUID();
        this.#createGrid(Board.#size);
    }

    get id() {
        return this.#id;
    }

    get shipCount() {
        return this.#ships.length;
    }

    get allShipsSunk() {
        return this.#ships.every(ship => ship.sunk);
    }

    placeShip(ship, x, y, direction) {
        const shipCoordinates = Board.getShipCoordinates(
            x,
            y,
            direction,
            ship.length,
        );

        for (const [x, y] of shipCoordinates) {
            if (!Board.#coordinateInBounds(x, y)) {
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

        eventBus.emit(events.SHIP_PLACED, {
            id: ship.id,
            coordinates: shipCoordinates,
        });
    }

    coordinateHit(x, y) {
        const cell = this.#getCell(x, y);
        return cell.attacked;
    }

    hit(x, y) {
        const cell = this.#getCell(x, y);

        if (cell.attacked) {
            return { alreadyHit: true };
        }

        cell.attacked = true;
        const shipHit = Boolean(cell.occupant);
        let sunkShipCoordinates;

        if (shipHit) {
            const ship = cell.occupant;
            ship.hit();

            if (ship.sunk) {
                sunkShipCoordinates = this.#getCoordinatesByShip(ship);
            }
        }

        eventBus.emit(events.BOARD_ATTACKED, {
            x,
            y,
            shipHit,
            sunkShipCoordinates,
        });

        return {
            shipHit,
        };
    }

    shipOverlaps(x, y, direction, length) {
        const shipCoordinates = Board.getShipCoordinates(
            x,
            y,
            direction,
            length,
        );

        return shipCoordinates.some(([x, y]) => this.#coordinateOccupied(x, y));
    }

    shipValid({ x, y, direction, length }) {
        return (
            Board.shipInBounds(x, y, direction, length) &&
            !this.shipOverlaps(x, y, direction, length)
        );
    }

    getSunkShipCoordinates(x, y) {
        const ship = this.#getCell(x, y).occupant;
        return ship && ship.sunk ? this.#getCoordinatesByShip(ship) : false;
    }

    #coordinateOccupied(x, y) {
        const cell = this.#getCell(x, y);
        return Boolean(cell.occupant);
    }

    #getCoordinatesByShip(ship) {
        return this.#grid.flatMap((row, rowIndex) =>
            Object.entries(row)
                .filter(([, cell]) => cell.occupant === ship)
                .map(([x]) => [x, Board.#size - 1 - rowIndex]),
        );
    }

    #createGrid(size) {
        this.#grid = create2dArray(size, size, this.#createCell);
    }

    #createCell() {
        return { occupant: null, attacked: false };
    }

    #getCell(x, y) {
        const row = Board.#size - 1 - y;
        const column = x;
        return this.#grid[row]?.[column];
    }
}
