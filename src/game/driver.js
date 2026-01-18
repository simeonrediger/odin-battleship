function play(game) {
    game.start();
    game.submitPlayerCreation(true, 'P1', true, 'P2');
}

const driver = {
    play,
    handleEnterPlayerCreation: () => console.log('Entered player creation'),
};

export default driver;
