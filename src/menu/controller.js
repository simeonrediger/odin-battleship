import gameConfigView from './game-config/view.js';

function init(root) {
    gameConfigView.render(root, handleGameConfigSubmit);
}

function handleGameConfigSubmit({ player1Data, player2Data }) {}

const menuController = {
    init,
};

export default menuController;
