import '@/shared/styles/board.css';

export default class BoardView {
    eventsEnabled = false;

    #container;
    #size;
    #cellSize;
    #getShipCoordinates;
    #shipInBounds;

    #shipPreview = {
        x: undefined,
        y: undefined,
        direction: undefined,
        length: undefined,
    };

    constructor(container, size, cellSize, getShipCoordinates, shipInBounds) {
        this.#container = container;
        this.#size = size;
        this.#cellSize = cellSize;
        this.#getShipCoordinates = getShipCoordinates;
        this.#shipInBounds = shipInBounds;
        this.#bindEvents();
    }

    render() {
        for (let i = 0; i < this.#size ** 2; i++) {
            const x = i % this.#size;
            const y = this.#size - 1 - Math.floor(i / this.#size);
            const cell = this.#createCell(x, y);
            this.#container.append(cell);
        }
    }

    placeShipPreview(x, y, direction, length) {
        Object.assign(this.#shipPreview, { x, y, direction, length });
        const coordinates = this.#getShipCoordinates(x, y, direction, length);

        for (const [x, y] of coordinates) {
            this.#getCell(x, y).classList.add('ship-preview');
        }
    }

    #bindEvents() {
        document.addEventListener('keydown', this.#moveShipPreview.bind(this));
    }

    #getCell(x, y) {
        return this.#container.querySelector(`[data-x='${x}'][data-y='${y}']`);
    }

    #removeShipPreview() {
        this.#container
            .querySelectorAll('.ship-preview')
            .forEach(element => element.classList.remove('ship-preview'));
    }

    #moveShipPreview(event) {
        if (!this.eventsEnabled) {
            return;
        }

        let { x, y, direction, length } = this.#shipPreview;

        switch (event.key) {
            case 'ArrowUp':
                y++;
                break;
            case 'ArrowDown':
                y--;
                break;
            case 'ArrowLeft':
                x--;
                break;
            case 'ArrowRight':
                x++;
                break;
            default:
                return;
        }

        if (this.#shipInBounds(x, y, direction, length)) {
            this.#removeShipPreview();
            this.placeShipPreview(x, y, direction, length);
        }
    }

    #createCell(x, y) {
        const cell = document.createElement('div');
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.classList.add('coordinate');
        cell.style.width = this.#cellSize;
        cell.style.height = this.#cellSize;
        return cell;
    }
}
