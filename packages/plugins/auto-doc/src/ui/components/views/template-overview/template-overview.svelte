<script lang="ts">
import { run } from 'svelte/legacy'

import { docTemplatesStore } from '@/stores'
import { FileSelector, Table } from '@/ui/components'
import { pdfGenerator } from '@/utils'
import { queryAutoDocElement } from '@/utils'
import { IconWrapper } from '@oscd-plugins/ui'
import Button, { Label } from '@smui/button'
import Checkbox from '@smui/checkbox'
import List, { Item, Text } from '@smui/list'
import Menu from '@smui/menu'
import { onMount } from 'svelte'
import { type NavigateProps, View } from '../view-navigator/view'
import type { Template } from './types.template-overview'

let { navigate }: NavigateProps = $props()

let menu: Menu
let fileSelector: FileSelector
let isMasterTemplate = $state(docTemplatesStore.getMasterTemplateFlag())
let allTemplates: Element[] = $state([])
const emptyTitleOrDescription = 'N/A'

onMount(() => {
	fetchTemplates()
})

function fetchTemplates() {
	allTemplates = docTemplatesStore.getAllDocumentTemplates()
}

function navigateToCreateTemplate() {
	navigate({ view: View.Create })
}

async function onImportTemplate(file: File) {
	const fileAsString = await file.text()
	const templateDoc = new DOMParser().parseFromString(
		fileAsString,
		'text/xml'
	)

	const autoDocElement = queryAutoDocElement(templateDoc)

	if (autoDocElement === null) {
		return
	}

	const documentTemplates = Array.from(
		autoDocElement.querySelectorAll('DocumentTemplate')
	)

	docTemplatesStore.importDocumentTemplates(documentTemplates)

	// TODO: the ui should update itself after any doc change
	allTemplates = docTemplatesStore.getAllDocumentTemplates()
}

function mapElementToTableRow(template: Element): Template {
	const templateDate: string = template.getAttribute('date') as string

	return {
		id: template.getAttribute('id') ?? 'No id',
		name: template.getAttribute('title') ?? emptyTitleOrDescription,
		description:
			template.getAttribute('description') ?? emptyTitleOrDescription,
		lastEdited: new Date(templateDate)
	}
}

function deleteTemplate(templateId: string) {
	docTemplatesStore.deleteDocumentTemplate(templateId)
	allTemplates = allTemplates.filter(
		(template) => template.getAttribute('id') !== templateId
	)
}

function downloadTemplateContent(templateId: string) {
	pdfGenerator.downloadAsPdf(templateId)
}

function navigateToEditTemplate(templateId: string) {
	navigate({
		view: View.Edit,
		templateId
	})
}

function duplicateTemplate(templateId: string) {
	docTemplatesStore.duplicateDocumentTemplate(templateId)

	fetchTemplates()
}

function openFileSelectorIfNotMasterTemplate() {
	if (isMasterTemplate) {
		console.error('No import allowed for master templates')
		return
	}
	fileSelector.open()
}

let templatesConvertedToTableRow = $derived(
	allTemplates.map(mapElementToTableRow)
)
$effect(() => {
	docTemplatesStore.setMasterTemplateFlag(isMasterTemplate)
})
let importToolTipText = $derived(
	isMasterTemplate ? 'No import allowed for master templates' : ''
)
</script>

<div class="template-overview">
    <header class="template-controls">
        <Button variant="raised" class="btn-pill btn-pill-primary" onclick={() => menu.setOpen(true)} > 
            <IconWrapper fillColor="white" icon="add"/>
           <Label>Add template</Label> 
        </Button>
        <FileSelector bind:this={fileSelector} onchange={onImportTemplate} />
        <Menu bind:this={menu}>
            <List>
                <Item onSMUIAction={() => {
                        // Use timeout to prevent an error from dispatching smui action event
                        // for some reason smui action event is not cancelable, so preventDefault() does not work
                        setTimeout(navigateToCreateTemplate, 0);
                    }}>
                    <Text>New</Text>
                </Item>
                <Item onSMUIAction={() => openFileSelectorIfNotMasterTemplate()}
                    title={importToolTipText}
                >
                    <Text class={isMasterTemplate ? "cursor-not-allowed": ""}>Import from</Text>
                </Item>
            </List>
        </Menu>
        <!-- <Button variant="outlined" class="btn-pill btn-pill-outlined">Generate Document</Button> -->
         <div class="master-template-checkbox-area">
            <Checkbox bind:checked={isMasterTemplate} />
            <span>Master Template</span>
         </div>

    </header>  
    <main>
        <Table 
            allTemplates={templatesConvertedToTableRow} 
            deleteTemplate={deleteTemplate}
            downloadTemplate={downloadTemplateContent}
            editTemplate={navigateToEditTemplate}
            duplicateTemplate={duplicateTemplate}
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
        display: flex;
        justify-content: space-between;
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

    .master-template-checkbox-area{
        display: flex;
        align-items: center;
    }

    :global(.cursor-not-allowed){
        cursor: not-allowed;
        color: #a6a6a6;
    }
</style>