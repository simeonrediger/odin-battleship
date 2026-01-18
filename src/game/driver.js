function play(game) {
    game.start();
    game.submitPlayerCreation(true, 'P1', true, 'P2');
}

const driver = {
    play,
    handleEnterPlayerCreation: () => console.log('Entered player creation'),
    handlePlayerChange: name => console.log('Current player:', name),
};

export default driver;
