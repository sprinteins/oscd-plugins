<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
import {
	filterState,
	type SelectedFilter
} from '../../../stores/_store-view-filter/selected-filter-store'
import {
	selectIEDNode,
	clearSelection,
	setNameFilter,
	clearIEDSelection,
	toggleMultiSelectionOfIED
} from '../../../stores/_store-view-filter/selected-filter-store-functions'
import ConnectionSelector from './assets/connection-selector.svg'
import type { RootNode } from '@oscd-plugins/ui/src/components/diagram'
// import type { BayNode, IEDNode, RootNode } from '@oscd-plugins/ui/src/components/diagram'
// import { ConnectionTypeFilter } from './connection-type-filter'
// import { MessageTypeFilter } from './message-type-filter'
import ConnectionInformation from './connection-information/connection-information.svelte'
// import IEDAccordion from './ied-accordion/ied-accordion.svelte'
import { preferences$ } from '../../../stores/_store-preferences/preferences-store'

	interface Props {
		rootNode: RootNode;
		bays: string[];
	}

	let { rootNode, bays }: Props = $props();
//let IEDs = rootNode.children
let searchQuery = $state('')
let filterTextFieldFocused = $state(false)


function handleConnectionDirectionDisabled(
	filter: SelectedFilter,
	iedFilterDisabled: boolean
): boolean {
	if (iedFilterDisabled) return true

	const selectedIEDs = filter?.selectedIEDs
	const selectedCon = filter?.selectedConnection?.id

	return Boolean(selectedIEDs.length === 0 && selectedCon === undefined)
}

function handleNameFilterChange(e: Event) {
	const target = e.target as HTMLInputElement
	setNameFilter(target.value)
}

function handleDropdownSelect(e: Event) {
	const target = e.target as HTMLElement
	searchQuery = target.innerText || ''
	if (bays.includes(searchQuery)) {
		clearIEDSelection()
		for (const node of rootNode.children) {
			if (node.bays?.has(searchQuery)) {
				toggleMultiSelectionOfIED(node)
			}
		}
	} else {
		let selectedNode = rootNode.children.find(
			(node) => node.label == searchQuery
		)
		if (selectedNode) {
			selectIEDNode(selectedNode)
		}
	}
}

function clearAll() {
	searchQuery = ''
	clearSelection()
}
let IEDSelections = $derived($filterState?.selectedIEDs)
let ConnectionSelection = $derived($filterState.selectedConnection)
let selectedMessageTypes = $derived($filterState.selectedMessageTypes)
let isIedFiltersDisabled = $derived($filterState?.selectedConnection !== undefined)
let isConnectionDirectionDisabled = $derived(handleConnectionDirectionDisabled(
	$filterState,
	isIedFiltersDisabled
))
// let filteredIEDs =
// 	$derived((searchQuery &&
// 		IEDs?.filter((ied) =>
// 			ied.label.toLowerCase().includes(searchQuery.toLowerCase())
// 		)) ||
// 	IEDs)
let filteredBays =
	$derived((searchQuery &&
		bays?.filter((bay) =>
			bay.toLowerCase().includes(searchQuery.toLowerCase())
		)) ||
	bays)
</script>

