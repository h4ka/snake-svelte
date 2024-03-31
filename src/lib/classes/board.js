import Coordinate from "./coordinate";
import Snake from "./snake";

export default class Board {
    /**
     * @type {string[][]}
     */
    grid;

    /**
     * @type {Coordinate}
     */
    foodPos;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.grid = Array.from(Array(x), () => new Array(y));
    }

    generateFood() {
        let x = Math.floor(Math.random() * this.x);
        let y = Math.floor(Math.random() * this.y);
        while (this.grid[y][x] !== undefined) {
            x = Math.floor(Math.random() * this.x);
            y = Math.floor(Math.random() * this.y);
        }
        this.grid[y][x] = "food";
        this.foodPos = new Coordinate(x, y);
    }

    /**
     * @param {Snake} snake
     */
    redraw(snake) {
        this.grid = Array.from(Array(this.x), () => new Array(this.y));

        for (let i = 1; i < snake.body.length; i++) {
            this.grid[snake.body[i].pos.y][snake.body[i].pos.x] = "snake-body";
        }

        this.grid[snake.body[0].pos.y][snake.body[0].pos.x] = "snake-head";

        if (snake.ate) {
            snake.ate = false;
            this.generateFood();
        }

        this.grid[this.foodPos.y][this.foodPos.x] = "food";
    }
}
