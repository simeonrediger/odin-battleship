import './board.css';

import { getContentWidth, validateElements } from '@/shared/utils.js';

export default class BoardView {
    #container;
    #grid;
    #gridSize;
    #cellSize;

    constructor(container, gridSize) {
        this.#cacheElements(container);
        this.#gridSize = gridSize;
        this.#cellSize = this.#getCellSize(container, gridSize);
    }

    render() {
        for (let i = 0; i < this.#gridSize ** 2; i++) {
            const x = i % this.#gridSize;
            const y = this.#gridSize - 1 - Math.floor(i / this.#gridSize);
            const cell = this.#createCell(x, y);
            this.#grid.append(cell);
        }
    }

    #cacheElements(container) {
        this.#container = container;
        validateElements({ '#container': this.#container });

        this.#grid = this.#container.querySelector("[data-role$='grid']");
        validateElements({ '#grid': this.#grid });
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
}
