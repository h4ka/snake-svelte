<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";
    import Board from "./lib/classes/board";

    let board = new Board(20, 20);
    let snake = new Snake(10, 10);

    let timer;

    /**
     * @param {{ key: string; }} event
     */
    function onKeyDown(event) {
        if (event.key === "ArrowLeft" && snake.direction !== "right") {
            snake.direction = "left";
        } else if (event.key === "ArrowRight" && snake.direction !== "left") {
            snake.direction = "right";
        } else if (event.key === "ArrowUp" && snake.direction !== "down") {
            snake.direction = "up";
        } else if (event.key === "ArrowDown" && snake.direction !== "up") {
            snake.direction = "down";
        }
    }

    function terminateGame() {
        clearInterval(timer);
    }

    function runGame() {
        snake.move(board.foodPos);

        if (snake.ate) {
            speedUp();
        }

        board.redraw(snake);
        board = board;

        if (!snake.isAlive) {
            snake = snake;
            terminateGame();
        }
    }

    onMount(async () => {
        board.generateFood();
        timer = setInterval(function () {
            runGame();
        }, 300);
    });

    onDestroy(() => {
        clearInterval(timer);
    });

    function speedUp() {
        clearInterval(timer);
        board.redraw(snake);
        board = board;

        timer = setInterval(
            function () {
                runGame();
            },
            300 * ((100 - snake.body.length) / 100)
        );
    }
</script>

<main>
    <h1>Lange Schlange 🐍</h1>
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
                        {#if !snake.isAlive && cell === "snake-head"}
                            <div class="snake">💀</div>
                        {:else if cell === "snake-head"}
                            <div class="snake">👀</div>
                        {:else if cell === "snake-body"}
                            <div class="snake"></div>
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
        background-color: green;
        border-radius: 5px;
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
