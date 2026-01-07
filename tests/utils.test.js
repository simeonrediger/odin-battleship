import * as utils from '../src/shared/utils.js';

describe('create2dArray()', () => {
    test('creates 2D array with correct dimensions', () => {
        const rows = 4;
        const columns = 5;
        const array = utils.create2dArray(rows, columns);
        expect(array.length).toBe(rows);
        expect(array[0].length).toBe(columns);
    });

    test('initializes 2D array with correct values', () => {
        expect(utils.create2dArray(3, 3)[0][0]).toBeUndefined();

        const valueFunc = () => ({ prop: 1 });
        const object = utils.create2dArray(3, 3, valueFunc)[0][0];
        const similarObject = valueFunc();
        expect(object).not.toBe(similarObject);
        expect(object).toEqual(similarObject);
    });
});
