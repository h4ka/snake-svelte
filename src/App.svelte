<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";
    import Board from "./lib/classes/board";
    import Coordinate from "./lib/classes/coordinate";

    const BOARD_SIZE = 20;
    const SNAKE_INITIAL_POSITION = new Coordinate(Math.round(BOARD_SIZE / 2), Math.round(BOARD_SIZE / 2));
    const SNAKE_INITIAL_SPEED = 300;
    const SNAKE_MAX_SPEED = 50;

    $: CURRENT_SPEED = Math.max(SNAKE_MAX_SPEED, SNAKE_INITIAL_SPEED * ((100 - snake.body.length) / 100));

    let board = new Board(BOARD_SIZE);
    let snake = new Snake(SNAKE_INITIAL_POSITION, BOARD_SIZE);

    let timer;
    let eatSound;
    let deadSound;
    let isGameRunning = false;

    /**
     * @param {{ key: string; }} event
     */
    function onKeyDown(event) {
        if (!isGameRunning) {
            startGame();
        }

        if (event.key === "ArrowLeft") {
            snake.nextDirection = "left";
        } else if (event.key === "ArrowRight") {
            snake.nextDirection = "right";
        } else if (event.key === "ArrowUp") {
            snake.nextDirection = "up";
        } else if (event.key === "ArrowDown") {
            snake.nextDirection = "down";
        } else if (event.key === "Escape") {
            restartGame();
        } else if (event.key === " ") {
            pauseGame();
        }
    }

    function restartGame() {
        clearInterval(timer);
        location.reload();
    }

    function pauseGame() {
        isGameRunning ? stopGame() : startGame();
    }

    function startGame() {
        if (snake.isAlive) {
            isGameRunning = true;
            timer = setInterval(function () {
                runGame();
            }, CURRENT_SPEED);
        }
    }

    function stopGame() {
        isGameRunning = false;
        clearInterval(timer);
    }

    function redrawBoard() {
        board.redraw(snake);
        board = board;
    }

    function runGame() {
        snake.move(board.foodPos);

        if (!snake.isAlive) {
            deadSound.play();
            redrawBoard();
            stopGame();
        } else if (snake.ate) {
            eatSound.play();
            snake.ate = false;
            board.generateFood();
            redrawBoard();
            speedUp();
        } else {
            redrawBoard();
        }
    }

    function speedUp() {
        clearInterval(timer);
        timer = setInterval(function () {
            runGame();
        }, CURRENT_SPEED);
    }

    onMount(async () => {
        eatSound.volume = 0.5;
        deadSound.volume = 0.5;
        board.generateFood();
        redrawBoard();
    });

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<main>
    <h1>Lange Schlange</h1>
    <div class="board" style="--board-size: {BOARD_SIZE};">
        {#each board.grid as row}
            {#each row as cell}
                <div class="cell">
                    <div class="item {cell}"></div>
                </div>
            {/each}
        {/each}
    </div>
    <h1>Score: {snake.body.length}</h1>
</main>
<svelte:window on:keydown|preventDefault={onKeyDown} />
<audio src="src/assets/sounds/eat.mp3" bind:this={eatSound}></audio>
<audio src="src/assets/sounds/dead.mp3" bind:this={deadSound}></audio>

<style>
    .board {
        display: grid;
        grid-template-columns: repeat(var(--board-size), 1fr);
        grid-template-rows: repeat(var(--board-size), 1fr);
        grid-gap: 1px;
        width: min(80vmin, 800px);
        height: min(80vmin, 800px);
        border: 1vmin solid #00ff00;
    }

    .cell {
        background-color: #9d9d9d;
        padding: 1px;
    }

    .item {
        font-size: calc(30vmin / var(--board-size));
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }

    .snake-head {
        background-color: #009000;
        border-radius: 30%;
    }

    .snake-body {
        background-color: #009000;
    }

    .snake-dead {
        background-color: #303030;
    }

    .food {
        background-color: #ff0000cc;
    }

    h1 {
        color: #00ff00;
        font-size: min(8vmin, 60px);
        padding: 20px;
        margin: 0px;
    }
</style>
