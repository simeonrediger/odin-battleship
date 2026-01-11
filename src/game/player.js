export default class Player {
    #name;

    constructor(name) {
        this.#validateArgs(name);
        this.#name = name;
    }

    #validateArgs(name) {
        if (typeof name !== 'string') {
            throw new TypeError(`Name must be a string. Got ${typeof name}`);
        }
    }
}
