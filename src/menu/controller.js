import gameConfigView from './game-config/view.js';

let currentView;
let onPlayerDataReady;

function init(root, onPlayerDataReadyHandler) {
    onPlayerDataReady = onPlayerDataReadyHandler;
    gameConfigView.init(root, handleGameConfigSubmit);
    render(gameConfigView);
}

function render(view) {
    currentView?.hide();
    view.render();
    currentView = view;
}

function handleGameConfigSubmit(playerData) {
    onPlayerDataReady(playerData);
}

const menuController = {
    init,
};

export default menuController;
