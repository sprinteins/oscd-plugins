<script lang="ts">
    import Textfield from "@smui/textfield";
    import { createEventDispatcher } from "svelte";
    
    import { debounce } from "@/utils";

    export let rows = 2;
    export let data = ["", ""];

    const ONE_SECOND_IN_MS = 1000;
    
    const debounceUserInput = debounce(handleInputChange, ONE_SECOND_IN_MS);

    const dispatch = createEventDispatcher();
    
    function handleInputChange(row: number, value: string) {
        dispatch('update', { row, value });
    }
</script>


<div class="table-column">
    {#each { length: rows } as _, row}
        <Textfield
            bind:value={data[row]}
            variant="outlined"
            on:input= {e => debounceUserInput(row, e.target.value)}
        >
        </Textfield>
    {/each}
</div>

<style>
    .table-column {
        display: flex;
        flex-direction: column;
        
        width: 100%;
        gap: 0.5rem;
    }
</style>