<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { MessageType, allMessageTypes } from '@oscd-plugins/core/legacy';

	export let selectedTypes: MessageType[] = [...allMessageTypes];

	const dispatch = createEventDispatcher<{
		change: { selectedTypes: MessageType[] };
	}>();

	function handleTypeToggle(type: MessageType) {
		if (selectedTypes.includes(type)) {
			selectedTypes = selectedTypes.filter(t => t !== type);
		} else {
			selectedTypes = [...selectedTypes, type];
		}
		dispatch('change', { selectedTypes });
	}

	function selectAll() {
		selectedTypes = [...allMessageTypes];
		dispatch('change', { selectedTypes });
	}

	function selectNone() {
		selectedTypes = [];
		dispatch('change', { selectedTypes });
	}
</script>

<div class="message-type-filter">
	<h3>Message Types</h3>
	
	<div class="filter-controls">
		<button on:click={selectAll} class="btn-small">Select All</button>
		<button on:click={selectNone} class="btn-small">Select None</button>
	</div>

	<div class="type-checkboxes">
		{#each allMessageTypes as type}
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={selectedTypes.includes(type)}
					on:change={() => handleTypeToggle(type)}
				/>
				<span class="checkbox-text">{type}</span>
			</label>
		{/each}
	</div>
</div>

<style>
	.message-type-filter {
		padding: 1rem;
		border: 1px solid var(--sl-color-neutral-200);
		border-radius: 0.25rem;
		background: var(--sl-color-neutral-0);
	}

	h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.filter-controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.btn-small {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border: 1px solid var(--sl-color-neutral-300);
		border-radius: 0.25rem;
		background: var(--sl-color-neutral-0);
		cursor: pointer;
	}

	.btn-small:hover {
		background: var(--sl-color-neutral-50);
	}

	.type-checkboxes {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.checkbox-text {
		font-size: 0.875rem;
	}

	input[type="checkbox"] {
		margin: 0;
	}
</style>