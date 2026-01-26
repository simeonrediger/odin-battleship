// Event payloads

/**
 * @typedef {Object} EnteredShipPlacementsDetail
 * @property {string} playerName - Name of the current player.
 * @property {string} opponentName - Name of the current opponent.
 * @property {boolean} isPlayer1Turn - true ↔ It is player 1's turn.
 * @property {Object} shipsData - Array of objects containing data for the ships
 *      to be placed, including each ship's ID, length, and direction.
 */

// Event names

/**
 * @description Emitted upon entering the player creation phase.
 * @event ENTERED_PLAYER_CREATION
 */
export const ENTERED_PLAYER_CREATION = 'ENTERED_PLAYER_CREATION';

/**
 * @description Emitted upon entering a ship placements phase.
 * @event ENTERED_SHIP_PLACEMENTS
 * @see {@link EnteredShipPlacementsDetail}
 */
export const ENTERED_SHIP_PLACEMENTS = 'ENTERED_SHIP_PLACEMENTS';
