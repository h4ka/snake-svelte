<script>
    import { onDestroy, onMount } from "svelte";
    import Snake from "./lib/classes/snake";

    let board = Array.from(Array(20), () => new Array(20));

    let direction = "left";
    let snake = new Snake(10, 10);
    let timer;

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
        timer = setInterval(function () {
            board = snake.move(direction, board);
        }, 500);
    });

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<main>
    <h1>Lange Schlange</h1>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="board">
        {#each board as row, i}
            <div class="row">
                {#each row as cell, j}
                    <div class="cell">
                        {#if cell === "snake-head"}
                            <div class="snake-head">👀</div>
                        {:else if cell === "snake-body"}
                            <div class="snake-body">🐍</div>
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

    .snake-head {
        height: 100%;
        width: 100%;
        background-color: green;
        border-radius: 10px;
    }

    .snake-body {
        height: 100%;
        width: 100%;
        background-color: rgb(1, 168, 1);
        border-radius: 3px;
    }
</style>
