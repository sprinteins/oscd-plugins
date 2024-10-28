<script lang="ts">
// CONSTANTS
import { ELEMENT_NAMES } from "@oscd-plugins/core";
// SMUI COMPONENTS
import IconButton from "@smui/icon-button";
import Paper, { Content } from "@smui/paper";
import Button from "@smui/button";
// UI COMPONENTS
import { IconWrapper } from "@oscd-plugins/ui";
// LOCAL COMPONENTS
import ContentCard from "./content-card.svelte";
// STORES
import { columnsStore } from "../../stores/columns.store";
import { dndzone } from "svelte-dnd-action";
import { flip } from "svelte/animate";
import type { DataTypeTemplates } from "@/stores/columns-type.store";

//====== INITIALIZATION ======//
const { columns } = columnsStore;
columnsStore.loadDataFromSCD();

interface DndEvent<T> {
	detail: {
		items: T[];
	};
}

let dragOriginId: number | null = null;
let activeDragColumn: number | null = null;

const flipDurationMs = 200;

function handleDndConsiderCards(cid: number, e: DndEvent<DataTypeTemplates>) {
	if (dragOriginId === null) {
		dragOriginId = cid;
	}

	const colIdx = $columns.findIndex((c) => c.id === cid);
	activeDragColumn = cid;

	if (dragOriginId === colIdx || dragOriginId - 1 === colIdx) {
		$columns[colIdx].items = e.detail.items;
		$columns = [...$columns];
	}
	console.log("CONSIDER, origin ID: ", dragOriginId);
}

function handleDndFinalizeCards(cid: number, e: DndEvent<DataTypeTemplates>) {
	if (dragOriginId === null) {
		return;
	}

	const colIdx = $columns.findIndex((c) => c.id === cid);

	if (dragOriginId === colIdx || dragOriginId - 1 === colIdx) {
		$columns[colIdx].items = e.detail.items;
	} else {
		const items = $columns[dragOriginId].items;
		$columns[dragOriginId].items = items;
		console.warn("Invalid drop - reverting to original items (Dev state: erasing the element)");
	}

	$columns = [...$columns];
	dragOriginId = null;
	activeDragColumn = null;
	console.log("FINALIZE, reset origin ID");
}
</script>

<div class="columns-container" id="type-designer-columns">
	{#if $columns}
			{#each $columns as column, index (column.id)}
					<Paper class="column-container {`column-container--${column.visible ? "expanded" : "collapsed"}`}">
						<article class="column">
							<div class="column-header">
								{#if column.visible}
									<h1>{column.name}</h1>
								{:else}
									<h1>{column.name} (hidden)</h1>
								{/if}
								<IconButton on:click={() => columnsStore.toggleColumnVisibility(index)}>
									<IconWrapper
										icon={column.visible ? "visibility" : "visibility_off"}
										fillColor="rgb(81, 159, 152)"
									/>
								</IconButton>
							</div>
							
							{#if column.visible}
								<div use:dndzone={{items:column.items, flipDurationMs}}
									on:consider={(e) => handleDndConsiderCards(column.id, e)} 
									on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
									class="dnd-zone"
									class:active-drop-zone={activeDragColumn === column.id}>
								{#each column.items as elementType (elementType.id)}
									<div class="content" animate:flip="{{duration: flipDurationMs}}">
										<Content class="content">
											<div class="element-types">
												<ContentCard {elementType} />
											</div>
										</Content>
									</div>
								{/each}
							</div>
							{/if}

							{#if column.visible && column.name !== ELEMENT_NAMES.lNode}
								<div class="add-button-container">
									<Button class="add-button" on:click={() => columnsStore.addItemToColumn(index)}>
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
    flex-basis: 100%;
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

	.column-header h1 {
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

	.dnd-zone {
        min-height: 200px;
        transition: all 0.2s ease;
    }

    .dnd-zone:empty {
        border-color: #ccc;
    }

	:global(.dropzone) {
        outline: none !important;
    }
	
	.active-drop-zone {
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
			/* transform-origin: 0 0; */
			transform: rotate(0deg);
			/* line-height: revert !important; */
			position: revert;
			margin: revert;
			
		}

		#type-designer-columns :global(.icon-visibility) {
			margin-top: revert;
		}
	}
</style>
