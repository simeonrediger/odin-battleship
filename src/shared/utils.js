export function create2dArray(rows, columns = rows, valueFunc) {
    return new Array(rows)
        .fill()
        .map(() => new Array(columns).fill().map(() => valueFunc?.()));
}

export function validateElements(elements) {
    Object.entries(elements).forEach(([elementName, element]) => {
        if (!element) {
            throw new TypeError(`Element not found: ${elementName}`);
        }
    });
}
