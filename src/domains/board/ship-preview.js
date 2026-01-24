import '../ship/ship.css';

export default class ShipPreview {
    #getShipCoordinates;
    #getCell;
    #gridQuerySelectorAll;

    #active;
    #id;
    #x;
    #y;
    #direction;
    #length;

    constructor(getShipCoordinates, getCell, gridQuerySelectorAll) {
        this.#getShipCoordinates = getShipCoordinates;
        this.#getCell = getCell;
        this.#gridQuerySelectorAll = gridQuerySelectorAll;
        this.#bindEvents();
    }

    get active() {
        return this.#active;
    }

    render(id, x, y, direction, length) {
        const coordinates = this.#getShipCoordinates(x, y, direction, length);
        this.#remove();

        for (const [x, y] of coordinates) {
            const cell = this.#getCell(x, y);
            cell.classList.add('ship-preview-node');
        }

        [x, y] = coordinates[0];
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
        }
    }

    #remove() {
        this.#gridQuerySelectorAll('.ship-preview-node').forEach(cell =>
            cell.classList.remove('ship-preview-node'),
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

    #setValues(id, x, y, direction, length) {
        this.#id = id;
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
        this.#length = length;
        this.#active = true;
    }
}
