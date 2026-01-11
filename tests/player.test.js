import Player from '../src/game/player.js';

test('only accepts string names', () => {
    expect(() => new Player('abc', true)).not.toThrow();
    expect(() => new Player(5, true)).toThrow();
});

test('only accepts boolean isHuman value', () => {
    expect(() => new Player('abc', true)).not.toThrow();
    expect(() => new Player('abc', 'true')).toThrow();
});
