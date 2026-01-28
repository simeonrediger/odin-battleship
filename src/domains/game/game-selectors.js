import Board from '../board/board.js';
import game from './game.js';

const gameSelectors = {
    boardSize: Board.size,
    getShipCoordinates: Board.getNearestInBoundsShipCoordinates,
    shipValid: game.shipValid,

    get isPlayer1Turn() {
        return game.isPlayer1Turn();
    },
};

export default gameSelectors;
