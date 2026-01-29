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

let continueAction;

const actions = {
    SUBMIT_PLAYER_CREATION: 'SUBMIT_PLAYER_CREATION',
    SUBMIT_SHIP_PLACEMENTS: 'SUBMIT_SHIP_PLACEMENTS',
    REQUEST_GAME_RESTART: 'REQUEST_GAME_RESTART',
};

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
    document.addEventListener('keydown', disableSpaceToScroll);
    continueButton.addEventListener('click', handleContinueClick);
    playerAreas.addEventListener('mousedown', handlePlayerAreasMouseDown);

    eventBus.on(events.ENTERED_PLAYER_CREATION, showPlayerCreation);
    eventBus.on(events.ENTERED_SHIP_PLACEMENTS, showShipPlacements);
    eventBus.on(events.SHIP_PLACED, handleShipPlaced);
    eventBus.on(events.ALL_SHIPS_PLACED, enableContinueButton);
    eventBus.on(events.SHIP_PLACEMENTS_COMPLETED, cleanUpShipPlacements);
    eventBus.on(events.ENTERED_ROUND, showRound);
    eventBus.on(events.BOARD_ATTACKED, handleBoardAttacked);
    eventBus.on(events.TURN_ENDED, deactivateActiveBoard);
    eventBus.on(events.GAME_WON, handleWin);
    eventBus.on(events.GAME_RESTART_COMPLETED, reset);
}

function disableSpaceToScroll(event) {
    if (event.key === ' ') {
        event.preventDefault();
    }
}

function handleContinueClick() {
    switch (continueAction) {
        case actions.SUBMIT_PLAYER_CREATION:
            eventBus.emit(events.PLAYERS_SUBMITTED, getPlayerInputData());
            break;
        case actions.SUBMIT_SHIP_PLACEMENTS:
            eventBus.emit(events.SHIP_PLACEMENTS_SUBMITTED);
            break;
        case actions.REQUEST_GAME_RESTART:
            eventBus.emit(events.GAME_RESTART_REQUESTED);
            break;
        default:
            throw new TypeError(`Invalid action: ${continueAction}`);
    }
}

function getPlayerInputData() {
    return {
        player1IsHuman: player1.typeInput.value === 'human',
        player1Name: player1.nameInput.value.trim(),
        player2IsHuman: player2.typeInput.value === 'human',
        player2Name: player2.nameInput.value.trim(),
    };
}

function handlePlayerAreasMouseDown(event) {
    const activeBoard = event.target.closest(
        "[data-active][data-role$='board']",
    );

    const cell = BoardView.getClosestCell(event.target);

    if (activeBoard && cell) {
        handleCellAttack(cell);
    }
}

function handleShipsToPlaceClick(id, direction, length) {
    const player = gameSelectors.isPlayer1Turn ? player1 : player2;
    player.boardView.renderShipPreviewToCenter(id, direction, length);
}

function handleCellAttack(cell) {
    const x = +cell.dataset.x;
    const y = +cell.dataset.y;
    eventBus.emit(events.BOARD_ATTACK_REQUESTED, { x, y });
}

function showPlayerCreation() {
    announcer.textContent = "Who's playing?";
    continueButton.textContent = 'Play';
    continueButton.disabled = false;
    continueAction = actions.SUBMIT_PLAYER_CREATION;
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
    continueAction = actions.SUBMIT_SHIP_PLACEMENTS;
    show(player.board, shipPlacementsMenuContainer);
}

function handleShipPlaced({ coordinates }) {
    const player = gameSelectors.isPlayer1Turn ? player1 : player2;
    player.boardView.renderShip(coordinates);
}

function enableContinueButton() {
    continueButton.disabled = false;
}

function cleanUpShipPlacements({ wasPlayer1Turn }) {
    const player = wasPlayer1Turn ? player1 : player2;
    hide(player.board, shipPlacementsMenuContainer);
}

function showRound({ playerName }) {
    announcer.textContent = `${playerName}'s turn`;
    const isPlayer1Turn = gameSelectors.isPlayer1Turn;
    const player = isPlayer1Turn ? player1 : player2;
    const opponent = isPlayer1Turn ? player2 : player1;
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

function deactivateActiveBoard() {
    const activeBoard = container.querySelector(
        "[data-active][data-role$='board']",
    );

    activeBoard.removeAttribute('data-active');
}

function handleWin({ winnerName }) {
    announcer.textContent = `${winnerName} wins!`;

    [player1, player2].forEach(player => {
        player.board.removeAttribute('data-active');
        player.board.classList.remove('undiscovered-ship-nodes-hidden');
    });

    continueButton.textContent = 'Restart';
    continueAction = actions.REQUEST_GAME_RESTART;
    continueButton.disabled = false;
}

function reset() {
    hide(player1.board, player2.board);

    [player1, player2].forEach(player => {
        player.board.classList.remove(
            'undiscovered-ship-nodes-hidden',
            'inactive',
        );
        player.board.removeAttribute('data-active');
        player.boardView.reset();
    });
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
};

export default gameView;
