import '@/shared/styles/reset.css';
import '@/shared/styles/colors.css';
import '@/shared/styles/layout.css';

import gameController from './game/controller.js';
import menuController from './menu/controller.js';

const root = document;
const boardSize = 10;
menuController.init(root, gameController.start);
gameController.init(root, boardSize);
