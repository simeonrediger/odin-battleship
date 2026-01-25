import '../ship/ship.css';

import Ship from '../ship/ship.js';
import { adoptValuesOfCommonKeys, validateElements } from '@/shared/utils.js';

const directionClasses = Object.freeze({
    [Ship.directions.UP]: 'face-up',
    [Ship.directions.DOWN]: 'face-down',
    [Ship.directions.LEFT]: 'face-left',
    [Ship.directions.RIGHT]: 'face-right',
});

let container;

const handlers = {
    onShipClick: undefined,
};

function init(containerElement, handlersObj) {
    cacheElements(containerElement);
    adoptValuesOfCommonKeys(handlers, handlersObj);
    bindEvents();
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });
}

function bindEvents() {
    container.addEventListener('click', handleClick);
}

function renderShips(shipsData, shipNodeSize) {
    container.innerHTML = '';
    const ships = shipsData.map(shipData => renderShip(shipData, shipNodeSize));
    container.append(...ships);
}

function handleClick(event) {
    const ship = event.target.closest("[data-role='ship']");

    if (!ship) {
        return;
    }

    container
        .querySelectorAll('.placing')
        .forEach(ship => ship.classList.remove('placing'));

    ship.classList.add('placing');
    const { id, direction, length } = ship.dataset;
    handlers.onShipClick(id, direction, +length);
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

function removeShip(shipId) {
    const ship = container.querySelector(`[data-id='${shipId}']`);
    ship.remove();
}

const shipPlacementsMenu = {
    init,
    renderShips,
    removeShip,
};

export default shipPlacementsMenu;
