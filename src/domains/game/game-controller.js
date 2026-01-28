import game from './game.js';
import gameView from './game-view.js';

function start(root) {
    game.init();
    const gameContainer = root.querySelector("[data-role='game-container']");
    gameView.init(gameContainer, game.boardSize);
    game.start();
}

const gameController = {
    start,
};

export default gameController;
