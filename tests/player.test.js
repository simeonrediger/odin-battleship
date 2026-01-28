import Board from '@/domains/board/board.js';
import Player from '@/domains/player.js';
import Ship from '@/domains/ship/ship.js';

// Valid args/components
const name = 'abc';
const isHuman = true;
const board = new Board();
const shipsToPlace = [new Ship(3), new Ship(2)];

test('only accepts string names', () => {
    expect(() => new Player(name, isHuman, board, shipsToPlace)).not.toThrow();
    expect(() => new Player(5, isHuman, board, shipsToPlace)).toThrow();
});

test('only accepts boolean isHuman value', () => {
    expect(() => new Player(name, isHuman, board, shipsToPlace)).not.toThrow();
    expect(() => new Player(name, 'true', board, shipsToPlace)).toThrow();
});

test('only accepts Board instance as board value', () => {
    expect(() => new Player(name, isHuman, board, shipsToPlace)).not.toThrow();
    expect(
        () => new Player(name, isHuman, new Object(), shipsToPlace),
    ).toThrow();
});

test('only accepts an Array of Ship instances as shipsToPlace value', () => {
    expect(() => new Player(name, isHuman, board, shipsToPlace)).not.toThrow();

    expect(
        () =>
            new Player(name, isHuman, board, {
                ship1: new Ship(3),
                ship2: new Ship(2),
            }),
    ).toThrow();

    expect(
        () =>
            new Player(name, isHuman, board, [
                new Ship(3),
                { ship: new Ship(2) },
            ]),
    ).toThrow();
});
