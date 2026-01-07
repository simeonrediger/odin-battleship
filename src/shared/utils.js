export function create2dArray(rows, columns = rows, valueFunc) {
    return new Array(rows)
        .fill()
        .map(() => new Array(columns).fill().map(() => valueFunc?.()));
}
