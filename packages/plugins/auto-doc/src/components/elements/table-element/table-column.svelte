<script lang="ts">
    import Textfield from "@smui/textfield";
    import { createEventDispatcher } from "svelte";
    
    import { debounce } from "@/utils";

    export let rows = 2;
    export let data = ["", ""];
    export let columnIndex: number;
    
    const ONE_SECOND_IN_MS = 1000;
    
    const debounceUserInput = debounce(handleInputChange, ONE_SECOND_IN_MS);

    const dispatch = createEventDispatcher();

    function getCellStyle(row: number) {
        return row === 0 ? "filled" : "outlined";
    }
    
    function handleFocus(row: number) {
        dispatch("focus", { column: columnIndex, row })
    }
    
    function handleInputChange(row: number, value: string) {
        dispatch('update', { row, value });
    }
</script>


<div class="table-column">
    {#each { length: rows } as _, row}
        <Textfield
            bind:value={data[row]}
            variant={getCellStyle(row)}
            on:focus={() => handleFocus(row)}
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