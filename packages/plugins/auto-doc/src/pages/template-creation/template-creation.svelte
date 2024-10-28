<script>
    import Button from "@smui/button"
    import {CustomIconButton} from "@oscd-plugins/ui/src/components"
    import {TemplateBuilder} from '@/components';




</script>

<div class="template-creation-container">
    <div class="header-conteiner">
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

    <main class="template-builder-container">
        <TemplateBuilder/>
    </main>
</div>




<style lang="scss">

    main.template-builder-container{
      margin-top: 3rem;
      display: flex;
      justify-content: center;
    }

    .header-conteiner{
        border-bottom: 1px solid rgba(128, 128, 128, 0.27);
        padding: .75rem .75rem .25rem .25rem;
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