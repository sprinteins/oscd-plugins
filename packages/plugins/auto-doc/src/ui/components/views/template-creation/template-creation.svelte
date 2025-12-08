<script lang="ts">
import { type NavigateProps, View } from '../view-navigator/view'

import { clickOutside } from '@/actions'
import { docTemplatesStore } from '@/stores'
import { TemplateBuilder, Tooltip } from '@/ui/components'
import { pdfGenerator } from '@/utils'
import { CustomIconButton } from '@oscd-plugins/ui/src/components'
import Button from '@smui/button'
import Textfield from '@smui/textfield'
import { onMount } from 'svelte'

interface Props extends NavigateProps {
	id: string | null
}

let { id, navigate }: Props = $props()

let title = $state('')
let description = $state('')
let isMetadataVisible = $state(false)
let isGenerating = $state(false)
let templateId: string | undefined = undefined
let template: Element | null = $state(null)

const NO_TITLE_TEXT = 'Untitled Document'

onMount(() => {
	templateId = id ?? createNewTemplate()

	template = docTemplatesStore.getDocumentTemplate(templateId)

	if (!template) {
		navigateToOverviewPage()
		return
	}

	setInitialTitleAndDescription(template)
})

function setInitialTitleAndDescription(template: Element) {
	title = (template.getAttribute('title') as string) || ''
	description = (template.getAttribute('description') as string) || ''
}

function createNewTemplate(): string {
	return docTemplatesStore.addDocumentTemplate() as string
}

function askForEmptyTitleConfirmation() {
	if (!title) {
		const confirmNavigation = confirm(
			'No title has been provided. Do you want to proceed?'
		)
		if (!confirmNavigation) {
			return
		}
	}
	navigateToOverviewPage()
}

function navigateToOverviewPage() {
	navigate({ view: View.Home })
}

function displayTitleAndDescription(e: (MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }) | (KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement; })) {
    e.stopPropagation();
	isMetadataVisible = true
}
function closeTitleAndDescription() {
	isMetadataVisible = false
	if (templateId) {
		updateTitleAndDescription()
	} else {
		console.error(
			'Template ID is null. Cannot update title and description.'
		)
	}
}
let templateTitle = $derived(title.length === 0 ? NO_TITLE_TEXT : title)

function updateTitleAndDescription() {
	docTemplatesStore.editDocumentTemplateTitleAndDescription(
		templateId as string,
		title,
		description
	)
}

async function downloadTemplateContent() {
	if (!templateId || isGenerating) return

	isGenerating = true
	await pdfGenerator
		.downloadAsPdf(templateId)
		.catch((error) => console.error('Error generating PDF:', error))
		.finally(() => {
			isGenerating = false
		})
}

</script>

<div class="template-creation-container">
    <header class="header-container">
        <div class="header">
                <div class="template-title">
                    <CustomIconButton icon="arrow_back" color="black" onclick={askForEmptyTitleConfirmation}/>
                    <Tooltip text="Rename">
                        <div class="title" role="button" tabindex="0" onclick={(e) => displayTitleAndDescription(e)} 
                        onkeydown={(e) => e.key === 'Enter' && displayTitleAndDescription(e)}
                        >
                        {templateTitle}
                    </Tooltip>
                </div>
            <!-- <div class="template-options">
                <Button>open template</Button>
                <Button>save template</Button>
            </div> -->
            <Button variant="raised" onclick={downloadTemplateContent} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Document'}
            </Button>
        </div>
    </header>


    {#if isMetadataVisible}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div class="template-metadata"
            use:clickOutside={closeTitleAndDescription}
            role="dialog"
            onkeydown={(e) => e.key === 'Escape' && closeTitleAndDescription()}
            onclick={(e) => e.stopPropagation()}
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
        {#if template}
            <TemplateBuilder {template}/>
        {/if}
    </main>
</div>




<style lang="scss">

    main.template-builder-container{
      margin-top: 3rem;
      display: flex;
      justify-content: center;
    }

    .header-container{
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
        cursor: pointer;
        & .title{
            min-width: 10rem;
            color: black;
        }
        .title:hover {
            cursor: pointer;
            border-radius: 2px;
            outline: 2px solid gray;
            outline-offset: 2px;
        }
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