import Board from './board/board.js';
import Player from './player.js';

const phases = Object.freeze({
    PLAYER_CREATION: 'PLAYER_CREATION',
});

const current = {
    phase: undefined,
    player: undefined,
};

let player1;
let player2;

function start() {
    enterPlayerCreation();
}

function submitPlayerCreation(
    player1IsHuman,
    player1Name,
    player2IsHuman,
    player2Name,
) {
    validatePhase(phases.PLAYER_CREATION);
    player1 = createPlayer(player1IsHuman, player1Name);
    player2 = createPlayer(player2IsHuman, player2Name);
    setPlayer(player1);
}

function enterPlayerCreation() {
    current.phase = phases.PLAYER_CREATION;
}

function setPlayer(player) {
    current.player = player;
}

function createPlayer(isHuman, name) {
    return new Player(name, isHuman, new Board());
}

function validatePhase(phase) {
    if (current.phase !== phase) {
        throw new Error(
            `Action only allowed for ${phase}, not ${current.phase}`,
        );
    }
}

const game = {
    start,
    submitPlayerCreation,
};

export default game;
