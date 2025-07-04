<script lang="ts">
    import CustomIconButton from "@oscd-plugins/ui/src/components/smui-wrapper/custom-icon-button.svelte";
import TableColumn from "./table-column.svelte";
    import PlaceholderHelpDialog from "@/ui/components/dialog/placeholder-help-dialog.svelte";
    import Tooltip from "@/ui/components/tooltip/tooltip.svelte";

    interface Props {
        content?: string;
        onContentChange: (newContent: string) => void;
    }

    let { content = "", onContentChange }: Props = $props();

    let data = $state([["", ""], ["", ""], ["", ""], ["", ""]]);

    let selectedCell = $state({
        column: 0,
        row: 0,
    });

    let isPlaceholderHelpDialogOpen = $state(false);
    

    if(content.trim()) {
        data = JSON.parse(content);
    }

    function updateData(column: number, row: number, value: string) {
        data[column][row] = value;
        onContentChange(JSON.stringify(data));
    }

    function insertPlaceholder() {
        const { column, row } = selectedCell;
        data[column][row] = "{{ //default: }}";
    }
</script>

<PlaceholderHelpDialog bind:isOpen={isPlaceholderHelpDialogOpen}/>

<div class="table-element"> 
    <div>
        <Tooltip text="Insert&nbsp;Placeholder">
            <CustomIconButton icon="data_object" size="small" on:click={insertPlaceholder}/>
        </Tooltip>
        <Tooltip text="Placeholder&nbsp;Help">
            <CustomIconButton icon="help" size="small" on:click={() => isPlaceholderHelpDialogOpen = true}/>
        </Tooltip>
    </div>
    <div class="table-element-grid">
        {#each data as column, columnIndex}
            <TableColumn bind:data={data[columnIndex]} 
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