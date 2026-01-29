// Event payloads

/**
 * @typedef {Object} PlayersSubmittedDetail
 * @property {string} player1Type - Player type of player 1.
 * @property {string} player1Name - Name of player 1.
 * @property {string} player2Type - Player type of player 2.
 * @property {string} player2Name - Name of player 2.
 */

/**
 * @typedef {Object} EnteredShipPlacementsDetail
 * @property {string} playerName - Name of the current player.
 * @property {string} opponentName - Name of the current opponent.
 * @property {Array<Object>} shipsData - Array of objects containing data for
 *      the ships to be placed, including each ship's ID, length, and direction.
 */

/**
 * @typedef {Object} ShipPlacementRequestedDetail
 * @property {string} id - The ID of the ship.
 * @property {number} x - The x component of the placement coordinate.
 * @property {number} y - The y component of the placement coordinate.
 * @property {string} direction - The direction of the ship's placement.
 */

/**
 * @typedef {Object} ShipPlacedDetail
 * @property {string} id - The ID of the ship.
 * @property {Array<Array<number>>} coordinates - The coordinates occupied by
 *      the ship.
 */

/**
 * @typedef {Object} ShipPlacementsCompletedDetail
 * @property {boolean} wasPlayer1Turn - true ↔ The ship placements were
 *      completed by player 1.
 */

/**
 * @typedef {Object} EnteredRoundDetail
 * @property {string} playerName - Name of the current player.
 */

/**
 * @typedef {Object} BoardAttackRequestedDetail
 * @property {number} x - The x component of the coordinate to attack.
 * @property {number} y - The y component of the coordinate to attack.
 * @property {boolean} automated - true ↔ The attack is automated.
 */

/**
 * @typedef {Object} BoardAttackedDetail
 * @property {number} x - The x component of the attacked coordinate.
 * @property {number} y - The y component of the attacked coordinate.
 * @property {boolean} shipHit - true ↔ A ship was hit by the attack.
 * @property {Array<Array<number>>|boolean} sunkShipCoordinates - An array of
 *      [x, y] coordinates occupied by a sunk ship. false ↔ The attack did not
 *      sink a ship.
 */

/**
 * @typedef {Object} GameWonDetail
 * @property {string} winnerName - Name of the winning player.
 */

// Event names

/**
 * @description Emitted upon entering the player creation phase.
 */
export const ENTERED_PLAYER_CREATION = 'ENTERED_PLAYER_CREATION';

/**
 * @description Emitted when players are submitted.
 * @see {@link PlayerSubmittedDetail}
 */
export const PLAYERS_SUBMITTED = 'PLAYERS_SUBMITTED';

/**
 * @description Emitted upon entering a ship placements phase.
 * @see {@link EnteredShipPlacementsDetail}
 */
export const ENTERED_SHIP_PLACEMENTS = 'ENTERED_SHIP_PLACEMENTS';

/**
 * @description Emitted when a ship placement is requested.
 * @see {@link ShipPlacementRequestedDetail}
 */
export const SHIP_PLACEMENT_REQUESTED = 'SHIP_PLACEMENT_REQUESTED';

/**
 * @description Emitted when a ship is placed.
 * @see {@link ShipPlacedDetail}
 */
export const SHIP_PLACED = 'SHIP_PLACED';

/**
 * @description Emitted once all ships have been placed during ship placements.
 */
export const ALL_SHIPS_PLACED = 'ALL_SHIPS_PLACED';

/**
 * @description Emitted when ship placements are submitted.
 * @see {@link ShipPlacementsSubmittedDetail}
 */
export const SHIP_PLACEMENTS_SUBMITTED = 'SHIP_PLACEMENTS_SUBMITTED';

/**
 * @description Emitted when ship placements are completed.
 * @see {@link ShipPlacementsSubmittedDetail}
 */
export const SHIP_PLACEMENTS_COMPLETED = 'SHIP_PLACEMENTS_COMPLETED';

/**
 * @description Emitted upon entering a player's attack phase.
 * @see {@link EnteredRoundDetail}
 */
export const ENTERED_ROUND = 'ENTERED_ROUND';

/**
 * @description Emitted when an attack is requested on a board.
 * @see {@link BoardAttackRequestedDetail}
 */
export const BOARD_ATTACK_REQUESTED = 'BOARD_ATTACK_REQUESTED';

/**
 * @description Emitted when a player attacks another's board.
 * @see {@link BoardAttackedDetail}
 */
export const BOARD_ATTACKED = 'BOARD_ATTACKED';

/**
 * @description Emitted when a player's turn has ended.
 */
export const TURN_ENDED = 'TURN_ENDED';

/**
 * @description Emitted once a player has won the game.
 * @see {@link GameWonDetail}
 */
export const GAME_WON = 'GAME_WON';

/**
 * @description Emitted when a game restart is requested.
 * @see {@link GameRestartRequestedDetail}
 */
export const GAME_RESTART_REQUESTED = 'GAME_RESTART_REQUESTED';

/**
 * @description Emitted when a game restart is completed.
 */
export const GAME_RESTART_COMPLETED = 'GAME_RESTART_COMPLETED';
