<script lang="ts">
import { IconWrapper } from '@oscd-plugins/ui'
import Button, { Label } from '@smui/button'

import CreateTableDialog from '@/components/dialog/create-table-dialog.svelte'
import ElementWrapper from '@/components/element-wrapper/element-wrapper.svelte'
import ImageElement from '@/components/elements/image-element/image-element.svelte'
import SignalListElement from '@/components/elements/signal-list-element/signal-list-element.svelte'
import TableElement from '@/components/elements/table-element/table-element.svelte'
import TextElement from '@/components/elements/text-element/text-element.svelte'

import type {
	BlockElement,
	ElementMap,
	ElementType
} from '@/components/elements/types.elements'
import { MOVE_BLOCK_DIRECTION } from '@/constants'
import { docTemplatesStore } from '@/stores'
import { pluginStore } from '@/stores/plugin.store'

// Prop
export let template: Element

const { editCount } = pluginStore

const getAllBlocks = () => {
	return Array.from(template.querySelectorAll('Block'))
}

let allBlocks = getAllBlocks()

$: {
	$editCount
	allBlocks = getAllBlocks()
}

$: mappedBlocks = allBlocks.map((block) => {
	return {
		id: block.getAttribute('id') as string,
		type: block.getAttribute('type') as ElementType,
		content: block.textContent
	} as BlockElement
})

let isElementsChoiceVisible = false
$: isCreateTableDialogOpen = false
$: blockElements = mappedBlocks
const componentMap: ElementMap = {
	text: TextElement,
	image: ImageElement,
	signalList: SignalListElement,
	table: TableElement
}

function openTableModal() {
	isCreateTableDialogOpen = true
}

function createTableElement(rows: number, columns: number) {
	const id = addElement('table')

	const setDimensions = () => {
		const data: string[][] = []

		for (let i = 0; i < columns; i++) {
			data[i] = []
			for (let j = 0; j < rows; j++) {
				data[i][j] = ''
			}
		}

		handleContentChange(id, JSON.stringify(data))
	}

	setDimensions()
}

function addElement(type: ElementType) {
	return docTemplatesStore.addBlockToDocumentTemplate(template, type)
}

function duplicateBlockElement(event: CustomEvent<{ elementId: string }>) {
	const { elementId } = event.detail
	const position =
		blockElements.findIndex((element) => element.id === elementId) + 1
	docTemplatesStore.duplicateBlockFromDocumentTemplate(
		template,
		elementId,
		position
	)
}

function moveBlockElement(
	event: CustomEvent<{ elementId: string; direction: number }>
) {
	const { elementId, direction } = event.detail

	const blockElement = blockElements.find(
		(element) => element.id === elementId
	)
	if (!blockElement) {
		return
	}

	const index = blockElements.indexOf(blockElement)
	const isFirst = index === 0
	const isLast = index === blockElements.length - 1

	const preventMoveUp = isFirst && direction === MOVE_BLOCK_DIRECTION.UP
	const preventMoveDown = isLast && direction === MOVE_BLOCK_DIRECTION.DOWN
	if (preventMoveUp || preventMoveDown) {
		return
	}

	const calculatedPosition = index + direction
	const referenceBlock = blockElements[calculatedPosition]
	const reference = template.querySelector(
		`Block[id="${referenceBlock?.id}"]`
	)
	docTemplatesStore.moveBlockInDocumentTemplate(
		template,
		elementId,
		reference
	)
}

function deleteBlockElement(event: CustomEvent<{ elementId: string }>) {
	const { elementId } = event.detail
	docTemplatesStore.deleteBlockFromDocumentTemplate(template, elementId)
}

function handleContentChange(elementId: string, newContent: string) {
	docTemplatesStore.editBlockContentOfDocumentTemplate(
		template,
		elementId,
		newContent
	)
}
</script>


<CreateTableDialog bind:isOpen={isCreateTableDialogOpen} onHandleSubmit={createTableElement}/>

<div class="template-builder">
    <div class="card">

        <div class="elements-list">
            {#each blockElements as blockElement (blockElement.id)}
                <ElementWrapper elementId={blockElement.id} on:elementDuplicate={duplicateBlockElement} on:elementDelete={deleteBlockElement} on:elementMove={(direction) => moveBlockElement(direction)}>
                    <svelte:component 
                        this={componentMap[blockElement.type]}
                        content={blockElement.content}
                        onContentChange={(newContent) => handleContentChange(blockElement.id, newContent)}
                    />
                </ElementWrapper>
            {/each}
        </div>

        <footer>
            <Button on:click={()=> isElementsChoiceVisible = !isElementsChoiceVisible}>
                <IconWrapper icon="add" fillColor="#2aa198"/>
                <Label>
                    add element 
                </Label> 
            </Button>
            <div class="elements-container">
                {#if isElementsChoiceVisible}
                    <Button variant="outlined" on:click={()=>{addElement('text')}}>Text</Button>
                    <Button variant="outlined" on:click={()=>{addElement("image")}}>Image</Button>
                    <Button variant="outlined" on:click={()=>{addElement("signalList")}}>Signal List</Button>
                    <Button variant="outlined" on:click={openTableModal}>Table</Button>
                {/if}
            </div>
        </footer>
    </div>
</div>



<style>

    .template-builder{
        width: 70%;
    }
    .card{
        background-color: white;
        min-height: 50vh;
        overflow-y: auto;
        border-radius: .5rem;
        padding: 1.5rem;
    }

    .elements-list{
        display: flex;
        flex-direction: column;
    }

    footer{
        margin-top: 2rem;
    }

    .elements-container{
        margin-top: 2rem;
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

</style>



