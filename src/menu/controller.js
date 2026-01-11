import gameConfigView from './game-config/view.js';

let onPlayersReady;

function init(root, onPlayersReadyHandler) {
    onPlayersReady = onPlayersReadyHandler;
    gameConfigView.render(root, handleGameConfigSubmit);
}

function handleGameConfigSubmit(playerData) {
    onPlayersReady(playerData);
}

const menuController = {
    init,
};

export default menuController;
