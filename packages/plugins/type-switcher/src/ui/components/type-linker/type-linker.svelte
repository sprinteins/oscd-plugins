<script lang="ts">
import { Button, Checkbox, Label } from '@oscd-plugins/core-ui-svelte'
import type { EventDetailRelink, EventDetailTypeLinkerSelect } from './events'

interface Props {
	// Import
	handleSelect: (detail: EventDetailTypeLinkerSelect) => void
	handleRelink: (detail: EventDetailRelink) => void
	items?: { label: string }[]
	testid?: string
}

let {
	handleSelect: select,
	handleRelink: relink,
	items = [],
	testid = 'type-linker'
}: Props = $props()

let selectedLinkTargetIndex = $state<number | undefined>()
let selected: number[] = $state([])

function notifySelection() {
	const detail: EventDetailTypeLinkerSelect = {
		indexes: selected
	}
	select(detail)
}

function handleTargetChange(event: Event) {
	const value = (event.currentTarget as HTMLSelectElement).value
	selectedLinkTargetIndex = Number(value)
}

function handleSelectAll(checked: boolean) {
	selected = checked ? items.map((_, index) => index) : []
	notifySelection()
}

function handleRelink(): void {
	if (!isMergePossible || selectedLinkTargetIndex === undefined) return
	const detail: EventDetailRelink = {
		sourceIndexes: selected,
		targetIndex: selectedLinkTargetIndex
	}
	relink(detail)
}

function handleSelectionChange(checked: boolean, index: number) {
	if (checked) {
		selected = [...selected, index]
	} else {
		selected = selected.filter((selectedIndex) => selectedIndex !== index)
	}

	notifySelection()
}

let isAllSelected = $derived(
	items.length > 0 && selected.length === items.length
)
let isPartiallySelected = $derived(
	selected.length > 0 && selected.length < items.length
)
let isTargetSelected = $derived(selectedLinkTargetIndex !== undefined)
let isSomeDuplicateSelected = $derived(selected.length > 0)
let isMergePossible = $derived(isSomeDuplicateSelected && isTargetSelected)
</script>

<div class="type-linker" data-testid={testid}>
	<div class="target-control">
		<Label.Root for="type-link-target" class="mb-1 ml-2">
			Type to switch to:
		</Label.Root>
		<div class="mx-2">
			<select
				id="type-link-target"
				aria-describedby="type-link-target-placeholder"
				class="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				onchange={handleTargetChange}
			>
				<option value="" selected disabled id="type-link-target-placeholder">
					Select a type
				</option>
				{#each items as item, index}
					<option value={index}>{item.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="source-control">
		<div class="ml-2 flex items-center gap-2">
			<Checkbox.Root
				id="select-all-types"
				checked={isAllSelected}
				indeterminate={isPartiallySelected}
				disabled={items.length === 0}
				onCheckedChange={(checked) => handleSelectAll(checked === true)}
			/>
			<Label.Root for="select-all-types">Select All</Label.Root>
		</div>

		<div class="select-container">
			{#each items as item, index}
				<div class="flex items-center gap-2 py-1">
					<Checkbox.Root
						id={`source-type-${index}`}
						aria-label={item.label}
						checked={selected.includes(index)}
						onCheckedChange={(checked) =>
							handleSelectionChange(checked === true, index)}
					/>
					<Label.Root for={`source-type-${index}`}>{item.label}</Label.Root>
				</div>
			{/each}
		</div>
	</div>

	<div class="action">
		<Button.Root
			data-testid="merger_button-merge"
			disabled={!isMergePossible}
			onclick={handleRelink}
		>
			Switch
		</Button.Root>
	</div>
</div>

<style>
	.type-linker {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 1rem;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		padding: 0.25rem 0;
	}
	.source-control {
		min-height: 0;
		overflow: auto;
	}
	.select-container {
		margin-left: 0.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.action {
		display: flex;
		justify-content: flex-end;
		margin: 0 0.5rem 0.5rem;
		line-height: 1.15;
	}
</style>