<div class="sidebar sidebar-right">
	<div class="sidebar-content">
			<!-- svelte-ignore a11y_missing_attribute -->
			<div class="actions">
					<a class="clear-all" onkeypress={bubble('keypress')} onclick={clearAll}>
							Clear all
					</a>
			</div>

			<div class="search_filter">
					<img src={ConnectionSelector} alt="connection selector" />
					<div class="search_container">
							<input
									type="text"
									placeholder="Filter IED or bay"
									bind:value={searchQuery}
									onfocus={()=> filterTextFieldFocused = true}
									onblur={()=> filterTextFieldFocused = false}
							/>
							{#if filterTextFieldFocused}
									<div class="dropdown">
											<!-- {#if filteredIEDs.length > 0}
													<div class="dropdown_label">
															IEDs ({filteredIEDs.length})
													</div>
													{#each filteredIEDs as ied}
															<div class="dropdown_content" role="button" tabindex="0" onmousedown={handleDropdownSelect}>
																	{ied.label}
															</div>
													{/each}
													{#if filteredBays.length > 0}
															<hr>
													{/if}
											{/if} -->
											{#if filteredBays.length > 0}
													<div class="dropdown_label">
															bays ({filteredBays.length})
													</div>
													{#each filteredBays as bay}
															<div class="dropdown_content" role="button" tabindex="0" onmousedown={handleDropdownSelect}>
																	{bay}
															</div>
													{/each}
											{/if}
									</div>  
							{/if} 
					</div>
			</div>

			<!-- <div class="centered">
					<ConnectionTypeFilter 
							disabled={isConnectionDirectionDisabled} 
							isFilterIncomingActive={$filterState.incomingMessageFilterActive}
							isFilterOutgoingActive={$filterState.outgoingMessageFilterActive}
					/>
			</div> -->

			<hr class="dashed-line" />
			<!-- <MessageTypeFilter
					{selectedMessageTypes}
					filterDisabled={isIedFiltersDisabled}
			/> -->

			<!-- TODO: {#if IEDSelections.length > 0}
					<hr class="seperation-line" />
					<ul class="ied-detail-list">
							{#each IEDSelections as IEDSelection}
									<li>
											<IEDAccordion {IEDSelection} {rootNode} />
									</li>
							{/each}
					</ul>
			{/if} -->

			{#if ConnectionSelection !== undefined}
					<hr class="seperation-line" />
					<ConnectionInformation {ConnectionSelection} />
			{/if}

			<hr class="seperation-line" />

			<h2>Focus Mode</h2>

			<label class="ied-search">
					<span class="ied-search-headline">Filter IEDs by name:</span>
					<input
							class="input"
							type="text"
							placeholder="e.g.: XAT"
							value={$filterState.nameFilter}
							oninput={handleNameFilterChange}
					/>
			</label>

			<div class="checkbox-group">
					<label>
							<input
									type="checkbox"
									bind:checked={$preferences$.isFocusModeOn}
							/>
							<span>Focus on selected IEDs</span>
					</label>
			</div>

			<h2>Preferences</h2>

			<div class="arrows-visible">
				<label>
					<input
						type="checkbox"
						bind:checked={$preferences$.showConnectionArrows}
					/>
					<span>Show arrows on connections</span>
				</label>
			</div>

		<div class="checkbox-group">
			<label>
				<input
					type="checkbox"
					bind:checked={$preferences$.playConnectionAnimation}
				/>
				<span>Play data flow animation</span>
			</label>
		</div>

		<div class="checkbox-group">
			<label>
				<input
					type="checkbox"
					bind:checked={$preferences$.groupByBay}
				/>
				<span>Group IEDs by bay</span>
			</label>
		</div>
	</div>
</div>

<style>
	hr {
			margin: 2rem 0;
	}

	.sidebar {
			height: 100%;
			width: var(--sidebar-width);
			overflow: hidden;
	}

	.sidebar .sidebar-content {
			padding: 1rem;
			background-color: var(--mdc-theme-background);
			height: calc(100% - 2rem);
			overflow: auto;
			min-width: 330px;
			color: var(--mdc-theme-on-background);
	}

	.search_filter {
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: 2rem;
	}

	.search_filter img {
			height: 1.3rem;
			width: 1.3rem;
	}

	.search_container {
			position: relative;
			width: 100%;
	}

	.search_container input {
			padding: 14px 20px 12px 15px;
			border: none;
			border-bottom: 1px solid #ddd;
			width: 100%;
			box-sizing: border-box;
	}
	
	.dropdown {
			position: absolute;
			width: 100%;
		background-color: #f6f6f6;
			border: 1px solid #ddd;
			z-index: 1;
	}

	.dropdown_label {
		color: gray;
		padding: 8px;
		font-size: 1em;
			box-sizing: border-box;
	}

	.dropdown_content {
		color: black;
			padding: 4px 16px;
			text-decoration: none;
			box-sizing: border-box;
	}
	.dropdown_content:hover {
		 background-color: #ddd;
	}

	.dropdown hr {
		border: none;
		background-color: gray;
		height: 1px;
			margin: 0.5em;
			box-sizing: border-box;
	}
	
	.actions {
			display: flex;
			flex-direction: row-reverse;
			margin-bottom: 1rem;
	}

	.actions .clear-all {
			cursor: pointer;
			border: 1px solid rgba(0, 0, 0, 0);
			border-radius: 5px;
			padding: 6px 8px;
			transition: border-color 200ms ease-in-out;
	}

	.actions .clear-all:hover {
			border-color: var(--color-text-disabled-1);
	}

	.centered {
			display: flex;
			justify-content: flex-start;
	}

	.ied-detail-list {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			flex-direction: column;
			gap: 2rem;
	}
	.ied-search {
			display: inline-grid;
	}

	.ied-search-headline {
			margin-bottom: 0.5rem;
	}
	.input {
			margin-bottom: 1rem;
	}
	.dashed-line {
			border: 0.1rem dashed var(--color-cyan-30-pc-opacity);
	}
	.seperation-line {
			border: none;
			border-top: 0.1rem solid var(--color-accent);
	}
</style>