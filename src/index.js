import driver from './driver.js';
import game from './domains/game/game.js';

game.init({
    onEnterPlayerCreation: driver.handleEnterPlayerCreation,
    onPlayerChange: driver.handlePlayerChange,
    onEnterShipPlacements: driver.handleEnterShipPlacements,
    onEnterRound: driver.handleEnterRound,
    onDeclareWinner: driver.handleDeclareWinner,
});

driver.play(game);
