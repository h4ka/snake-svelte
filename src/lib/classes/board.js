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
     * @param { number } size
     */
    constructor(size) {
        this.x = size;
        this.y = size;
        this.grid = Array.from(Array(size), () => new Array(size));
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
            this.grid[snake.body[i].pos.y][snake.body[i].pos.x] = snake.isDead ? "snake-dead" : "snake-body";
        }
        this.grid[snake.body[0].pos.y][snake.body[0].pos.x] = snake.isDead ? "snake-dead" : "snake-head";
        this.grid[this.foodPos.y][this.foodPos.x] = "food";
    }
}
