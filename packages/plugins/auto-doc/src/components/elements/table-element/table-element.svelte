<script lang="ts">
    import TableColumn from "./table-column.svelte";
    import PlaceholderHelpDialog from "@/components/dialog/placeholder-help-dialog.svelte";

    export let content = "";
	export let onContentChange: (newContent: string) => void;

    let data = [["", ""], ["", ""], ["", ""], ["", ""]];

    let selectedCell = {
        column: 0,
        row: 0,
    };

    $: isPlaceholderHelpDialogOpen = false;

    if(content.trim()) {
        data = JSON.parse(content);
    }

    function updateData(column: number, row: number, value: string) {
        data[column][row] = value;
        onContentChange(JSON.stringify(data));
    }

    function insertPlaceholder() {
        const { column, row } = selectedCell;
        data[column][row] = "{{}}";
    }
</script>

<PlaceholderHelpDialog bind:isOpen={isPlaceholderHelpDialogOpen}/>

<div class="table-element"> 
    <div>
        <button on:click={insertPlaceholder}>Insert placeholder</button>
        <button on:click={() => isPlaceholderHelpDialogOpen = true}>?</button>
    </div>
    <div class="table-element-grid">
        {#each data as column, columnIndex}
            <TableColumn bind:data={column} 
                {columnIndex} 
                on:focus={e => selectedCell = e.detail}
                on:update={e => updateData(columnIndex, e.detail.row, e.detail.value)} 
                rows={column.length}/>
        {/each}
    </div>
</div>



<style>
    .table-element-grid {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
</style>