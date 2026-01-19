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

    handleEnterShipPlacements: shipIds => {
        console.log('Entered ship placements. Received:', shipIds);
        game.placeShip(shipIds[0].id, 4, 3);
        game.placeShip(shipIds[1].id, 4, 4);
        game.placeShip(shipIds[2].id, 4, 5);
        game.placeShip(shipIds[3].id, 4, 6);
        game.placeShip(shipIds[4].id, 4, 7);
        game.submitShipPlacements();
    },

    handleEnterRound: () => console.log('Entered round'),
};

export default driver;
