import '@/shared/styles/utilities.css';
import './styles/button.css';
import './styles/input.css';
import './styles/layout.css';

import { adoptValuesOfCommonKeys, validateElements } from '@/shared/utils.js';
import BoardView from '../board/board-view.js';
import shipPlacementsMenu from './ship-placements-menu.js';

let container;
let announcer;
let shipPlacementsMenuContainer;
let continueButton;

const player1 = {
    area: undefined,
    board: undefined,
    boardView: undefined,
    creationMenu: undefined,
    typeInput: undefined,
    nameInput: undefined,
};

const player2 = {
    area: undefined,
    board: undefined,
    boardView: undefined,
    creationMenu: undefined,
    typeInput: undefined,
    nameInput: undefined,
};

const callbacks = {
    onContinueClick: undefined,
    getShipCoordinates: undefined,
    isPlayer1Turn: undefined,
    shipValid: undefined,
    onShipPreviewSubmit: undefined,
};

function init(containerElement, boardSize, callbacksObj) {
    cacheElements(containerElement);
    adoptValuesOfCommonKeys(callbacks, callbacksObj);
    Object.keys(callbacks).forEach(key => (callbacks[key] = callbacksObj[key]));
    bindEvents();
    initViews(boardSize, shipPlacementsMenuContainer);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });

    announcer = container.querySelector("[data-role='announcer']");
    shipPlacementsMenuContainer = container.querySelector(
        "[data-role='ship-placements-menu']",
    );
    continueButton = container.querySelector("[data-action='continue']");

    player1.area = container.querySelector("[data-role='player-1-area']");
    player1.board = container.querySelector("[data-role='player-1-board']");
    player1.creationMenu = container.querySelector(
        "[data-role='player-1-creation']",
    );
    player1.typeInput = container.querySelector("[data-input='player-1-type']");
    player1.nameInput = container.querySelector("[data-input='player-1-name']");

    player2.area = container.querySelector("[data-role='player-2-area']");
    player2.board = container.querySelector("[data-role='player-2-board']");
    player2.creationMenu = container.querySelector(
        "[data-role='player-2-creation']",
    );
    player2.typeInput = container.querySelector("[data-input='player-2-type']");
    player2.nameInput = container.querySelector("[data-input='player-2-name']");

    validateElements({
        announcer,
        shipPlacementsMenuContainer,
        continueButton,
        'player1.area': player1.area,
        'player1.board': player1.board,
        'player1.creationMenu': player1.creationMenu,
        'player1.typeInput': player1.typeInput,
        'player1.nameInput': player1.nameInput,
        'player2.area': player2.area,
        'player2.board': player2.board,
        'player2.creationMenu': player2.creationMenu,
        'player2.typeInput': player2.typeInput,
        'player2.nameInput': player2.nameInput,
    });
}

function initViews(boardSize, shipPlacementsMenuContainer) {
    [player1, player2].forEach(
        player =>
            (player.boardView = new BoardView(
                player.board,
                boardSize,
                callbacks.getShipCoordinates,
                callbacks.shipValid,
                handleShipPreviewSubmit,
            )),
    );

    shipPlacementsMenu.init(shipPlacementsMenuContainer, {
        onShipClick: handleShipPlacementsMenuClick,
    });
}

function bindEvents() {
    continueButton.addEventListener('click', handleContinueClick);
}

function handleContinueClick() {
    callbacks.onContinueClick(
        player1.typeInput.value,
        player1.nameInput.value,
        player2.typeInput.value,
        player2.nameInput.value,
    );
}

function handleShipPlacementsMenuClick(id, direction, length) {
    const player = callbacks.isPlayer1Turn() ? player1 : player2;
    player.boardView.renderShipPreviewToCenter(id, direction, length);
}

function handleShipPreviewSubmit(id, x, y, direction) {
    const placedShipData = callbacks.onShipPreviewSubmit(id, x, y, direction);
    shipPlacementsMenu.removeShip(id);
    return placedShipData;
}

function showPlayerCreation() {
    announcer.textContent = "Who's playing?";
    show(player1.creationMenu, player2.creationMenu);
}

function showShipPlacements(playerName, opponentName, isPlayer1, shipsData) {
    hide(player1.creationMenu, player2.creationMenu);

    announcer.textContent = `
        ${playerName}, place your fleet... ${opponentName}, don't look!
    `.trim();

    const player = isPlayer1 ? player1 : player2;
    const opponent = isPlayer1 ? player2 : player1;
    opponent.area.insertBefore(shipPlacementsMenuContainer, opponent.board);
    player.boardView.render();

    shipPlacementsMenu.renderShips(shipsData, player.boardView.cellSize);
    show(player.board, shipPlacementsMenuContainer);
}

function show(...elements) {
    elements.forEach(element => element.classList.remove('hidden'));
}

function hide(...elements) {
    elements.forEach(element => element.classList.add('hidden'));
}

const gameView = {
    init,
    showPlayerCreation,
    showShipPlacements,
};

export default gameView;
