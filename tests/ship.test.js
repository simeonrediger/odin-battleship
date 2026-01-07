import Ship from '../src/game/ship.js';

test('is sunk only once hit count equals or exceeds length', () => {
    const shipLength = 4;
    const ship = new Ship(shipLength);
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
