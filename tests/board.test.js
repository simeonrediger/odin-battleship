import Board from '../src/game/board.js';
import Ship from '../src/game/ship.js';

describe('placeShip()', () => {
    test('only places ship if within bounds', () => {
        const board = new Board(5);

        expect(() =>
            board.placeShip(new Ship(4), 4, 1, Board.directions.UP),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(3), 1, 3, Board.directions.LEFT),
        ).toThrow();
    });

    test('only places ship in vacant coordinates', () => {
        const board = new Board(5);
        board.placeShip(new Ship(3), 1, 1, Board.directions.RIGHT);

        expect(() =>
            board.placeShip(new Ship(2), 2, 2, Board.directions.LEFT),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(2), 3, 2, Board.directions.UP),
        ).not.toThrow();

        expect(() =>
            board.place(new Ship(2), 2, 3, Board.directions.DOWN),
        ).toThrow();
    });
});
