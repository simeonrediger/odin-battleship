import driver from './game/driver.js';
import game from './game/game.js';

game.init({
    onEnterPlayerCreation: driver.handleEnterPlayerCreation,
    onPlayerChange: driver.handlePlayerChange,
    onEnterShipPlacements: driver.handleEnterShipPlacements,
    onEnterRound: driver.handleEnterRound,
    onDeclareWinner: driver.handleDeclareWinner,
});

driver.play(game);
