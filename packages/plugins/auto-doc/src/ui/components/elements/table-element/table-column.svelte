<script lang="ts">
    import Textfield from "@smui/textfield";
    
    import { debounce } from "@/utils";

    interface Props {
        rows?: number;
        data?: any;
        columnIndex: number;
        focus: (args: { column: number, row: number }) => void,
        inputChange: (args: { value: string, row: number }) => void,
    }

    let { rows = 2, data = $bindable(["", ""]), columnIndex, focus, inputChange }: Props = $props();
    
    const ONE_SECOND_IN_MS = 1000;
    
    const debounceUserInput = debounce(handleInputChange, ONE_SECOND_IN_MS);

    function getCellStyle(row: number) {
        return row === 0 ? "filled" : "outlined";
    }
    
    function handleFocus(row: number) {
        focus({ column: columnIndex, row });
    }
    
    function handleInputChange(row: number, value: string) {
        inputChange({ row, value })
    }
</script>


<div class="table-column">
    {#each { length: rows } as _, row}
        <Textfield
            bind:value={data[row]}
            variant={getCellStyle(row)}
            onfocus={() => handleFocus(row)}
            oninput= {e => debounceUserInput(row, e.target.value)}
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