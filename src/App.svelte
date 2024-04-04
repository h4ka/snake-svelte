<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";
    import Board from "./lib/classes/board";
    import Coordinate from "./lib/classes/coordinate";

    const BOARD_SIZE = 20;
    const SNAKE_INITIAL_POSITION = new Coordinate(Math.round(BOARD_SIZE / 2), Math.round(BOARD_SIZE / 2));

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
        startGame();

        if (event.key === "ArrowLeft") {
            snake.nextDirection = "left";
        } else if (event.key === "ArrowRight") {
            snake.nextDirection = "right";
        } else if (event.key === "ArrowUp") {
            snake.nextDirection = "up";
        } else if (event.key === "ArrowDown") {
            snake.nextDirection = "down";
        } else if (event.key === "Escape") {
            terminateGame();
            location.reload();
        }
    }

    function startGame() {
        if (!isGameRunning) {
            isGameRunning = true;
            timer = setInterval(
                function () {
                    runGame();
                },
                Math.max(50, 300 * ((100 - snake.body.length) / 100))
            );
        }
    }

    function terminateGame() {
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
            snake = snake;
            terminateGame();
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
        timer = setInterval(
            function () {
                runGame();
            },
            Math.max(50, 300 * ((100 - snake.body.length) / 100))
        );
    }

    onMount(async () => {
        eatSound.volume = 0.5;
        deadSound.volume = 0.5;
        board.generateFood();
        redrawBoard();
    });

    onDestroy(() => {
        terminateGame();
    });
</script>

<main>
    <h1>Lange Schlange</h1>
    <div class="board" style="--rows: {BOARD_SIZE}; --cols: {BOARD_SIZE};">
        {#each board.grid as row}
            {#each row as cell}
                <div class="cell">
                    {#if !snake.isAlive && (cell === "snake-head" || cell === "snake-body")}
                        <div class="snake item">💀</div>
                    {:else if cell === "snake-head"}
                        <div class="snake item">👀</div>
                    {:else if cell === "snake-body"}
                        <div class="snake item"></div>
                    {:else if cell === "food"}
                        <div class="item">🍎</div>
                    {/if}
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
        grid-template-columns: repeat(var(--cols), 1fr);
        grid-template-rows: repeat(var(--rows), 1fr);
        grid-gap: 1px;
        width: min(80vmin, 800px);
        height: min(80vmin, 800px);
        border: 1vmin solid #00ff00;
    }

    .cell {
        padding: 1px;
        background-color: #9d9d9d;
    }

    .item {
        font-size: min(2vmin, 24px);
        height: 100%;
        width: 100%;
        align-content: center;
    }

    .snake {
        background-color: #007500;
        border-radius: 20%;
    }

    h1 {
        color: #00ff00;
        font-size: min(8vmin, 60px);
        padding: 20px;
        margin: 0px;
    }
</style>
