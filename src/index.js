import './styles/reset.css';
import './styles/colors.css';
import './styles/layout.css';

import menuController from './menu/controller.js';

const root = document;
menuController.init(root);
