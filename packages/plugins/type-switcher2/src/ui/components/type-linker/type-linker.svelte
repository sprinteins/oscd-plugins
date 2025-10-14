<script lang="ts">
	import { Button } from "@oscd-plugins/ui";
	import type {
		EventDetailRelink,
		EventDetailTypeLinkerSelect,
	} from "./events";
	import { Select } from "@oscd-plugins/ui";
	import { Checkbox } from "../checkbox";
	import { SvelteSet } from "svelte/reactivity";

	interface Props {
		// Import
		handleSelect: (detail: EventDetailTypeLinkerSelect) => void;
		handleRelink: (detail: EventDetailRelink) => void;
		items?: { label: string }[];
		testid?: string;
	}

	let {
		handleSelect: select,
		handleRelink: relink,
		items = [],
		testid = "type-linker",
	}: Props = $props();

	// Internal
	let selectedLinkTargetIndex = $state(-1);
	let isSelected = $state(false);

	let checkedIndexes: SvelteSet<number> = new SvelteSet();

	function handleSelectAll(e: Event) {
		if (isSelected === false) {
			isSelected = true;
			setAllCheckboxesChecked();
		} else {
			isSelected = false;
			setAllCheckboxesUnChecked();
		}
		const detail: EventDetailTypeLinkerSelect = {
			indexes: selected,
		};
		select(detail);
	}

	function setAllCheckboxesChecked() {
		items.forEach((_, index) => checkedIndexes.add(index));
		selected = Array(items.length)
			.fill(true)
			.map((_, i) => i);
	}

	function setAllCheckboxesUnChecked() {
		items.forEach((_, index) => checkedIndexes.delete(index));
		selected = [];
	}

	function handleTargetInputChange(index: number) {
		selectedLinkTargetIndex = index;
	}

	function handleRelink(e: Event): void {
		if (!isMergePossible) {
			return;
		}
		const detail: EventDetailRelink = {
			sourceIndexes: selected,
			targetIndex: selectedLinkTargetIndex,
		};
		relink(detail);
	}

	let selected: number[] = $state([]);

	function handleSelectionChange(e: Event, ii: number) {
		const node = e.target as HTMLInputElement;
		const valueAsNumber = ii;
		const isCheckboxChecked = node.checked;

		if (isCheckboxChecked) {
			selected = [...selected, valueAsNumber];
		} else {
			selected = selected.filter((n) => n !== valueAsNumber);
		}

		isSelected = Array.from(selected).length === Array.from(items).length;

		const detail: EventDetailTypeLinkerSelect = {
			indexes: selected,
		};
		select(detail);
	}
	let isTargetSelected = $derived(selectedLinkTargetIndex > -1);
	let isSomeDuplicateSelected = $derived(selected.length > 0);
	let isMergePossible = $derived(isSomeDuplicateSelected && isTargetSelected);
</script>

<div class="type-linker" data-testid={testid}>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<!-- TODO - Error with passing children -->
	<label>
		<span class="choose-link">Type to switch to:</span>
		<div class="select-menu">
			<Select
				handleSelect={handleTargetInputChange}
				linkTargetIndex={selectedLinkTargetIndex}
				{items}
			>
				<option value={-1} disabled selected></option>
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
			handleChange={handleSelectAll}
		/>
	</div>

	<div class="select-container">
		{#each items as item, ii}
			<Checkbox
				label={item.label}
				checked={checkedIndexes.has(ii)}
				handleChange={(e) => handleSelectionChange(e, ii)}
			/>
		{/each}
	</div>

	<div class="action">
		<Button
			testid="merger_button-merge"
			disabled={!isMergePossible}
			handleClick={handleRelink}
		>
			Switch
		</Button>
	</div>
</div>

<style lang="scss">
	.type-linker {
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
	.type-linker :global(.type-linker__list) {
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
		line-height: 1.15;
		letter-spacing: 0.2;
	}
	:global(.item-typeswitcher-selected) {
		margin-bottom: -0.5rem;
	}
	.select-menu {
		margin-right: 0.5rem;
		margin-left: 0.5rem;
	}
</style>
