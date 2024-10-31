<script lang="ts">
// CONSTANTS
import { SCD_ELEMENTS } from '@oscd-plugins/core'
// SMUI COMPONENTS
import Paper, { Content } from '@smui/paper'
import Button from '@smui/button'
// UI COMPONENTS
import { CustomIconButton } from '@oscd-plugins/ui'
// STORES
import { elementsTypesStore } from '@/stores/elements-types.store'
import { dataTypeTemplatesStore } from '@/stores/data-types-templates.store'
// TYPES
import type { Entries } from '@oscd-plugins/core'
import type { DataTypeTemplates } from '@/types/data-type-templates'

// DNDZONE
import { dndzone } from 'svelte-dnd-action'
import { flip } from 'svelte/animate'
import ContentCard from '@/components/content-card.svelte'

//====== INITIALIZATION ======//
const { columns } = elementsTypesStore

$: columnsEntries = Object.entries($columns) as Entries<typeof $columns>

interface DndEvent<T> {
	detail: {
		items: T[]
	}
}

let dragOriginId: string | null = null
let activeDragColumn: string | null = null

const flipDurationMs = 200

function handleDndConsiderCards(
	cid: string,
	e: CustomEvent<DndEvent<DataTypeTemplates>>
) {
	if (dragOriginId === null) {
		dragOriginId = cid
	}

	activeDragColumn = cid

	// Note: You might want to implement specific drag logic here
	console.log('CONSIDER, origin ID: ', dragOriginId)
}

function handleDndFinalizeCards(
	cid: string,
	e: CustomEvent<DndEvent<DataTypeTemplates>>
) {
	if (dragOriginId === null) {
		return
	}

	// Reset drag state
	dragOriginId = null
	activeDragColumn = null
	console.log('FINALIZE, reset origin ID')
}
</script>

<div class="columns-container" id="type-designer-columns">
	{#if $columns}
	  {#each columnsEntries as [ key, column ]}
				<Paper 
					class="column-container {`column-container--${column.visible ? 'expanded' : 'collapsed'}`}"
				>
					<article class="column">
						<div class="column-header">
							{#if column.visible}
								<h1>{column.name}</h1>
							{:else}
								<h1>{column.name} (hidden)</h1>
							{/if}
							<CustomIconButton
								class="visibility-button"
								icon={column.visible ? "visibility" : "visibility_off"}
								on:click={() => elementsTypesStore.toggleColumnVisibility(key)}
							/>
						</div>
	
						{#if column.visible}
							<div 
								use:dndzone={{
									items: column.types, 
									flipDurationMs
								}}
								on:consider={(e) => handleDndConsiderCards(key, e)} 
								on:finalize={(e) => handleDndFinalizeCards(key, e)}
								class="dnd-zone"
								class:active-drop-zone={activeDragColumn === key}
							>
								{#each column.types as typeElement (typeElement.id)}
									<div 
										class="content" 
										animate:flip="{{duration: flipDurationMs}}"
									>
										<Content class="content">
											<div class="element-types">
												<ContentCard
													name={typeElement.name || `${SCD_ELEMENTS[key].type.baseName}${column.types.indexOf(typeElement) + 1}`}
													currentColumn={key} 
													{typeElement} 
												/>
											</div>
										</Content>
									</div>
								{/each}
							</div>
						{/if}
	
						{#if column.visible && column.name !== SCD_ELEMENTS.lNode.element.name}
							<div class="add-button-container">
								<Button
									class="add-button"
									on:click={() => dataTypeTemplatesStore.addNewType(key)}
								>
									New {column.name}
								</Button>
							</div>
						{/if}
					</article>
				</Paper>
			{/each}
		{/if}
	</div>

<style>
	.columns-container {
		display: flex;
		gap: 1rem;
		padding: 2rem 1rem;
		height: 100%;
		box-sizing: border-box;
	}

	#type-designer-columns :global(.column-container) {
		padding: 0;
		border: 1px solid rgb(81, 159, 152);
		transition: all 0.3s ease-in-out;
	}

	#type-designer-columns :global(.column-container--expanded) {
    flex: 1 1 0;
  }

	#type-designer-columns :global(.column-container--collapsed) {
    padding: 0.5rem;
  }

	.column {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	#type-designer-columns :global(.column-header) {
		display: flex;
    justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
	}

	#type-designer-columns :global(.column-container--collapsed .column-header) {
		padding: revert;
		position: relative;
		height: 100%;
		flex-direction: column;
  }

	.column-container--collapsed .column-header h1 {
		width: max-content;
	}

  #type-designer-columns :global(.column-container--collapsed h1) {
		transform-origin: 0 0;
		transform: rotate(-90deg);
		position: absolute;
		bottom: -1.25rem;
		left: .75rem;
		margin: 0;
  }

	#type-designer-columns :global(.icon-visibility) {
    margin-top: .25rem;
  }

	#type-designer-columns :global(.content) {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	#type-designer-columns :global(.visibility-button) {
		margin-right: -0.5rem;
	}

	#type-designer-columns :global(.column-container--collapsed .visibility-button) {
		margin-right: revert;
	}

	.element-types {
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
		font-size: 1rem;
		text-transform: none;
		height: 44px;
	}

	#type-designer-columns :global(.dnd-zone) {
        min-height: 200px;
        transition: all 0.2s ease;
    }

    #type-designer-columns :global(.dnd-zone:empty) {
        border-color: #ccc;
    }

	:global(.dropzone) {
        outline: none !important;
    }
	
	#type-designer-columns :global(.active-drop-zone) {
        background-color: rgba(255, 0, 0, 0.1);
        border-color: red;
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

		/* COLUMNS COLLAPSE */

		#type-designer-columns :global(.column-container--collapsed) {
			padding: revert;
		}

		#type-designer-columns :global(.column-container--collapsed .column-header) {
			padding: inherit;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 0 1rem;
		}

		#type-designer-columns :global(.column-container--collapsed h1) {
			transform: rotate(0deg);
			position: revert;
			margin: revert;
		}

		#type-designer-columns :global(.icon-visibility) {
			margin-top: revert;
		}
	}
</style>
