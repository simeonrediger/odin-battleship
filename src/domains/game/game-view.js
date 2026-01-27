import '@/shared/styles/utilities.css';
import './styles/button.css';
import './styles/input.css';
import './styles/layout.css';

import { validateElements } from '@/shared/utils.js';
import BoardView from '../board/board-view.js';
import eventBus from '../game/event-bus.js';
import * as events from './events.js';
import gameSelectors from './game-selectors.js';
import shipPlacementsMenu from './ship-placements-menu.js';

let container;
let announcer;
let playerAreas;
let shipPlacementsMenuContainer;
let continueButton;

let onContinueClick;

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

function init(containerElement, boardSize) {
    cacheElements(containerElement);
    bindEvents();
    initViews(boardSize, shipPlacementsMenuContainer);
}

function cacheElements(containerElement) {
    container = containerElement;
    validateElements({ container });

    announcer = container.querySelector("[data-role='announcer']");
    playerAreas = container.querySelector("[data-role='player-areas']");
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
        playerAreas,
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
        player => (player.boardView = new BoardView(player.board, boardSize)),
    );

    shipPlacementsMenu.init(shipPlacementsMenuContainer, {
        onShipClick: handleShipsToPlaceClick,
    });
}

function bindEvents() {
    continueButton.addEventListener('click', handleContinueClick);
    playerAreas.addEventListener('click', handlePlayerAreasClick);

    eventBus.on(events.ENTERED_PLAYER_CREATION, showPlayerCreation);
    eventBus.on(events.ENTERED_SHIP_PLACEMENTS, showShipPlacements);
    eventBus.on(events.SHIP_PLACED, handleShipPlaced);
    eventBus.on(events.ALL_SHIPS_PLACED, enableContinueButton);
    eventBus.on(events.ENTERED_ROUND, showRound);
    eventBus.on(events.BOARD_ATTACKED, handleBoardAttacked);
    eventBus.on(events.GAME_WON, handleWin);
}

function handleContinueClick() {
    let player;

    switch (onContinueClick) {
        case gameView.submitPlayerCreation:
            gameView.submitPlayerCreation(
                player1.typeInput.value,
                player1.nameInput.value,
                player2.typeInput.value,
                player2.nameInput.value,
            );
            break;
        case gameView.submitShipPlacements:
            player = gameSelectors.isPlayer1Turn ? player1 : player2;
            hide(player.board, shipPlacementsMenuContainer);
            gameView.submitShipPlacements();
            break;
        case handleRestartClick:
            handleRestartClick();
            break;
    }
}

function handlePlayerAreasClick(event) {
    const activeBoard = event.target.closest(
        "[data-active][data-role$='board']",
    );

    const cell = BoardView.getClosestCell(event.target);

    if (activeBoard && cell) {
        handleAttackClick(cell);
    }
}

function handleShipsToPlaceClick(id, direction, length) {
    const player = gameSelectors.isPlayer1Turn ? player1 : player2;
    player.boardView.renderShipPreviewToCenter(id, direction, length);
}

function handleAttackClick(cell) {
    const x = +cell.dataset.x;
    const y = +cell.dataset.y;
    eventBus.emit(events.BOARD_ATTACK_REQUESTED, { x, y });
}

function showPlayerCreation() {
    announcer.textContent = "Who's playing?";
    continueButton.textContent = 'Play';
    continueButton.disabled = false;
    onContinueClick = gameView.submitPlayerCreation;
    show(player1.creationMenu, player2.creationMenu);
}

function showShipPlacements({ playerName, opponentName, shipsData }) {
    hide(player1.creationMenu, player2.creationMenu);

    announcer.textContent = `
        ${playerName}, place your fleet... ${opponentName}, don't look!
    `.trim();

    const isPlayer1Turn = gameSelectors.isPlayer1Turn;
    const player = isPlayer1Turn ? player1 : player2;
    const opponent = isPlayer1Turn ? player2 : player1;
    opponent.area.insertBefore(shipPlacementsMenuContainer, opponent.board);
    player.boardView.render();

    shipPlacementsMenu.renderShips(shipsData, player.boardView.cellSize);
    continueButton.textContent = 'Ready';
    continueButton.disabled = true;
    onContinueClick = gameView.submitShipPlacements;
    show(player.board, shipPlacementsMenuContainer);
}

function handleShipPlaced({ coordinates }) {
    const player = gameSelectors.isPlayer1Turn ? player1 : player2;
    player.boardView.renderShip(coordinates);
}

function enableContinueButton() {
    continueButton.disabled = false;
}

function showRound({ playerName }) {
    announcer.textContent = `${playerName}'s turn`;
    const isPlayer1Turn = gameSelectors.isPlayer1Turn;
    const player = isPlayer1Turn ? player1 : player2;
    const opponent = isPlayer1Turn ? player2 : player1;
    player.board.removeAttribute('data-active');
    player.board.classList.add('inactive');
    opponent.board.classList.remove('inactive');
    opponent.board.setAttribute('data-active', '');
    hideShips();
    continueButton.disabled = true;
    continueButton.textContent = 'Game in progress';
    show(player.board, opponent.board);
}

function handleBoardAttacked({ x, y, shipHit, sunkShipCoordinates }) {
    const opponent = gameSelectors.isPlayer1Turn ? player2 : player1;
    opponent.boardView.renderAttack({ x, y, shipHit, sunkShipCoordinates });
}

function handleWin({ winnerName }) {
    announcer.textContent = `${winnerName} wins!`;
    continueButton.textContent = 'Restart';
    onContinueClick = handleRestartClick;
    continueButton.disabled = false;
}

function handleRestartClick() {
    hide(player1.board, player2.board);

    [player1, player2].forEach(player => {
        player.board.classList.remove(
            'undiscovered-ship-nodes-hidden',
            'inactive',
        );
        player.board.removeAttribute('data-active');
        player.boardView.reset();
    });

    gameView.restartGame();
}

function hideShips() {
    [player1, player2].forEach(player =>
        player.board.classList.add('undiscovered-ship-nodes-hidden'),
    );
}

function show(...elements) {
    elements.forEach(element => element.classList.remove('hidden'));
}

function hide(...elements) {
    elements.forEach(element => element.classList.add('hidden'));
}

const gameView = {
    init,

    submitPlayerCreation: undefined,
    submitShipPlacements: undefined,
    restartGame: undefined,
};

export default gameView;
