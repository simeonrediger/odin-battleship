import game from './game.js';

const gameSelectors = {
    getShipCoordinates: game.getShipCoordinates,
    shipValid: game.shipValid,

    get isPlayer1Turn() {
        return game.isPlayer1Turn;
    },
};

export default gameSelectors;
