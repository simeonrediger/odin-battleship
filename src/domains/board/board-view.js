import './board.css';

import { getContentWidth, validateElements } from '@/shared/utils.js';
import Ship from '../ship/ship.js';
import ShipPreview from './ship-preview.js';

export default class BoardView {
    static getClosestCell(element) {
        return element.closest('.coordinate');
    }

    #container;
    #grid;
    #gridSize;
    #cellSize;
    #shipPreview;

    constructor(container, gridSize, getShipCoordinates, shipValid) {
        this.#cacheElements(container);
        this.#gridSize = gridSize;
        this.#cellSize = this.#getCellSize(container, gridSize);

        this.#shipPreview = new ShipPreview(
            getShipCoordinates,
            this.#getCell.bind(this),
            selector => this.#grid.querySelectorAll(selector),
            shipValid,
        );
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
        this.#shipPreview.render(id, x, y, direction, length);
    }

    renderShip(coordinates) {
        for (const [x, y] of coordinates) {
            const cell = this.#getCell(x, y);
            cell.classList.add('ship-node');
        }
    }

    renderAttack({ x, y, shipHit, sunkShipCoordinates }) {
        const cell = this.#getCell(x, y);
        cell.classList.add('discovered');

        if (shipHit) {
            cell.classList.add('hit');
        }

        if (sunkShipCoordinates) {
            this.#renderSunkShip(sunkShipCoordinates);
        }
    }

    reset() {
        this.#grid.innerHTML = '';
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

    #renderSunkShip(shipCoordinates) {
        for (const [x, y] of shipCoordinates) {
            const cell = this.#getCell(x, y);
            cell.classList.add('sunk');
        }
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
