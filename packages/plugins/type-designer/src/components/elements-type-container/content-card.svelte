<script lang="ts">
    import Paper from "@smui/paper";
    import Card from "@smui/card";
    import type { Column } from "./columns.svelte";

    export let column: Column;

    function handleCardClick(item: string) {
        console.log("Clicked:", item);
    }
</script>

<div class="column-content">
    {#if column.visible}
        <Paper>
            {#each column.items as item}
                <Card
                    class="card"
                    on:click={() => handleCardClick(JSON.stringify(item))}
                >
                    {item.name}
                    <div class="rhombus-icon"></div>
                </Card>
            {/each}
        </Paper>
    {/if}
</div>
