import './styles/reset.css';
import './styles/colors.css';
import './styles/layout.css';

import gameController from './game/controller.js';
import menuController from './menu/controller.js';

const root = document;
menuController.init(root);
gameController.init(root);
