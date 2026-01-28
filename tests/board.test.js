import Board from '@/domains/board/board.js';
import Ship from '@/domains/ship/ship.js';

describe('placeShip()', () => {
    test('only places ship if within bounds', () => {
        const board = new Board();

        expect(() =>
            board.placeShip(new Ship(4), 4, 1, Ship.directions.UP),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(3), 1, 3, Ship.directions.LEFT),
        ).toThrow();
    });

    test('only places ship in vacant coordinates', () => {
        const board = new Board();
        board.placeShip(new Ship(3), 1, 1, Ship.directions.RIGHT);

        expect(() =>
            board.placeShip(new Ship(2), 2, 2, Ship.directions.LEFT),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(2), 3, 2, Ship.directions.UP),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(2), 2, 3, Ship.directions.DOWN),
        ).toThrow();
    });
});

describe('hit()', () => {
    test('accepts attack only if coordinate has not been attacked', () => {
        const board = new Board();
        expect(() => board.hit(0, 0)).not.toThrow();
        expect(() => board.hit(0, 0)).toThrow();
    });

    test('calls ship.hit() only if coordinate has ship', () => {
        const board = new Board();
        const ship = new Ship(2);
        board.placeShip(ship, 0, 0, Ship.directions.UP);
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
});
