export default class Player {
    #name;
    #isHuman;

    constructor(name, isHuman) {
        this.#validateArgs(name, isHuman);
        this.#name = name;
        this.#isHuman = isHuman;
    }

    #validateArgs(name, isHuman) {
        if (typeof name !== 'string') {
            throw new TypeError(`Name must be a string. Got ${typeof name}`);
        }

        if (typeof isHuman !== 'boolean') {
            throw new TypeError(
                `isHuman must be a boolean. Got ${typeof isHuman}`,
            );
        }
    }
}
