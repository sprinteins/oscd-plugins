<script lang="ts">
import { IconWrapper } from '@oscd-plugins/ui'
import Button, { Label } from '@smui/button'

import CreateTableDialog from '@/ui/components/dialog/create-table-dialog.svelte'
import ElementWrapper from '@/ui/components/element-wrapper/element-wrapper.svelte'
import ImageElement from '@/ui/components/elements/image-element/image-element.svelte'
import SignalListElement from '@/ui/components/elements/signal-list-element/signal-list-element.svelte'
import TableElement from '@/ui/components/elements/table-element/table-element.svelte'
import TextElement from '@/ui/components/elements/text-element/text-element.svelte'
import NetworkElement from '@/ui/components/elements/network-element/network-element.svelte'
import CommunicationElement from '../elements/communication-element/communication-element.svelte'

import { MOVE_BLOCK_DIRECTION } from '@/constants'
import { docTemplatesStore } from '@/stores'
import type {
	BlockElement,
	ElementMap,
	ElementType
} from '@/ui/components/elements/types.elements'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
interface Props {
	// Prop
	template: Element
}

let { template }: Props = $props()

const allBlocks = $derived.by(() => {
	// Editcount is referenced to trigger updates on changes
	pluginGlobalStore.editCount
	return Array.from(template.querySelectorAll('Block'))
})

let mappedBlocks = $derived(
	allBlocks.map((block) => {
		return {
			id: block.getAttribute('id') as string,
			type: block.getAttribute('type') as ElementType,
			content: block.textContent
		} as BlockElement
	})
)

let isElementsChoiceVisible = $state(false)
let isCreateTableDialogOpen = $state(false)

let blockElements = $derived(mappedBlocks)
const componentMap: ElementMap = {
	text: TextElement,
	image: ImageElement,
	signalList: SignalListElement,
	table: TableElement,
	network: NetworkElement,
	communication: CommunicationElement
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

function duplicateBlockElement(elementId: string) {
	const position =
		blockElements.findIndex((element) => element.id === elementId) + 1
	docTemplatesStore.duplicateBlockFromDocumentTemplate(
		template,
		elementId,
		position
	)
}

function moveBlockElement(elementId: string, direction: number) {
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

function deleteBlockElement(elementId: string) {
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

<CreateTableDialog
  bind:isOpen={isCreateTableDialogOpen}
  onHandleSubmit={createTableElement}
/>

<div class="template-builder">
  <div class="card">
    <div class="elements-list">
      {#each blockElements as blockElement (blockElement.id)}
        <ElementWrapper
          elementId={blockElement.id}
          duplicateBlock={duplicateBlockElement}
          deleteBlock={deleteBlockElement}
          moveBlock={moveBlockElement}
        >
          {@const SvelteComponent = componentMap[blockElement.type]}
          <SvelteComponent
            content={blockElement.content}
            onContentChange={(newContent) =>
              handleContentChange(blockElement.id, newContent)}
          />
        </ElementWrapper>
      {/each}
    </div>

    <footer>
      <Button
        onclick={() => (isElementsChoiceVisible = !isElementsChoiceVisible)}
      >
        <IconWrapper icon="add" fillColor="#2aa198" />
        <Label>add element</Label>
      </Button>
      <div class="elements-container">
        {#if isElementsChoiceVisible}
          <Button
            variant="outlined"
            onclick={() => {
              addElement("text");
            }}>Text</Button
          >
          <Button
            variant="outlined"
            onclick={() => {
              addElement("image");
            }}>Image</Button
          >
          <Button
            variant="outlined"
            onclick={() => {
              addElement("signalList");
            }}>Signal List</Button
          >
          <Button
            variant="outlined"
            onclick={() => (isCreateTableDialogOpen = true)}>Table</Button
          >
          <Button
            variant="outlined"
            onclick={() => {
              addElement("network");
            }}>Network</Button
          >
          <Button
            variant="outlined"
            onclick={() => {
              addElement("communication");
            }}>Communication</Button
          >
        {/if}
      </div>
    </footer>
  </div>
</div>

<style>
  .template-builder {
    width: 70%;
  }
  .card {
    background-color: white;
    min-height: 50vh;
    overflow-y: auto;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  .elements-list {
    display: flex;
    flex-direction: column;
  }

  footer {
    margin-top: 2rem;
  }

  .elements-container {
    margin-top: 2rem;
    margin-bottom: 4rem;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
</style>
