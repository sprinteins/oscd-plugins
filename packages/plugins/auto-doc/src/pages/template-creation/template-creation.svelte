<script lang="ts">
    import Button from "@smui/button"
    import {CustomIconButton} from "@oscd-plugins/ui/src/components"
    import {TemplateBuilder} from '@/components';
    import {push} from 'svelte-spa-router'
    import Textfield from "@smui/textfield"
    import {clickOutside} from "@/actions"

    let title = "";
    let description = "";
    let isMetadataVisible = false

    function navigateToOverviewPage(){
        push('/')
    }

    function displayTitleAndDescription(){
        isMetadataVisible = true;
    }
    function closeTitleAndDescription(){
            isMetadataVisible = false
    }   
    $: templateTitle = title.length === 0 ? "Untitled Document" : title;


</script>

<div class="template-creation-container">
    <div class="header-conteiner">
        <header class="header">
            <div class="template-title">
                <CustomIconButton icon="arrow_back" color="black" on:click={navigateToOverviewPage}/>
                <div on:click|stopPropagation={displayTitleAndDescription}>
                    {templateTitle}
                </div>
            </div>
            <div class="template-options">
                <Button>open template</Button>
                <Button>save template</Button>
            </div>
            <Button variant="raised">Export</Button>
        </header>
    </div>


    {#if isMetadataVisible}
        <div class="template-metadata"
            use:clickOutside={closeTitleAndDescription}
            on:click|stopPropagation
            >
                <Textfield
                    bind:value={title}
                    variant="outlined"
                    label="Title"
                >
                </Textfield>
                <Textfield
                    bind:value={description}
                    variant="outlined"
                    label="Description"
                    textarea
                    input$rows={4}
                    input$cols={30}
                    input$resizable={false}
                >
                </Textfield>
        </div>
    {/if}


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

    .template-title{
        display: flex;
        align-items: center;
    }
    .template-options{
        width: 20%;
        display: flex;
        justify-content: space-between;
    }

    .template-metadata{
        display: flex;
        flex-direction: column;
        width: 20%;
        max-width: 25%;
        gap: 1rem;
        position: absolute;
        z-index: 50;
        left: 2%;

        // card "like" styles
        border-radius: .5rem;
        padding: 1.5rem;
        background-color: white;

    }

</style>