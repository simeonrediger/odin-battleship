// Event payloads

/**
 * @typedef {Object} PlayerChangedDetail
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
 */

/**
 * @typedef {Object} EnteredShipPlacementsDetail
 * @property {string} playerName - Name of the current player.
 * @property {string} opponentName - Name of the current opponent.
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
 * @property {Array<Object>} shipsData - Array of objects containing data for
 *      the ships to be placed, including each ship's ID, length, and direction.
 */

/**
 * @typedef {Object} EnteredRoundDetail
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
 * @property {string} playerName - Name of the current player.
 */

/**
 * @typedef {Object} BoardAttackedDetail
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
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
 * @description Emitted when the current player is changed.
 * @see {@link PlayerChangedDetail}
 */
export const PLAYER_CHANGED = 'PLAYER_CHANGED';

/**
 * @description Emitted upon entering a ship placements phase.
 * @see {@link EnteredShipPlacementsDetail}
 */
export const ENTERED_SHIP_PLACEMENTS = 'ENTERED_SHIP_PLACEMENTS';

/**
 * @description Emitted once all ships have been placed during ship placements.
 */
export const ALL_SHIPS_PLACED = 'ALL_SHIPS_PLACED';

/**
 * @description Emitted upon entering a player's attack phase.
 * @see {@link EnteredRoundDetail}
 */
export const ENTERED_ROUND = 'ENTERED_ROUND';

/**
 * @description Emitted when a player attacks another's board.
 * @see {@link BoardAttackedDetail}
 */
export const BOARD_ATTACKED = 'BOARD_ATTACKED';

/**
 * @description Emitted once a player has won the game.
 * @see {@link GameWonDetail}
 */
export const GAME_WON = 'GAME_WON';
