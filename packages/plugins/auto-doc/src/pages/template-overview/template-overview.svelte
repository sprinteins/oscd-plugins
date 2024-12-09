<script lang="ts">
    import {Table} from '@/components';
    import type {Template} from "./types.template-overview";
    import Button, {Label} from "@smui/button"
    import {IconWrapper} from "@oscd-plugins/ui"
    import {docTemplatesStore} from '@/stores'
    import {push} from 'svelte-spa-router'
    import { onMount } from 'svelte';

    let newTemplateId: string | null = ""
    let allTemplates: Element[] = []

    onMount(() => {
        allTemplates = docTemplatesStore.getAllDocumentTemplates();
    });

    function createNewTemplate(){
        newTemplateId = docTemplatesStore.addDocumentTemplate(
            `Template${templatesConvertedToTableRow.length +1}`, "Test")
        push(`/create/${newTemplateId}`);
    }


    $: templatesConvertedToTableRow = allTemplates.map(mapElementToTableRow)


    function mapElementToTableRow(template: Element):Template{
        const templateDate:string = template.getAttribute('date') as string;
        
        return {
            id: template.getAttribute('id') ?? "No id",
            name: template.getAttribute('title') ?? "No title",
            description: template.getAttribute('description') ?? "No description",
            lastEdited: new Date(templateDate)
        }
    }   

    function deleteTemplate(event: CustomEvent<{templateId: string}>){
        const {templateId} = event.detail
        docTemplatesStore.deleteDocumentTemplate(templateId)
        allTemplates = allTemplates.filter(template => template.getAttribute('id') !== templateId)

    }
</script>

<main class="template-overview">
    <header class="template-controls">
        <Button variant="raised" class="btn-pill btn-pill-primary" on:click={createNewTemplate} > 
            <IconWrapper icon="add"/>
           <Label>Add template</Label> 
        </Button>
        <Button variant="outlined" class="btn-pill btn-pill-outlined">Generate Document</Button>
    </header>

    <Table allTemplates={templatesConvertedToTableRow} on:templateDelete={deleteTemplate}/>

</main>


<style lang="scss">

    $clr-secondary: var(--mdc-theme-secondary);
    $clr-secondary-15: #494fbfcd;

    .template-overview{
        padding: 2rem;
    }
    .template-controls{
        margin: 0 0 1rem 1rem;
        & :global(.btn-pill){
                border-radius: 2em;
                cursor: pointer;
                border-color: $clr-secondary;
        }

        & :global(.btn-pill-outlined){
            color: $clr-secondary;
            &:hover{
                background-color: $clr-secondary;
                color: white;
            }
        }

        & :global(.btn-pill-primary){
            background-color: $clr-secondary;
            color: white;

            &:hover{
                background-color:$clr-secondary-15;
            }
        }
    }
</style>