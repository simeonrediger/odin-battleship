import Ship from '../src/game/domains/ship.js';

test('only accepts positive lengths', () => {
    expect(() => new Ship(0, Ship.directions.UP)).toThrow();
    expect(() => new Ship(1, Ship.directions.UP)).not.toThrow();
});

test('only accepts valid directions', () => {
    expect(() => new Ship(3, Ship.directions.FAKE)).toThrow();
    expect(() => new Ship(3, Ship.directions.UP)).not.toThrow();
});

test('is sunk only once hit count equals or exceeds length', () => {
    const shipLength = 4;
    const ship = new Ship(shipLength, Ship.directions.UP);
    expect(ship.sunk).toBe(false);

    for (let i = 0; i < shipLength - 1; i++) {
        ship.hit();
    }

    expect(ship.sunk).toBe(false);
    ship.hit();
    expect(ship.sunk).toBe(true);
    ship.hit();
    expect(ship.sunk).toBe(true);
});
