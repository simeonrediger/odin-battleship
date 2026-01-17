import '@/shared/styles/ship.css';
import '@/shared/styles/utilities.css';

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
    PLAYER_1_ATTACK: 'PLAYER_1_ATTACK',
    PLAYER_2_ATTACK: 'PLAYER_2_ATTACK',
    GAME_OVER: 'GAME_OVER',
});

let player1;
let player2;

const current = {
    phase: undefined,
    player: undefined,
    playerKey: undefined,
    isPlayer1: undefined,
};

const opponent = {
    player: undefined,
    playerKey: undefined,
};

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
        area: document.querySelector("[data-role='board-area-1']"),
        playerCreation: document.querySelector(
            "[data-role='player-1-creation']",
        ),
        typeInput: document.querySelector("[data-input='player-1-type']"),
        nameInput: document.querySelector("[data-input='player-1-name']"),
        board: document.querySelector("[data-role='player-1-board']"),
        grid: document.querySelector("[data-role='player-1-grid']"),
    },
    player2: {
        area: document.querySelector("[data-role='board-area-2']"),
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
    setNameInputDisplays();
    enterPlayerCreation();
}

function bindEvents() {
    document.addEventListener('click', handleClick);

    [dom.player1, dom.player2].forEach(playerElements =>
        playerElements.typeInput.addEventListener('change', () =>
            setNameInputDisplay(
                playerElements.typeInput,
                playerElements.nameInput,
            ),
        ),
    );
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

function setNameInputDisplays() {
    [dom.player1, dom.player2].forEach(playerElements =>
        setNameInputDisplay(playerElements.typeInput, playerElements.nameInput),
    );
}

function setNameInputDisplay(typeInput, nameInput) {
    if (typeInput.value === 'human') {
        nameInput.classList.remove('hidden');
    } else {
        nameInput.classList.add('hidden');
    }
}

function continueGame() {
    switch (current.phase) {
        case phases.PLAYER_CREATION:
            handlePlayersSubmit();
            setPlayer(player1);
            enterShipPlacements();
            break;
        case phases.SHIP_PLACEMENTS_1:
            handleShipPlacementsSubmit();
            setPlayer(player2);
            enterShipPlacements();
            break;
        case phases.SHIP_PLACEMENTS_2:
            handleShipPlacementsSubmit();
            setPlayer(player1);
            prepareGame();
            enterRound();
            break;
        case phases.PLAYER_1_ATTACK:
            setPlayer(player2);
            enterRound();
            break;
        case phases.PLAYER_2_ATTACK:
            setPlayer(player1);
            enterRound();
            break;
        case phases.GAME_OVER:
            handleRestart();
            enterPlayerCreation();
            break;
        default:
            throw new Error(`Invalid phase: ${current.phase}`);
    }
}

function setPlayer(player) {
    current.player = player;

    current.isPlayer1 = player === player1;
    current.playerKey = current.isPlayer1 ? 'player1' : 'player2';
    opponent.player = current.isPlayer1 ? player2 : player1;
    opponent.playerKey = current.isPlayer1 ? 'player2' : 'player1';
}

function handlePlayersSubmit() {
    createPlayers();
    createBoardViews();
    hide(dom.player1.playerCreation, dom.player2.playerCreation);
}

function handleShipPlacementsSubmit() {
    hide(dom[current.playerKey].board, dom.unplacedShips);
    dom[current.playerKey].grid.classList.add('undiscovered-ship-nodes-hidden');
}

function handleRestart() {
    hide(dom.player1.board, dom.player2.board);
}

function enterPlayerCreation() {
    current.phase = phases.PLAYER_CREATION;
    dom.announcer.textContent = "Who's playing?";
    dom.continueButton.textContent = 'Ready';
    show(dom.player1.playerCreation, dom.player2.playerCreation);
}

function enterShipPlacements() {
    current.phase = current.isPlayer1
        ? phases.SHIP_PLACEMENTS_1
        : phases.SHIP_PLACEMENTS_2;

    dom[opponent.playerKey].area.insertBefore(
        dom.unplacedShips,
        dom[opponent.playerKey].board,
    );

    let announcement = `${current.player.name}, place your fleet...`;
    announcement += ` Don't look, ${opponent.player.name}!`;
    dom.announcer.textContent = announcement;

    if (!cellSize) {
        setCellSize(current.player.board.size);
    }

    if (unplacedShips.length === 0) {
        createShips(unplacedShips);
    }

    dom.unplacedShips.innerHTML = '';
    unplacedShips.forEach(renderUnplacedShip);
    views[current.playerKey].board.render();
    views[current.playerKey].board.eventsEnabled = true;
    dom.continueButton.textContent = 'Done';
    dom.continueButton.disabled = true;
    show(dom[current.playerKey].board, dom.unplacedShips);
}

function prepareGame() {
    [dom.player1.grid, dom.player2.grid].forEach(grid =>
        grid.addEventListener('pointerdown', tryHit),
    );
    show(dom.player1.board, dom.player2.board);
}

function enterRound() {
    current.phase = current.isPlayer1
        ? phases.PLAYER_1_ATTACK
        : phases.PLAYER_2_ATTACK;

    dom.announcer.textContent = `${current.player.name}'s turn`;
    dom[current.playerKey].board.classList.add('inactive');
    dom[opponent.playerKey].board.classList.remove('inactive');
}

function handleShipPlacementConfirmation({ x, y, direction, length }) {
    selectedShipView.remove();
    const ship = new Ship(length, direction);
    const placedShipData = current.player.board.placeShip(ship, x, y);

    if (current.player.board.shipCount === 5) {
        dom.continueButton.disabled = false;
    }

    views[current.playerKey].board.renderPlacedShip(placedShipData);
}

function tryHit(event) {
    const coordinate = event.target.closest('.coordinate');
    const attacked = coordinate?.classList.contains('attacked');
    const boardInPlay =
        dom[opponent.playerKey].grid.contains(event.target) &&
        [phases.PLAYER_1_ATTACK, phases.PLAYER_2_ATTACK].includes(
            current.phase,
        );

    if (!coordinate || attacked || !boardInPlay) {
        return;
    }

    const { x, y } = coordinate.dataset;

    if (opponent.player.board.coordinateHit(x, y)) {
        return;
    }

    const shipHit = opponent.player.board.hit(x, y);

    if (shipHit) {
        coordinate.classList.add('hit');
        const sunkShipCoordinates =
            opponent.player.board.getSunkShipCoordinates(x, y);

        if (sunkShipCoordinates) {
            sunkShipCoordinates.forEach(([x, y]) => {
                const cell = views[opponent.playerKey].board.getCell(x, y);
                cell.classList.add('sunk');
            });

            if (opponent.player.defeated) {
                declareWinner(current.player);
            }
        }
    }

    coordinate.classList.add('discovered');

    if (!shipHit) {
        continueGame();
    }
}

function declareWinner(player) {
    current.phase = phases.GAME_OVER;
    dom.announcer.textContent = `${player.name} wins!`;
    dom.continueButton.textContent = 'Restart';
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
        board.shipOverlaps.bind(board),
        board.shipValid.bind(board),
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
    views[current.playerKey].board.placeShipPreview(
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
