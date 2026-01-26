// Event payloads

/**
 * @typedef {Object} EnteredShipPlacementsDetail
 * @property {string} playerName - Name of the current player.
 * @property {string} opponentName - Name of the current opponent.
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
 * @property {Object} shipsData - Array of objects containing data for the ships
 *      to be placed, including each ship's ID, length, and direction.
 */

/**
 * @typedef {Object} EnteredRoundDetail
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
 * @property {string} playerName - Name of the current player.
 */

// Event names

/**
 * @description Emitted upon entering the player creation phase.
 */
export const ENTERED_PLAYER_CREATION = 'ENTERED_PLAYER_CREATION';

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
