<script lang="ts">
import { Button, Checkbox, Input, Label } from '@oscd-plugins/core-ui-svelte'
import {
	filterSidebarSearchOptions,
	findSidebarIEDsByBay,
	isConnectionDirectionDisabled,
	resolveSidebarSearchOption
} from '../../../headless/services/sidebar-filtering'
import type { Preferences } from '../../../stores/_store-preferences'
import { preferences$ } from '../../../stores/_store-preferences/preferences-store'
import {
	clearIEDSelection,
	clearSelection,
	filterState,
	selectIEDElkNode,
	setNameFilter,
	toggleMultiSelectionOfIED
} from '../../../stores/_store-view-filter'
import type { RootNode } from '../diagram'
import ConnectionSelector from './assets/connection-selector.svg'
import ConnectionInformation from './connection-information/connection-information.svelte'
import { ConnectionTypeFilter } from './connection-type-filter'
import IEDAccordion from './ied-accordion/ied-accordion.svelte'
import { MessageTypeFilter } from './message-type-filter'

interface Props {
	rootNode: RootNode
	bays: string[]
}

let { rootNode, bays }: Props = $props()
const ieds = $derived(rootNode?.children || [])

let searchQuery = $state('')
let filterTextFieldFocused = $state(false)
let activeSearchIndex = $state(-1)

function updatePreference<K extends keyof Preferences>(
	key: K,
	value: Preferences[K]
) {
	preferences$.update((preferences) => ({ ...preferences, [key]: value }))
}

function selectSearchOption(label: string) {
	searchQuery = label
	const option = resolveSidebarSearchOption(ieds, bays, label)
	if (!option) return

	clearIEDSelection()
	if (option.kind === 'bay') {
		for (const node of findSidebarIEDsByBay(
			rootNode.children,
			option.value
		)) {
			toggleMultiSelectionOfIED(node)
		}
	} else {
		selectIEDElkNode(option.value)
	}
	filterTextFieldFocused = false
	activeSearchIndex = -1
}

function clearAll() {
	searchQuery = ''
	clearSelection()
}

function handleSearchKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape') {
		filterTextFieldFocused = false
		activeSearchIndex = -1
		return
	}

	if (event.key === 'ArrowDown') {
		event.preventDefault()
		filterTextFieldFocused = true
		activeSearchIndex =
			(activeSearchIndex + 1) % Math.max(searchOptions.length, 1)
		return
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault()
		filterTextFieldFocused = true
		activeSearchIndex =
			(activeSearchIndex - 1 + searchOptions.length) %
			Math.max(searchOptions.length, 1)
		return
	}

	if (event.key === 'Enter' && activeSearchIndex >= 0) {
		event.preventDefault()
		selectSearchOption(searchOptions[activeSearchIndex].label)
	}
}

const iedSelections = $derived($filterState.selectedIEDs)
const connectionSelection = $derived($filterState.selectedConnection)
const selectedMessageTypes = $derived($filterState.selectedMessageTypes)
const isIEDFiltersDisabled = $derived(
	$filterState.selectedConnection !== undefined
)
const connectionDirectionDisabled = $derived(
	isConnectionDirectionDisabled($filterState, isIEDFiltersDisabled)
)
const filteredSearchOptions = $derived(
	filterSidebarSearchOptions(ieds, bays, searchQuery)
)
const searchOptions = $derived([
	...filteredSearchOptions.ieds.map((ied) => ({
		kind: 'IED',
		label: ied.label
	})),
	...filteredSearchOptions.bays.map((bay) => ({
		kind: 'Bay',
		label: bay
	}))
])
</script>

