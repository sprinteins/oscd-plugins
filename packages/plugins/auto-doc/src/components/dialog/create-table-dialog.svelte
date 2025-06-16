<script lang="ts">
import Button, { Label } from '@smui/button'
import Dialog, { Title, Content, Actions } from '@smui/dialog'
import Textfield from '@smui/textfield'

export let isOpen = false
export let onHandleSubmit = (_rows: number, _columns: number) => {}

let rows = 2
let columns = 4

let minRows = 2
let maxRows = 2
let minColumns = 1
let maxColumns = 8

function handleSubmit() {
	const isValidInput = Number(rows) && Number(columns)
	const isWithinBounds =
		rows >= minRows &&
		rows <= maxRows &&
		columns >= minColumns &&
		columns <= maxColumns

	if (!isValidInput || !isWithinBounds) {
		return
	}

	onHandleSubmit(rows, columns)
}
</script>

<Dialog
    bind:open={isOpen}
    aria-labeledby="create-table-dialog-title"
    aria-describedby="create-table-dialog-content"
>
    <Title id="create-table-dialog-title">New Table</Title>
    <Content id="create-table-dialog-content">
        Specify the dimensions. 
        <div id="create-table-dialog__input">
            {#if false}
                <Textfield 
                    class="mdc-text-field--with-leading-icon"
                    bind:value={rows}
                    variant="outlined"
                    label={"Rows"}
                    type="number"
                    input$min={minRows}
                    input$max={maxRows}
                >
                </Textfield>
            {/if}
            <Textfield 
                bind:value={columns}
                variant="outlined"
                label={"Columns"}
                type="number"
                input$min={minColumns}
                input$max={maxColumns}
            >
            </Textfield>
        </div>
        <Actions>
            <Button action="none">
                <Label>Cancel</Label>
            </Button>
            <Button action="none" on:click={handleSubmit}>
                <Label>Add</Label>
            </Button>
        </Actions>
    </Content>
</Dialog>

<style>
    #create-table-dialog__input {
        display: flex;

        margin-top: 1.5rem;
        gap: 0.5rem;
    }

    #create-table-dialog__input :global(label){
        flex: 1;
    }
</style>
