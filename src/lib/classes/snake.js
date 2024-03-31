import Coordinate from "./coordinate";
import SnakeLink from "./link";

export default class Snake {
    /**
     * @type {Array<SnakeLink>}
     */
    body = [];

    ate = false;
    isAlive = true;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.body.push(new SnakeLink(x, y));
    }

    /**
     * @param {string} direction
     */
    calcNextMove(direction) {
        let nextMove = new Coordinate(this.body[0].pos.x, this.body[0].pos.y);

        switch (direction) {
            case "left":
                nextMove.x -= 1;
                break;
            case "right":
                nextMove.x += 1;
                break;
            case "up":
                nextMove.y -= 1;
                break;
            case "down":
                nextMove.y += 1;
                break;
        }

        // check and adjust if next move is out of bounds
        if (nextMove.x < 0) nextMove.x = 19;
        if (nextMove.x > 19) nextMove.x = 0;
        if (nextMove.y < 0) nextMove.y = 19;
        if (nextMove.y > 19) nextMove.y = 0;

        return nextMove;
    }

    /**
     * @param {string} direction
     * @param {Coordinate} food
     */
    move(direction, food) {
        // calculate next move
        let nextMove = this.calcNextMove(direction);

        // check if ate food and add new link to snake
        if (food.x === nextMove.x && food.y === nextMove.y) {
            this.body.push(new SnakeLink());
            this.ate = true;
        }

        // move snake body and check if snake is dead
        let prev = new Coordinate(this.body[0].pos.x, this.body[0].pos.y);
        let curr;
        for (let i = 1; i < this.body.length; i++) {
            curr = new Coordinate(this.body[i].pos.x, this.body[i].pos.y);

            this.body[i].pos = prev;

            if (nextMove.x === this.body[i].pos.x && nextMove.y === this.body[i].pos.y) {
                this.isAlive = false;
            }
            prev = new Coordinate(curr.x, curr.y);
        }

        // move snake head
        this.body[0].pos.x = nextMove.x;
        this.body[0].pos.y = nextMove.y;
    }
}
