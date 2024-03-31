export default class Snake {
    isAlive = true;

    /**
     * @param {string} direction
     * @param {string[][]} board
     */
    moveHead(direction, board) {
        switch (direction) {
            case "left":
                this.body[0].x -= 1;
                if (this.body[0].x < 0) this.body[0].x = 19;
                break;
            case "right":
                this.body[0].x += 1;
                if (this.body[0].x > 19) this.body[0].x = 0;
                break;
            case "up":
                this.body[0].y -= 1;
                if (this.body[0].y < 0) this.body[0].y = 19;
                break;
            case "down":
                this.body[0].y += 1;
                if (this.body[0].y > 19) this.body[0].y = 0;
                break;
        }
    }

    moveBody() {
        for (let i = 1; i < this.body.length; i++) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;

            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                this.isAlive = false;
            }
        }
    }
    /**
     * @param {string} direction
     * @param {any[][]} board
     */
    move(direction, board) {
        this.moveHead(direction, board);
        this.moveBody();
        return this.redraw();
    }

    /**
     * @returns {Array<Array<string>>}
     **/
    redraw() {
        const board = Array.from(Array(20), () => new Array(20));

        board[this.body[0].y][this.body[0].x] = "snake-head";
        for (let i = 1; i < this.body.length; i++) {
            board[this.body[i].y][this.body[i].x] = "snake-body";
        }
        return board;
    }
    /**
     * @type {Array<SnakeLink>}
     */
    body = [];

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.body.push(new SnakeLink(x, y, true));
    }
}

class SnakeLink {
    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} [isHead]
     */
    constructor(x, y, isHead = false) {
        this.x = x;
        this.y = y;
        this.head = isHead;
    }
}
