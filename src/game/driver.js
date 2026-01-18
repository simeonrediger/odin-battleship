let game;

const driver = {
    play: gameModel => {
        game = gameModel;
        game.start();
    },

    handleEnterPlayerCreation: () => {
        console.log('Entered player creation');
        game.submitPlayerCreation(true, 'P1', true, 'P2');
    },

    handlePlayerChange: name => console.log('Current player:', name),
    handleEnterShipPlacements: shipIds =>
        console.log('Entered ship placements. Received:', shipIds),
};

export default driver;
