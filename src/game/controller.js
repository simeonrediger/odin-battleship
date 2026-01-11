import gameView from './view.js';

function init(root) {
    gameView.render(root);
}

function handlePlayersReady({ player1Data, player2Data }) {}

const controller = {
    init,
    handlePlayersReady,
};

export default controller;
