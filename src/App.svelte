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
        if (!isGameRunning) {
            isGameRunning = true;
            timer = setInterval(function () {
                runGame();
            }, 300);
        }
        if (event.key === "ArrowLeft") {
            snake.nextDirection = "left";
        } else if (event.key === "ArrowRight") {
            snake.nextDirection = "right";
        } else if (event.key === "ArrowUp") {
            snake.nextDirection = "up";
        } else if (event.key === "ArrowDown") {
            snake.nextDirection = "down";
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
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#if !snake.isAlive}
        <div class="game-over">
            <h1>GAME OVER</h1>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="restart-button" on:click={() => location.reload()}>restart</div>
        </div>
    {/if}
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
</main>
<svelte:window on:keydown|preventDefault={onKeyDown} />
<audio src="src/assets/sounds/eat.mp3" bind:this={eatSound}></audio>
<audio src="src/assets/sounds/dead.mp3" bind:this={deadSound}></audio>

<style>
    h1 {
        color: #22ff00;
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

    .game-over {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #22ff00;
    }

    .restart-button {
        cursor: pointer;
        color: #22ff00;
        border-radius: 25px;
        padding: 5px;
        margin-top: 10px;
        text-align: center;
        font-weight: 400;
        background-color: rgb(92, 92, 92);

        font-size: 20px;
        border: 1px solid #22ff00;
    }
</style>
