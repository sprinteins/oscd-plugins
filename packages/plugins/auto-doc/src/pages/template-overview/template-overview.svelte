<script lang="ts">
    import {Table} from '@/components';
    import type {Template} from "./types.template-overview";
    import Button, {Label} from "@smui/button"
    import Menu from "@smui/menu"
    import List, { Item, Text } from "@smui/list"
    import {IconWrapper} from "@oscd-plugins/ui"
    import {docTemplatesStore} from '@/stores'
    import {push} from 'svelte-spa-router'
    import { onMount } from 'svelte';
    import {pdfGenerator} from '@/utils'
    import MenuBar from '@oscd-plugins/ui/src/components/dev/menu-bar.dev.svelte';

    let menu: Menu
    let newTemplateId: string | null = ""
    let allTemplates: Element[] = []
    const emptyTitleOrDescription = "N/A"

    onMount(() => {
        allTemplates = docTemplatesStore.getAllDocumentTemplates();
    });

    function createNewTemplate(){
        newTemplateId = docTemplatesStore.addDocumentTemplate();
        push(`/create/${newTemplateId}`);
    }


    $: templatesConvertedToTableRow = allTemplates.map(mapElementToTableRow)


    function mapElementToTableRow(template: Element):Template{
        const templateDate: string = template.getAttribute('date') as string;
        
        return {
            id: template.getAttribute('id') ?? "No id",
            name: template.getAttribute('title') ?? emptyTitleOrDescription,
            description: template.getAttribute('description') ?? emptyTitleOrDescription,
            lastEdited: new Date(templateDate)
        }
    }   

    function deleteTemplate(event: CustomEvent<{templateId: string}>){
        const {templateId} = event.detail
        docTemplatesStore.deleteDocumentTemplate(templateId)
        allTemplates = allTemplates.filter(template => template.getAttribute('id') !== templateId)

    }

    function downloadTemplateContent(event: CustomEvent<{templateId: string}>){
        const {templateId} = event.detail
        pdfGenerator.downloadAsPdf(templateId)
    }




    
</script>

<div class="template-overview">
    <header class="template-controls">
        <Button variant="raised" class="btn-pill btn-pill-primary" on:click={() => menu.setOpen(true)} > 
            <IconWrapper icon="add"/>
           <Label>Add template</Label> 
        </Button>
        <Menu bind:this={menu}>
            <List>
                <Item on:SMUI:action={() => createNewTemplate()}>
                    <Text>New</Text>
                </Item>
                <Item on:SMUI:action={() => console.log('onSMUIAction')}>
                    <Text>Import from</Text>
                </Item>
            </List>
        </Menu>
        <Button variant="outlined" class="btn-pill btn-pill-outlined">Generate Document</Button>
    </header>  
    <main>
        <Table 
            allTemplates={templatesConvertedToTableRow} 
            on:templateDelete={deleteTemplate}
            on:templateDownload={downloadTemplateContent}
        />
    </main>

</div>


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