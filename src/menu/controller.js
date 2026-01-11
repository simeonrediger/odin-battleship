import gameConfigView from './game-config/view.js';

function init(root) {
    gameConfigView.render(root);
}

const menuController = {
    init,
};

export default menuController;
