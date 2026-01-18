import driver from './game/driver.js';
import game from './game/game.js';

game.init({
    onEnterPlayerCreation: driver.handleEnterPlayerCreation,
    onPlayerChange: driver.handlePlayerChange,
});

driver.play(game);
