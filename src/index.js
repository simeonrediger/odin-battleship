import './shared/styles/reset.css';
import './shared/styles/colors.css';
import './shared/styles/layout.css';

import gameController from './domains/game/game-controller.js';

gameController.start(document);
