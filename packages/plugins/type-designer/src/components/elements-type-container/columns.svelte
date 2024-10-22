<script lang="ts">
// CONSTANTS
import { ELEMENT_NAMES } from '@oscd-plugins/core'
// SMUI COMPONENTS
import IconButton from '@smui/icon-button'
import Paper, { Content } from '@smui/paper'
import Button from '@smui/button'
// UI COMPONENTS
import { IconWrapper } from '@oscd-plugins/ui'
// LOCAL COMPONENTS
import ContentCard from './content-card.svelte'
import { createNewItem } from './create-new-item'
// STORES
import { dataTypeTemplatesStore } from '../../stores'
// TYPES
import type { Column } from './column-type'

//====== INITIALIZATION ======//

// stores
const { dataTypeTemplatesSubElements } = dataTypeTemplatesStore

// local variables
let columns: Column[] = [
	{
		name: ELEMENT_NAMES.substation,
		visible: true,
		items: $dataTypeTemplatesSubElements.substations
	},
	{
		name: ELEMENT_NAMES.voltageLevel,
		visible: true,
		items: $dataTypeTemplatesSubElements.voltageLevels
	},
	{
		name: ELEMENT_NAMES.bay,
		visible: true,
		items: $dataTypeTemplatesSubElements.bays
	},
	{
		name: ELEMENT_NAMES.ied,
		visible: true,
		items: $dataTypeTemplatesSubElements.ieds
	},
	{
		name: ELEMENT_NAMES.lDevice,
		visible: true,
		items: $dataTypeTemplatesSubElements.logicalDevices
	},
	{ name: ELEMENT_NAMES.lNode, visible: true, items: [] }
]

function toggleColumnVisibility(index: number) {
	columns = columns.map((column, i) =>
		i === index ? { ...column, visible: !column.visible } : column
	)
}

function addItemToColumn(index: number) {
	const column = columns[index]
	const itemCount = column.items.length
	const newItem = createNewItem(column.name, itemCount)

	if (newItem) {
		columns = columns.map((col, i) =>
			i === index ? { ...col, items: [...col.items, newItem] } : col
		)
	}
}
</script>

<div class="columns-container" id="type-designer-columns">
  {#each columns as column, index}
    <Paper class="column-container">
      <article class="column">
        <div class="column-header">
          {#if column.visible}
            <h1>{column.name}</h1>
          {:else}
            <h1>{column.name} (hidden)</h1>
          {/if}
          <IconButton on:click={() => toggleColumnVisibility(index)}>
            <IconWrapper
              icon={column.visible ? "visibility" : "visibility_off"}
              fillColor="rgb(81, 159, 152)"
            />
          </IconButton>
        </div>
        {#if column.visible}
          <Content class="content">
            <div class="element-types">
              {#each column.items as elementType}
                <ContentCard {elementType} />
              {/each}
            </div>
          </Content>
        {/if}
        <div class="add-button-container">
          {#if column.visible && column.name !== ELEMENT_NAMES.lNode}
            <Button class="add-button" on:click={() => addItemToColumn(index)}>
              New {column.name}
            </Button>
          {/if}
        </div>
      </article>
    </Paper>
  {/each}
</div>

<style>
  .columns-container {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    height: 100%;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }

  #type-designer-columns :global(.column-container) {
    padding: 0;
    border: 1px solid rgb(81, 159, 152);
    transition: all 0.3s ease-in-out;
    width: 100%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #type-designer-columns :global(.column-header) {
    display: flex;
    justify-content: space-between;
    margin-left: 1rem;
    padding: 0.5rem;
  }

  #type-designer-columns :global(.content) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .element-types {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .add-button-container {
    background-color: var(--mdc-theme-surface);
    margin-top: auto;
    width: 100%;
  }

  #type-designer-columns :global(.add-button) {
    width: 100%;
    padding: 0.5rem;
    border: none;
    font-size: 1rem;
    text-transform: none;
    height: 44px;
  }

  #type-designer-columns :global(.collapsed-column) {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  #type-designer-columns :global(.rhombus-icon) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 8px;
    height: 8px;
    background-color: rgb(81, 159, 152);
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    .columns-container {
      flex-direction: column;
      height: auto;
    }

    #type-designer-columns :global(.column) {
      max-width: none;
      height: auto;
    }
  }
</style>
