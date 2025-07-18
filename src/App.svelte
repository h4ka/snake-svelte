<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";
    import Board from "./lib/classes/board";
    import Coordinate from "./lib/classes/coordinate";

    const BOARD_SIZE = 20;
    const SNAKE_INITIAL_POSITION = new Coordinate(Math.round(BOARD_SIZE / 2), Math.round(BOARD_SIZE / 2));
    const SNAKE_INITIAL_SPEED = 300;
    const SNAKE_MAX_SPEED = 50;

    $: currentSpeed = Math.max(SNAKE_MAX_SPEED, SNAKE_INITIAL_SPEED * ((100 - snake.body.length) / 100));

    let board = new Board(BOARD_SIZE);
    let snake = new Snake(SNAKE_INITIAL_POSITION, BOARD_SIZE);

    let timer;
    let eatSound;
    let deadSound;
    let isGameRunning = false;
    let gamePaused = false;

    /**
     * @param {{ key: string; }} event
     */
    function onKeyDown(event) {
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
            return;
        }

        if (!isGameRunning && !gamePaused) {
            startGame();
        }
    }

    function restartGame() {
        clearInterval(timer);
        location.reload();
    }

    function pauseGame() {
        if (isGameRunning) {
            gamePaused = true;
            stopGame();
        } else if (gamePaused) {
            gamePaused = false;
            startGame();
        }
    }

    function startGame() {
        if (!snake.isDead) {
            isGameRunning = true;
            timer = setInterval(function () {
                runGame();
            }, currentSpeed);
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

        if (snake.isDead) {
            snake = snake;
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
        }, currentSpeed);
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
    {#if snake.isDead}
        <div class="overlay">
            <h2>GAME OVER</h2>
            <span>press ESC to restart</span>
        </div>
    {/if}
    {#if gamePaused && !snake.isDead}
        <div class="overlay">
            <h2>PAUSE</h2>
            <span>press SPACE to continue</span>
        </div>
    {/if}
    <div id="board" class={snake.isDead ? "blured" : ""} style="--board-size: {BOARD_SIZE}">
        {#each board.grid as row}
            {#each row as cell}
                <div class="cell">
                    <div class="item {cell}"></div>
                </div>
            {/each}
        {/each}
    </div>
    <h2>Score: {snake.body.length}</h2>
</main>
<svelte:window on:keydown|preventDefault={onKeyDown} />
<audio src="/sounds/eat.mp3" bind:this={eatSound}></audio>
<audio src="/sounds/dead.mp3" bind:this={deadSound}></audio>

<style>
    main {
        color: #00ff00;
    }

    .overlay {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(40vmin, 400px);
        height: min(20vmin, 200px);
        place-content: center;
        z-index: 1;
        border-radius: 2vmin;
        background: #00000085;
    }

    .blured {
        filter: blur(5px);
    }

    #board {
        display: grid;
        grid-template-columns: repeat(var(--board-size), 1fr);
        grid-template-rows: repeat(var(--board-size), 1fr);
        grid-gap: 1px;
        width: min(70vmin, 500px);
        height: min(70vmin, 500px);
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
        background-color: #009000d7;
    }

    .snake-dead {
        background-color: #303030;
    }

    .food {
        background-color: #ff0000;
    }

    h1 {
        font-size: min(6vmin, 50px);
        padding: 1rem;
        margin: 0px;
    }

    h2 {
        margin: 0;
        padding: 1rem;
    }
</style>
