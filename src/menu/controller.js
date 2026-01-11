import gameConfigView from './game-config/view.js';

let onPlayerDataReady;

function init(root, onPlayerDataReadyHandler) {
    onPlayerDataReady = onPlayerDataReadyHandler;
    gameConfigView.render(root, handleGameConfigSubmit);
}

function handleGameConfigSubmit(playerData) {
    onPlayerDataReady(playerData);
}

const menuController = {
    init,
};

export default menuController;
