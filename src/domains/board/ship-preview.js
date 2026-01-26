import '../ship/ship.css';

import eventBus from '../game/event-bus.js';
import * as events from '../game/events.js';
import gameSelectors from '../game/game-selectors.js';
import Ship from '../ship/ship.js';

export default class ShipPreview {
    #getCell;
    #gridQuerySelectorAll;

    #active;
    #id;
    #x;
    #y;
    #direction;
    #length;

    constructor(getCell, gridQuerySelectorAll) {
        this.#getCell = getCell;
        this.#gridQuerySelectorAll = gridQuerySelectorAll;
        this.#bindEvents();
    }

    get active() {
        return this.#active;
    }

    render(id, x, y, direction, length) {
        const coordinates = gameSelectors.getShipCoordinates(
            x,
            y,
            direction,
            length,
        );

        [x, y] = coordinates[0];
        const valid = gameSelectors.shipValid(id, x, y, direction);
        this.#remove();

        for (const [x, y] of coordinates) {
            const cell = this.#getCell(x, y);
            cell.classList.add('ship-preview-node');

            if (!valid) {
                cell.classList.add('ship-preview-invalid');
            }
        }

        this.#setValues(id, x, y, direction, length);
    }

    #bindEvents() {
        document.addEventListener('keydown', this.#handleKeyDown.bind(this));
    }

    #handleKeyDown(event) {
        if (!this.#active) {
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'ArrowDown':
            case 's':
            case 'ArrowLeft':
            case 'a':
            case 'ArrowRight':
            case 'd':
                this.#move(event.key);
                break;
            case 'r':
                this.#rotate();
                break;
            case ' ':
                this.#submit();
                break;
        }
    }

    #remove() {
        this.#gridQuerySelectorAll('.ship-preview-node').forEach(cell =>
            cell.classList.remove('ship-preview-node', 'ship-preview-invalid'),
        );
    }

    #move(key) {
        let x = this.#x;
        let y = this.#y;

        switch (key) {
            case 'ArrowUp':
            case 'w':
                y++;
                break;
            case 'ArrowDown':
            case 's':
                y--;
                break;
            case 'ArrowLeft':
            case 'a':
                x--;
                break;
            case 'ArrowRight':
            case 'd':
                x++;
                break;
            default:
                return;
        }

        this.render(this.#id, x, y, this.#direction, this.#length);
    }

    #rotate() {
        let direction;

        switch (this.#direction) {
            case Ship.directions.UP:
                direction = Ship.directions.RIGHT;
                break;
            case Ship.directions.RIGHT:
                direction = Ship.directions.DOWN;
                break;
            case Ship.directions.DOWN:
                direction = Ship.directions.LEFT;
                break;
            case Ship.directions.LEFT:
                direction = Ship.directions.UP;
                break;
        }

        this.render(this.#id, this.#x, this.#y, direction, this.#length);
    }

    #submit() {
        if (
            !gameSelectors.shipValid(
                this.#id,
                this.#x,
                this.#y,
                this.#direction,
            )
        ) {
            return;
        }

        this.#active = false;
        this.#remove();

        eventBus.emit(events.SHIP_PLACEMENT_REQUESTED, {
            id: this.#id,
            x: this.#x,
            y: this.#y,
            direction: this.#direction,
        });
    }

    #setValues(id, x, y, direction, length) {
        this.#id = id;
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
        this.#length = length;
        this.#active = true;
    }
}
