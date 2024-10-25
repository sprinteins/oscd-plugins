<script>
    import Button from "@smui/button"
    import {CustomIconButton} from "@oscd-plugins/ui/src/components"



</script>

<div class="template-creation-container">
    <header class="header">
        <div class="template-metadata">
            <CustomIconButton icon="arrow_back" color="black"/>
            <span>untitled document</span>
        </div>
        <div class="template-options">
            <Button>open template</Button>
            <Button>save template</Button>
        </div>

        <Button variant="raised">Export</Button>

    </header>
</div>




<style lang="scss">

    .template-creation-container{
        padding-inline: 1.5rem;

    }
    .header{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .template-metadata{
        display: flex;
        align-items: center;
    }
    .template-options{
        width: 20%;
        display: flex;
        justify-content: space-between;
    }

</style>