<aside class="sidebar h-full overflow-hidden" aria-label="Communication filters">
	<div class="sidebar-content h-full overflow-auto p-4">
		<div class="mb-4 flex flex-row-reverse">
			<Button.Root variant="ghost" size="sm" onclick={clearAll}>
				Clear all
			</Button.Root>
		</div>

		<div class="relative mb-8 flex items-center gap-4">
			<img
				class="size-[1.3rem] shrink-0"
				src={ConnectionSelector}
				alt=""
				aria-hidden="true"
			/>
			<div class="relative w-full">
				<Input.Root
					type="text"
					placeholder="Filter IED or bay"
					aria-label="Filter IED or bay"
					role="combobox"
					aria-expanded={filterTextFieldFocused}
					aria-controls="sidebar-search-options"
					aria-autocomplete="list"
					aria-activedescendant={activeSearchIndex >= 0
						? `sidebar-search-option-${activeSearchIndex}`
						: undefined}
					bind:value={searchQuery}
					onfocus={() => (filterTextFieldFocused = true)}
					onblur={() => (filterTextFieldFocused = false)}
					oninput={() => (activeSearchIndex = -1)}
					onkeydown={handleSearchKeydown}
				/>
				{#if filterTextFieldFocused && searchOptions.length > 0}
					<div
						id="sidebar-search-options"
						role="listbox"
						aria-label="IED and bay suggestions"
						class="absolute z-10 mt-1 w-full rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
					>
						{#each searchOptions as option, index}
							<button
								id={`sidebar-search-option-${index}`}
								type="button"
								role="option"
								aria-selected={activeSearchIndex === index}
								class:active={activeSearchIndex === index}
								class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none"
								onmousedown={(event) => {
									event.preventDefault()
									selectSearchOption(option.label)
								}}
							>
								<span>{option.label}</span>
								<span class="text-xs text-muted-foreground">{option.kind}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<ConnectionTypeFilter
			disabled={connectionDirectionDisabled}
			isFilterIncomingActive={$filterState.incomingMessageFilterActive}
			isFilterOutgoingActive={$filterState.outgoingMessageFilterActive}
		/>

		<hr class="my-8 border-dashed" />
		<MessageTypeFilter
			{selectedMessageTypes}
			filterDisabled={isIEDFiltersDisabled}
		/>

		{#if iedSelections.length > 0}
			<hr class="my-8" />
			<ul class="flex flex-col gap-8">
				{#each iedSelections as IEDSelection}
					<li>
						<IEDAccordion {IEDSelection} {rootNode} />
					</li>
				{/each}
			</ul>
		{/if}

		{#if connectionSelection !== undefined}
			<hr class="my-8" />
			<ConnectionInformation ConnectionSelection={connectionSelection} />
		{/if}

		<hr class="my-8" />

		<h2>Focus Mode</h2>

		<div class="mt-3 space-y-3">
			<div class="space-y-2">
				<Label.Root for="filter-ieds-by-name">Filter IEDs by name:</Label.Root>
				<Input.Root
					id="filter-ieds-by-name"
					type="text"
					placeholder="e.g.: XAT"
					value={$filterState.nameFilter}
					oninput={(event) =>
						setNameFilter((event.currentTarget as HTMLInputElement).value)}
				/>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox.Root
					id="focus-on-selected-ieds"
					checked={$preferences$.isFocusModeOn}
					onCheckedChange={(checked) =>
						updatePreference('isFocusModeOn', checked === true)}
				/>
				<Label.Root for="focus-on-selected-ieds">
					Focus on selected IEDs
				</Label.Root>
			</div>
		</div>

		<h2 class="mt-8">Preferences</h2>

		<div class="mt-3 space-y-3">
			<div class="flex items-center gap-2">
				<Checkbox.Root
					id="show-connection-arrows"
					checked={$preferences$.showConnectionArrows}
					onCheckedChange={(checked) =>
						updatePreference('showConnectionArrows', checked === true)}
				/>
				<Label.Root for="show-connection-arrows">
					Show arrows on connections
				</Label.Root>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox.Root
					id="play-data-flow-animation"
					checked={$preferences$.playConnectionAnimation}
					onCheckedChange={(checked) =>
						updatePreference('playConnectionAnimation', checked === true)}
				/>
				<Label.Root for="play-data-flow-animation">
					Play data flow animation
				</Label.Root>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox.Root
					id="group-ieds-by-bay"
					checked={$preferences$.groupByBay}
					onCheckedChange={(checked) =>
						updatePreference('groupByBay', checked === true)}
				/>
				<Label.Root for="group-ieds-by-bay">Group IEDs by bay</Label.Root>
			</div>
		</div>
	</div>
</aside>

<style>
	.sidebar {
		width: var(--sidebar-width);
		background-color: var(--color-sidebar-background);
	}

	.sidebar-content {
		min-width: 330px;
		background-color: var(--color-sidebar-background);
	}

	h2 {
		font-size: revert;
		font-weight: revert;
	}

	.active {
		background-color: var(--accent);
	}
</style>
