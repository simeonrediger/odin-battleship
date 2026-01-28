import './shared/styles/reset.css';
import './shared/styles/colors.css';
import './shared/styles/layout.css';

import game from './domains/game/game.js';
import gameView from './domains/game/game-view.js';

game.init();
const gameContainer = document.querySelector("[data-role='game-container']");
gameView.init(gameContainer, game.boardSize);
game.start();
