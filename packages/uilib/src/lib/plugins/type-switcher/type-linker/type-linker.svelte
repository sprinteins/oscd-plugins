<script lang="ts">
	import { Button } from "../../../components/button"
	import type {
		EventDetailRelink,
		EventDetailTypeLinkerSelect,
	} from "./events"
	import { Select } from "../../../components/select"
	import { Checkbox } from "../../../components/checkbox"
	import { createEventDispatcher } from "svelte/internal"

	// Import
	export let items: { label: string }[] = []
	export let testid = "type-linker"

	// Internal
	const dispatch = createEventDispatcher()
	let selectedLinkTargetIndex = -1
	let isSelected = false

	$: isTargetSelected = selectedLinkTargetIndex > -1
	$: isSomeDuplicateSelected = selected.length > 0
	$: isMergePossible = isSomeDuplicateSelected && isTargetSelected
	let checkedIndexes: Set<number> = new Set()

	function handleSelectAll(e: Event) {
		if (isSelected === false) {
			isSelected = true
			setAllCheckboxesChecked()
		} else {
			isSelected = false
			setAllCheckboxesUnChecked()
		}
		const detail: EventDetailTypeLinkerSelect = {
			indexes: selected,
		}
		dispatch("select", detail)
	}

	function setAllCheckboxesChecked() {
		items.forEach((_, index) => checkedIndexes.add(index))
		checkedIndexes = checkedIndexes
		selected = Array(items.length)
			.fill(true)
			.map((_, i) => i)
	}

	function setAllCheckboxesUnChecked() {
		items.forEach((_, index) => checkedIndexes.delete(index))
		checkedIndexes = checkedIndexes
		selected = []
	}

	function handleTargetInputChange(e: CustomEvent<{ index: number }>) {
		const index = e.detail.index
		selectedLinkTargetIndex = index
	}

	function handleRelink(e: Event): void {
		if (!isMergePossible) {
			return
		}
		const detail: EventDetailRelink = {
			sourceIndexes: selected,
			targetIndex:   selectedLinkTargetIndex,
		}
		dispatch("relink", detail)
	}

	let selected: number[] = []

	function handleSelectionChange(e: Event) {
		const node = e.target as HTMLInputElement
		const value = node.value
		const isCheckboxChecked = node.checked
		const valueAsNumber = parseInt(value, 10)

		if (isCheckboxChecked) {
			selected = [...selected, valueAsNumber]
		} else {
			selected = selected.filter((n) => n != valueAsNumber)
		}

		isSelected = Array.from(selected).length === Array.from(items).length

		const detail: EventDetailTypeLinkerSelect = {
			indexes: selected,
		}
		dispatch("select", detail)
	}
</script>

<type-linker data-testid={testid}>
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label>
		<span class="choose-link">Type to switch to:</span>
		<div class="select-menu">
			<Select
				on:select={handleTargetInputChange}
				linkTargetIndex={selectedLinkTargetIndex}
				{items}
			>
				<option value={-1} disabled selected />
				{#each items as item, index}
					<option value={index}>{item.label}</option>
				{/each}
			</Select>
		</div>
	</label>

	<div class="select-all-container">
		<Checkbox
			label="Select All"
			checked={isSelected}
			on:change={handleSelectAll}
		/>
	</div>

	<div class="select-container">
		{#each items as item, ii}
			<Checkbox
				label={item.label}
				value={ii}
				checked={checkedIndexes.has(ii)}
				on:change={handleSelectionChange}
			/>
		{/each}
	</div>

	<div class="action">
		<Button
			testid="merger_button-merge"
			disabled={!isMergePossible}
			on:click={handleRelink}
		>
			Switch
		</Button>
	</div>
</type-linker>

<style lang="scss">
	type-linker {
		height: calc(100% - 1rem);
		display: grid;
		grid-template-rows: auto auto 1fr auto;
		gap: 1rem;
		overflow: hidden;
	}
	.select-all-container {
		display: flex;
		margin-left: 1rem;
		div {
			display: flex;
			align-items: center;
		}
	}
	.select-container {
		margin-left: 1rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	label {
		display: flex;
		flex-direction: column;
		overflow: visible;
	}
	type-linker :global(.type-linker__list) {
		overflow: auto;
		overflow-x: hidden;
	}

	:global(.label-type-linker) {
		margin-left: -2rem;
	}
	.choose-link {
		font-size: var(--font-size-small);
		margin-bottom: 0.25rem;
		margin-left: 1rem;
	}

	.action {
		display: flex;
		justify-content: flex-end;
		margin-right: 0.5rem;
	}
	:global(.item-typeswitcher-selected) {
		margin-bottom: -0.5rem;
	}
	.select-menu {
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}
</style>
