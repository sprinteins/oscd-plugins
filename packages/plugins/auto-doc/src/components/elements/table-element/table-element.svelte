<script lang="ts">
    import TableColumn from "./table-column.svelte";

    export let content = "";
	export let onContentChange: (newContent: string) => void;

    let data = [["", ""], ["", ""], ["", ""], ["", ""]];

    if(content.trim()) {
        data = JSON.parse(content);
    }

    function updateData(column: number, row: number, value: string) {
        data[column][row] = value;
        onContentChange(JSON.stringify(data));
    }
</script>


<div class="table-element"> 
    {#each data as column, columnIndex}
        <TableColumn bind:data={column} on:update={e => updateData(columnIndex, e.detail.row, e.detail.value)} rows={column.length}/>
    {/each}
</div>



<style>
    .table-element {
        display: flex;
        gap: 0.5rem;
    }
</style>