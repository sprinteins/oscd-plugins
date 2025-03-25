<script lang="ts">
    import Textfield from "@smui/textfield";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    
    export let isOpen = false;
    export let onHandleSubmit = (rows: number, columns: number) => {};

    let rows = 2;
    let columns = 4;

    function handleCancel() {
        console.log("canceled")
    }

    function handleSubmit() {
        onHandleSubmit(rows, columns);
    }
</script>

<Dialog
    bind:open={isOpen}
    aria-labeledby="create-table-dialog-title"
    aria-describedby="create-table-dialog-content"
>
    <Title id="create-table-dialog-title">Add Table</Title>
    <Content id="create-table-dialog-content">
        <Textfield 
        bind:value={rows}
        variant="outlined"
        label={"Rows"}
        type="number"
        ></Textfield>
        <Textfield 
            bind:value={columns}
            variant="outlined"
            label={"Columns"}
            type="number"
        ></Textfield>
        <Actions>
            <Button action="none" on:click={handleCancel}>
                <Label>Cancel</Label>
            </Button>
            <Button action="none" on:click={() => handleSubmit()}>
                <Label>Add</Label>
            </Button>
        </Actions>
    </Content>
</Dialog>

<style>
    .mdc-dialog__content {
        padding-top: 10px !important;
    } 
</style>
