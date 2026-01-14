import '@/shared/styles/ship.css';

import Board from './game/board/board.js';
import BoardView from './game/board/board-view.js';
import Player from './game/player.js';
import Ship from './game/ship.js';

const shipLengths = Object.freeze([5, 4, 3, 3, 2]);
const unplacedShips = [];
let cellSize;
let selectedShipView;

const directionClasses = Object.freeze({
    [Ship.directions.UP]: 'face-up',
    [Ship.directions.DOWN]: 'face-down',
    [Ship.directions.LEFT]: 'face-left',
    [Ship.directions.RIGHT]: 'face-right',
});

const phases = Object.freeze({
    PLAYER_CREATION: 'PLAYER_CREATION',
    SHIP_PLACEMENTS_1: 'SHIP_PLACEMENTS_1',
    SHIP_PLACEMENTS_2: 'SHIP_PLACEMENTS_2',
});

let phase;
let player1;
let player2;
let activePlayer;
let activePlayerElements;
let activePlayerViews;

const views = {
    player1: {
        board: undefined,
    },
    player2: {
        board: undefined,
    },
};

const dom = {
    announcer: document.querySelector("[data-role='announcer']"),
    player1: {
        playerCreation: document.querySelector(
            "[data-role='player-1-creation']",
        ),
        typeInput: document.querySelector("[data-input='player-1-type']"),
        nameInput: document.querySelector("[data-input='player-1-name']"),
        board: document.querySelector("[data-role='player-1-board']"),
        grid: document.querySelector("[data-role='player-1-grid']"),
    },
    player2: {
        playerCreation: document.querySelector(
            "[data-role='player-2-creation']",
        ),
        typeInput: document.querySelector("[data-input='player-2-type']"),
        nameInput: document.querySelector("[data-input='player-2-name']"),
        board: document.querySelector("[data-role='player-2-board']"),
        grid: document.querySelector("[data-role='player-2-grid']"),
    },
    unplacedShips: document.querySelector("[data-role='unplaced-ships']"),
    continueButton: document.querySelector("[data-action='continue']"),
};

function init() {
    bindEvents();
    promptPlayerCreation();
}

function bindEvents() {
    document.addEventListener('click', handleClick);
}

function handleClick(event) {
    if (dom.continueButton.contains(event.target)) {
        continueGame();
    } else if (dom.unplacedShips.contains(event.target)) {
        handleUnplacedShipsClick(event);
        return;
    }

    selectedShipView?.classList.remove('placing');
    selectedShipView = null;
}

function continueGame() {
    switch (phase) {
        case phases.PLAYER_CREATION:
            handlePlayersSubmit();
            return;
        default:
            throw new Error(`Invalid phase: ${phase}`);
    }
}

function handlePlayersSubmit() {
    createPlayers();
    createBoardViews();
    hide(dom.player1.playerCreation, dom.player2.playerCreation);
    activePlayer = player1;
    activePlayerViews = views.player1;
    activePlayerElements = dom.player1;
    promptShipPlacements(player1);
}

function promptPlayerCreation() {
    phase = phases.PLAYER_CREATION;
    dom.announcer.textContent = "Who's playing?";
    dom.continueButton.textContent = 'Ready';
    show(dom.player1.playerCreation, dom.player2.playerCreation);
}

function promptShipPlacements(player) {
    phase =
        player === player1
            ? phases.SHIP_PLACEMENTS_1
            : phases.SHIP_PLACEMENTS_2;

    dom.announcer.textContent = `${player.name}, place your fleet!`;

    if (!cellSize) {
        setCellSize(player.board.size);
    }

    createShips(unplacedShips);
    dom.unplacedShips.innerHTML = '';
    unplacedShips.forEach(renderUnplacedShip);
    activePlayerViews.board.render();
    activePlayerViews.board.eventsEnabled = true;
    show(activePlayerElements.board, dom.unplacedShips);
}

function handleShipPlacementConfirmation({ x, y, direction, length }) {
    selectedShipView.remove();
    const ship = new Ship(length, direction);
    const placedShipData = activePlayer.board.placeShip(ship, x, y);
    activePlayerViews.board.renderPlacedShip(placedShipData);
}

function createPlayers() {
    player1 = createPlayer(dom.player1);
    player2 = createPlayer(dom.player2);
}

function createPlayer({ typeInput, nameInput }) {
    const isHuman = typeInput.value === 'human';

    const name =
        isHuman && nameInput.value.trim()
            ? nameInput.value.trim()
            : nameInput.placeholder;

    return new Player(name, isHuman, new Board());
}

function createBoardViews() {
    views.player1.board = createBoardView(dom.player1.grid, player1.board);
    views.player2.board = createBoardView(dom.player2.grid, player2.board);
}

function createBoardView(gridElement, board) {
    return new BoardView(
        gridElement,
        board.size,
        cellSize,
        board.getShipCoordinates.bind(board),
        board.shipInBounds.bind(board),
        board.getNearestInBoundsAnchorCoordinate.bind(board),
        handleShipPlacementConfirmation,
    );
}

function createShips(shipsArray) {
    shipLengths.forEach(length =>
        shipsArray.push(new Ship(length, Ship.directions.RIGHT)),
    );
}

function renderUnplacedShip(ship) {
    const shipView = document.createElement('div');
    shipView.dataset.role = 'ship';
    shipView.dataset.length = ship.length;
    shipView.dataset.direction = ship.direction;
    shipView.draggable = true;
    shipView.classList.add('ship', directionClasses[ship.direction]);

    for (let i = 0; i < ship.length; i++) {
        const shipNode = document.createElement('div');
        shipNode.classList.add('ship-node');
        shipNode.style.width = cellSize;
        shipNode.style.height = cellSize;
        shipView.append(shipNode);
    }

    dom.unplacedShips.append(shipView);
}

function setCellSize(boardSize) {
    cellSize = 28 / boardSize + 'rem';
    // TODO: dynamic cell size calculation
}

function show(...elements) {
    elements.forEach(element => element.classList.remove('hidden'));
}

function hide(...elements) {
    elements.forEach(element => element.classList.add('hidden'));
}

function handleUnplacedShipsClick(event) {
    selectedShipView?.classList.remove('placing');
    const shipView = event.target.closest("[data-role='ship']");

    if (!shipView) {
        selectedShipView = null;
        return;
    }

    selectedShipView = shipView;
    shipView.classList.add('placing');
    const x = 3;
    const y = 4;
    activePlayerViews.board.placeShipPreview(
        x,
        y,
        shipView.dataset.direction,
        shipView.dataset.length,
    );
}

const app = {
    init,
};

export default app;
