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

    #grid;
    #ships = [];

    constructor() {
        this.#createGrid(Board.#size);
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

    /* If unsunk discovered ship coordinates exist, returns 1 or 2 coordinates
       that extend the longest extensible segment. Otherwise, returns all
       undiscovered coordinates. */
    getSmartAttackCoordinates() {
        const unsunkDiscoveredShipCoordinates = [];
        const undiscoveredCoordinates = [];

        for (let x = 0; x < Board.#size; x++) {
            for (let y = 0; y < Board.#size; y++) {
                const cell = this.#getCell(x, y);

                if (!cell.attacked) {
                    undiscoveredCoordinates.push([x, y]);
                } else if (cell.occupant && !cell.occupant.sunk) {
                    unsunkDiscoveredShipCoordinates.push([x, y]);
                }
            }
        }

        if (unsunkDiscoveredShipCoordinates.length === 0) {
            return undiscoveredCoordinates;
        }

        return this.#getCoordinatesToExtendLongestSegment(
            unsunkDiscoveredShipCoordinates,
        );
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

        return { shipHit };
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

    #coordinatesArrayHasCoordinates(unsunkShipCoordinates, [x1, y1]) {
        return unsunkShipCoordinates.some(([x2, y2]) => x1 === x2 && y1 === y2);
    }

    #getCoordinatesToExtendLongestSegment(unsunkDiscoveredShipCoordinates) {
        const segments = [];
        const directions = [Ship.directions.RIGHT, Ship.directions.UP];

        // Randomize the prioritized axis of the follow-up attack
        if (Math.random() > 0.5) {
            directions.reverse();
        }

        for (const direction of directions) {
            for (let [x, y] of unsunkDiscoveredShipCoordinates) {
                const segment = { direction, coordinates: [] };
                let isConsecutive;

                do {
                    segment.coordinates.push([x, y]);
                    [x, y] = Board.#getAdjacentCoordinate(x, y, direction);
                    isConsecutive = this.#coordinatesArrayHasCoordinates(
                        unsunkDiscoveredShipCoordinates,
                        [x, y],
                    );
                } while (isConsecutive);

                segments.push(segment);
            }
        }

        segments.sort((a, b) => b.coordinates.length - a.coordinates.length);
        const followUpAttackCoordinates = [];

        for (const segment of segments) {
            let [x, y] = segment.coordinates[0];
            const first = { x, y };
            [x, y] = segment.coordinates[segment.coordinates.length - 1];
            const last = { x, y };

            const oppositeDirection =
                segment.direction === Ship.directions.RIGHT
                    ? Ship.directions.LEFT
                    : Ship.directions.DOWN;

            const prevCoordinates = Board.#getAdjacentCoordinate(
                first.x,
                first.y,
                oppositeDirection,
            );

            const nextCoordinates = Board.#getAdjacentCoordinate(
                last.x,
                last.y,
                segment.direction,
            );

            [prevCoordinates, nextCoordinates].forEach(([x, y]) => {
                const cell = this.#getCell(x, y);

                if (cell && !cell.attacked) {
                    followUpAttackCoordinates.push([x, y]);
                }
            });

            if (followUpAttackCoordinates.length > 0) {
                return followUpAttackCoordinates;
            }
        }

        throw new Error('No viable follow-up attack coordinates remaining');
    }
}
