<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";
    import Board from "./lib/classes/board";
    import Coordinate from "./lib/classes/coordinate";

    const BOARD_SIZE = { x: 20, y: 20 };
    const SNAKE_INITIAL_POSITION = new Coordinate(10, 10);

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

    /**
     * @param {string} direction
     */
    function turn(direction) {
        startGame();
        snake.nextDirection = direction;
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
        board.generateFood();
        redrawBoard();
    });

    onDestroy(() => {
        terminateGame();
    });
</script>

<main>
    <h1>🐍 Lange Schlange 🐍</h1>
    <div class="board">
        {#each board.grid as row}
            <div class="row">
                {#each row as cell}
                    <div class="cell">
                        {#if !snake.isAlive && (cell === "snake-head" || cell === "snake-body")}
                            <div class="snake">💀</div>
                        {:else if cell === "snake-head"}
                            <div class="snake">👀</div>
                        {:else if cell === "snake-body"}
                            <div class="snake">🟢</div>
                        {:else if cell === "food"}
                            <div class="food">🍎</div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    <div class="container">
        {#if !snake.isAlive}
            <div class="game-over">
                <div class="restart-button" on:click={() => location.reload()}>restart</div>
            </div>
        {:else}
            <div class="controls">
                <div on:click={() => turn("left")} class="left arrow">⬅️</div>
                <div class="updown">
                    <div on:click={() => turn("up")} class="up arrow">⬆️</div>
                    <div>🐍</div>
                    <div on:click={() => turn("down")} class="down arrow">⬇️</div>
                </div>
                <div on:click={() => turn("right")} class="right arrow">➡️</div>
            </div>
        {/if}
    </div>
</main>
<svelte:window on:keydown|preventDefault={onKeyDown} />
<audio src="src/assets/sounds/eat.mp3" bind:this={eatSound}></audio>
<audio src="src/assets/sounds/dead.mp3" bind:this={deadSound}></audio>

<style>
    h1 {
        color: #22ff00;
        font-size: min(calc(100vw / 10), 40px);
        line-height: 1.2;
        margin-bottom: 1em;
    }

    .board {
        display: flex;
        flex-direction: column;
        gap: 2px;
        border: 3px solid #22ff00;
    }

    .row {
        display: flex;
        gap: 2px;
    }

    .cell {
        height: 20px;
        width: 20px;
        background-color: #a7abab;
        margin: 0;
        padding: 0;
    }

    .snake {
        height: 100%;
        width: 100%;
        background-color: #007500;
        border-radius: 100%;
        font-size: small;
        display: flex;
        justify-content: center;
        align-items: center;
        border: #19bb00 1px solid;
    }

    .container {
        display: flex;
        flex-direction: column;
        margin-top: 3em;
    }

    .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 5em;
        font-size: min(calc(100vw / 10), 40px);
    }

    .arrow {
        color: #22ff00;
        width: 50px;
        height: 50px;
        margin: 10px;
    }

    .updown {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .game-over {
        color: #22ff00;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .restart-button {
        cursor: pointer;
        color: #22ff00;
        border-radius: 100%;
        width: 5em;
        height: 5em;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: min(calc(100vw / 10), 40px);
        border: 2px solid #22ff00;
    }
</style>
