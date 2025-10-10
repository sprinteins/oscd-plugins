<script lang="ts">
	import Select, { Option } from "@smui/select";

	interface Props {
		handleSelect: (index: number) => void;
		items?: { label: string }[];
		linkTargetIndex: number;
	}

	let {
		handleSelect,
		items = [],
		linkTargetIndex = $bindable(),
	}: Props = $props();

	let isFocused = $state(false);
	function handleFocus() {
		isFocused = !isFocused;
	}
	$effect(() => {
		handleSelect(linkTargetIndex);
	});
</script>

<div>
	<div class="select" class:isFocused>
		<Select bind:value={linkTargetIndex} onclick={handleFocus}>
			{#each items as item, index (`${index}_${item.label}`)}
				<Option value={index}>
					<span class="select-option">
						{item.label}
					</span>
				</Option>
			{/each}
		</Select>
	</div>
</div>

<style lang="scss">
	.select-option {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	:global(.select) {
		height: 3rem;
		border-color: var(--color-border);
		border: 0.5px solid;
		cursor: pointer;
		border-radius: 0.5rem;
		background-color: var(--color-select-dropdown-transparent);
		display: grid;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	:global(.select:hover) {
		border-color: var(--mdc-theme-primary);
		border-style: dashed;
		background-color: var(--color-select-dropdown);
	}

	:global(.smui-select--standard .mdc-select__anchor) {
		border-bottom-style: none;
		height: 3rem;
	}
	:global(.mdc-line-ripple::before) {
		border-bottom-style: none;
	}
	:global(.mdc-line-ripple::after) {
		border-bottom-style: none;
	}
	:global(.smui-select--standard .mdc-select__dropdown-icon) {
		margin-bottom: 1.5rem;
		margin-top: 1.5rem;
	}

	:global(.mdc-menu-surface--fullwidth) {
		background-color: var(--color-select-dropdown);
	}
	:global(.mdc-select__selected-text) {
		margin-left: 1rem;
	}
	.select.isFocused {
		border-color: var(--color-accent);
	}
</style>
