<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";
    import Board from "./lib/classes/board";

    let board = new Board(20, 20);
    let snake = new Snake(10, 10);

    let direction = "left";
    let timer;

    /**
     * @param {{ key: string; }} event
     */
    function onKeyDown(event) {
        if (event.key === "ArrowLeft" && direction !== "right") {
            direction = "left";
        } else if (event.key === "ArrowRight" && direction !== "left") {
            direction = "right";
        } else if (event.key === "ArrowUp" && direction !== "down") {
            direction = "up";
        } else if (event.key === "ArrowDown" && direction !== "up") {
            direction = "down";
        }
    }

    onMount(async () => {
        board.generateFood();
        timer = setInterval(function () {
            snake.move(direction, board.foodPos);
            board.redraw(snake);
            board = board;
        }, 300);
    });

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<main>
    <h1>Lange Schlange</h1>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="board">
        {#each board.grid as row}
            <div class="row">
                {#each row as cell}
                    <div class="cell">
                        {#if cell === "snake-head"}
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
    .board {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .row {
        display: flex;
        gap: 2px;
    }

    .cell {
        height: 20px;
        width: 20px;
        background-color: rgb(167, 171, 171);
        margin: 0;
        padding: 0;
    }

    .snake {
        height: 100%;
        width: 100%;
        background-color: green;
        border-radius: 5px;
    }
</style>
