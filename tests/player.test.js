import Board from '@/domains/board/board.js';
import Player from '@/domains/player.js';
import Ship from '@/domains/ship/ship.js';

test('only accepts string names', () => {
    expect(
        () => new Player('abc', true, new Board(), [new Ship(3), new Ship(2)]),
    ).not.toThrow();
    expect(
        () => new Player(5, true, new Board(), [new Ship(3), new Ship(2)]),
    ).toThrow();
});

test('only accepts boolean isHuman value', () => {
    expect(
        () => new Player('abc', true, new Board(), [new Ship(3), new Ship(2)]),
    ).not.toThrow();
    expect(
        () =>
            new Player('abc', 'true', new Board(), [new Ship(3), new Ship(2)]),
    ).toThrow();
});

test('only accepts Board instance as board value', () => {
    expect(
        () => new Player('abc', true, new Board(), [new Ship(3), new Ship(2)]),
    ).not.toThrow();
    expect(
        () => new Player('abc', true, new Object(), [new Ship(3), new Ship(2)]),
    ).toThrow();
});

test('only accepts an Array of Ship instances as shipsToPlace value', () => {
    expect(
        () => new Player('abc', true, new Board(), [new Ship(3), new Ship(2)]),
    ).not.toThrow();

    expect(
        () =>
            new Player('abc', true, new Board(), {
                ship1: new Ship(3),
                ship2: new Ship(2),
            }),
    ).toThrow();

    expect(
        () =>
            new Player('abc', true, new Board(), [
                new Ship(3),
                { ship: new Ship(2) },
            ]),
    ).toThrow();
});
