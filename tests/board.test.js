import Board from '@/game/domains/board.js';
import Ship from '@/game/domains/ship.js';

describe('placeShip()', () => {
    test('only places ship if within bounds', () => {
        const board = new Board();

        expect(() =>
            board.placeShip(new Ship(4, Ship.directions.UP), 4, 1),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(3, Ship.directions.LEFT), 1, 3),
        ).toThrow();
    });

    test('only places ship in vacant coordinates', () => {
        const board = new Board();
        board.placeShip(new Ship(3, Ship.directions.RIGHT), 1, 1);

        expect(() =>
            board.placeShip(new Ship(2, Ship.directions.LEFT), 2, 2),
        ).not.toThrow();

        expect(() =>
            board.placeShip(new Ship(2, Ship.directions.UP), 3, 2),
        ).not.toThrow();

        expect(() =>
            board.place(new Ship(2, Ship.directions.DOWN), 2, 3),
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
        const ship = new Ship(2, Ship.directions.UP);
        board.placeShip(ship, 0, 0, true);
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
