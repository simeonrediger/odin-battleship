const phases = Object.freeze({
    PLAYER_CREATION: 'PLAYER_CREATION',
});

const current = {
    phase: undefined,
};

function init() {
    enterPlayerCreation();
}

function enterPlayerCreation() {
    current.phase = phases.PLAYER_CREATION;
}

const game = {
    init,
};

export default game;
