import Board from '../src/game/board.js';
import Ship from '../src/game/ship.js';

describe('only accepts non-negative sizes', () => {
    test.each([
        [-1, false],
        [0, true],
        [1, true],
    ])('accepts size %i? %s', (size, shouldAccept) => {
        const expectation = expect(() => new Board(size));
        shouldAccept ? expectation.not.toThrow() : expectation.toThrow();
    });
});

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

describe('hit()', () => {
    test('accepts attack only if coordinate has not been attacked', () => {
        const board = new Board(3);
        expect(() => board.hit(0, 0)).not.toThrow();
        expect(() => board.hit(0, 0)).toThrow();
    });

    test('calls ship.hit() only if coordinate has ship', () => {
        const board = new Board(5);
        const ship = new Ship(2);
        board.placeShip(ship, 0, 0, Board.directions.UP, true);
        ship.hit = jest.fn();

        expect(ship.hit.mock.calls.length).toBe(0);
        board.hit(0, 2);
        expect(ship.hit.mock.calls.length).toBe(0);
        board.hit(1, 0);
        expect(ship.hit.mock.calls.length).toBe(0);
        board.hit(1, 1);
        expect(ship.hit.mock.calls.length).toBe(0);

        board.hit(0, 0);
        expect(ship.hit.mock.calls.length).toBe(1);
        board.hit(0, 1);
        expect(ship.hit.mock.calls.length).toBe(2);
    });

    test('calls defeat handler only if all ships are sunk', () => {
        const handleDefeat = jest.fn();
        const board = new Board(3, handleDefeat);
        board.placeShip(new Ship(3), 0, 0, Board.directions.UP);
        board.placeShip(new Ship(2), 1, 1, Board.directions.RIGHT);

        board.hit(0, 0);
        board.hit(0, 1);
        expect(handleDefeat.mock.calls.length).toBe(0);
        board.hit(0, 2);
        expect(handleDefeat.mock.calls.length).toBe(0);
        board.hit(1, 1);
        board.hit(2, 1);
        expect(handleDefeat.mock.calls.length).toBe(1);
    });
});
