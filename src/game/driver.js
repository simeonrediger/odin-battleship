function play(game) {
    game.submitPlayerCreation(true, 'P1', true, 'P2');
}

const driver = {
    play,
};

export default driver;
