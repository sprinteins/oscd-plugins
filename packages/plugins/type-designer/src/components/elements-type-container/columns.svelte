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
import type { Column, DataTypeTemplates } from "@/stores/columns-type.store";

//====== INITIALIZATION ======//
const { columns } = columnsStore;
columnsStore.loadDataFromSCD();

interface DndEvent<T> {
	detail: {
		items: T[];
	};
}

const flipDurationMs = 200;
function handleDndConsiderColumns(e: DndEvent<Column>) {
	$columns = e.detail.items;
}
function handleDndFinalizeColumns(e: DndEvent<Column>) {
	$columns = e.detail.items;
}
function handleDndConsiderCards(cid: number, e: DndEvent<DataTypeTemplates>) {
	const colIdx = $columns.findIndex((c) => c.id === cid);
	$columns[colIdx].items = e.detail.items;
	$columns = [...$columns];
}
function handleDndFinalizeCards(cid: number, e: DndEvent<DataTypeTemplates>) {
	const colIdx = $columns.findIndex((c) => c.id === cid);
	$columns[colIdx].items = e.detail.items;
	$columns = [...$columns];
}
</script>

<div class="columns-container" id="type-designer-columns">
	{#if $columns}
		<section use:dndzone={{items:$columns, flipDurationMs, type:'columns'}} 
		         on:consider={handleDndConsiderColumns} 
		         on:finalize={handleDndFinalizeColumns}>
			{#each $columns as column, index (column.id)}
				<div class="column-container {`column-container--${column.visible ? "expanded" : "collapsed"}`}" animate:flip="{{duration: flipDurationMs}}">
					<Paper>
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
								<div class="content" use:dndzone={{items:column.items, flipDurationMs}}
								     on:consider={(e) => handleDndConsiderCards(column.id, e)} 
								     on:finalize={(e) => handleDndFinalizeCards(column.id, e)}>
									
									{#each column.items as elementType (elementType.id)}
										<div class="element-types" animate:flip="{{duration: flipDurationMs}}">
											<Content class="content">
												<ContentCard {elementType} />
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
				</div>
			{/each}
		</section>
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
