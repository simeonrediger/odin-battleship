import driver from './game/driver.js';
import game from './game/game.js';

game.init({
    onEnterPlayerCreation: driver.handleEnterPlayerCreation,
});

driver.play(game);
