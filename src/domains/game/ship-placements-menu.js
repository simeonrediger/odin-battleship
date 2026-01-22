import '../ship/ship.css';

import Ship from '../ship/ship.js';
import { validateElements } from '@/shared/utils.js';

const directionClasses = Object.freeze({
    [Ship.directions.UP]: 'face-up',
    [Ship.directions.DOWN]: 'face-down',
    [Ship.directions.LEFT]: 'face-left',
    [Ship.directions.RIGHT]: 'face-right',
});

let container;

function init(containerElement) {
    cacheElements(containerElement);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });
}

function renderShips(shipsData, shipNodeSize) {
    container.innerHTML = '';
    const ships = shipsData.map(shipData => renderShip(shipData, shipNodeSize));
    container.append(...ships);
}

function renderShip(shipData, shipNodeSize) {
    const ship = document.createElement('div');
    ship.dataset.role = 'ship';
    ship.dataset.id = shipData.id;
    ship.dataset.length = shipData.length;
    ship.dataset.direction = shipData.direction;
    ship.draggable = true;
    ship.classList.add('ship', directionClasses[shipData.direction]);

    for (let i = 0; i < shipData.length; i++) {
        const shipNode = document.createElement('div');
        shipNode.classList.add('ship-node');
        shipNode.style.width = shipNodeSize + 'px';
        shipNode.style.height = shipNodeSize + 'px';
        ship.append(shipNode);
    }

    return ship;
}

const shipPlacementsMenu = {
    init,
    renderShips,
};

export default shipPlacementsMenu;
