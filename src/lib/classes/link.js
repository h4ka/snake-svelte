import Coordinate from "./coordinate";

export default class SnakeLink {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x = undefined, y = undefined) {
        this.pos = new Coordinate(x, y);
    }
}
