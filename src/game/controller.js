import Board from './board.js';
import gameView from './view.js';
import Player from './player.js';

let boardSize;
let player1;
let player2;

function init(root, boardSizeArg) {
    boardSize = boardSizeArg;
    gameView.render(root);
}

function start({ player1Data, player2Data }) {
    player1 = new Player(
        player1Data.name,
        player1Data.isHuman,
        new Board(boardSize),
    );

    player2 = new Player(
        player2Data.name,
        player2Data.isHuman,
        new Board(boardSize),
    );
}

const controller = {
    init,
    start,
};

export default controller;
