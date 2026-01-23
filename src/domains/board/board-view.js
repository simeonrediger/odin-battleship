import './board.css';

import { getContentWidth, validateElements } from '@/shared/utils.js';
import Ship from '../ship/ship.js';

export default class BoardView {
    #container;
    #grid;
    #gridSize;
    #cellSize;
    #getShipCoordinates;

    #shipPreview;

    constructor(container, gridSize, getShipCoordinates) {
        this.#cacheElements(container);
        this.#gridSize = gridSize;
        this.#cellSize = this.#getCellSize(container, gridSize);
        this.#getShipCoordinates = getShipCoordinates;
    }

    render() {
        for (let i = 0; i < this.#gridSize ** 2; i++) {
            const x = i % this.#gridSize;
            const y = this.#gridSize - 1 - Math.floor(i / this.#gridSize);
            const cell = this.#createCell(x, y);
            this.#grid.append(cell);
        }
    }

    renderShipPreviewToCenter(id, direction, length) {
        const [x, y] = this.#getCenteredCoordinatesForShip(direction, length);
        this.#renderShipPreview(id, x, y, direction, length);
    }

    get cellSize() {
        return this.#cellSize;
    }

    #cacheElements(container) {
        this.#container = container;
        validateElements({ '#container': this.#container });

        this.#grid = this.#container.querySelector("[data-role$='grid']");
        validateElements({ '#grid': this.#grid });
    }

    #renderShipPreview(id, x, y, direction, length) {
        const coordinates = this.#getShipCoordinates(x, y, direction, length);

        for (const [x, y] of coordinates) {
            const cell = this.#getCell(x, y);
            cell.classList.add('ship-preview-node');
        }

        [x, y] = coordinates[0];
        this.#shipPreview = { id, x, y, direction, length };
    }

    #getCell(x, y) {
        return this.#grid.querySelector(`[data-x='${x}'][data-y='${y}']`);
    }

    #getCellSize(container, gridSize) {
        const gridWidth = getContentWidth(container);
        const cellSize = gridWidth / gridSize;
        return cellSize;
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

    #getCenteredCoordinatesForShip(direction, length) {
        let x, y;

        switch (direction) {
            case Ship.directions.UP:
                y = (this.#gridSize - length) / 2;
                break;
            case Ship.directions.DOWN:
                y = (this.#gridSize + length) / 2;
                break;
            case Ship.directions.LEFT:
                x = (this.#gridSize + length) / 2;
                break;
            case Ship.directions.RIGHT:
                x = (this.#gridSize - length) / 2;
                break;
        }

        [x, y] = [x, y].map(n => Math.floor(n ?? (this.#gridSize - 1) / 2));
        return [x, y];
    }
}
