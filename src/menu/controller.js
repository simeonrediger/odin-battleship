import gameConfigView from './game-config/view.js';

let currentView;
let onPlayerDataReady;

function init(root, onPlayerDataReadyHandler) {
    onPlayerDataReady = onPlayerDataReadyHandler;
    gameConfigView.render(root, handleGameConfigSubmit);
    currentView = gameConfigView;
}

function swapView(view) {
    currentView.hide();
    view.show();
    currentView = view;
}

function handleGameConfigSubmit(playerData) {
    onPlayerDataReady(playerData);
}

const menuController = {
    init,
};

export default menuController;
