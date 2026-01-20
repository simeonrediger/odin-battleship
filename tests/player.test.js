import Board from '@/domains/board/board.js';
import Player from '@/domains/player.js';

test('only accepts string names', () => {
    expect(() => new Player('abc', true, new Board())).not.toThrow();
    expect(() => new Player(5, true, new Board())).toThrow();
});

test('only accepts boolean isHuman value', () => {
    expect(() => new Player('abc', true, new Board())).not.toThrow();
    expect(() => new Player('abc', 'true', new Board())).toThrow();
});

test('only accepts Board instance as board value', () => {
    expect(() => new Player('abc', true, new Board())).not.toThrow();
    expect(() => new Player('abc', true, new Object())).toThrow();
});
