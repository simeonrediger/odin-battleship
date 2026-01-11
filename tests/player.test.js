import Player from '../src/game/player.js';

test('only accepts string names', () => {
    expect(() => new Player('abc')).not.toThrow();
    expect(() => new Player(5)).toThrow();
});
