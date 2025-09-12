<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icons, openSCDIcons } from '@transnet-bw/oscd-uilib';
	import type { MessageType } from '../types/diagram.js';

	export let availableMessageTypes: MessageType[] = [];
	export let selectedMessageTypes: MessageType[] = [];

	const dispatch = createEventDispatcher();

	function getIconForMessageType(type: MessageType): keyof typeof openSCDIcons {
		switch (type) {
			case 'GOOSE':
				return 'gooseIcon';
			case 'SV':
				return 'smvIcon';
			case 'MMS':
				return 'tscdMmsIcon';
			default:
				return 'info';
		}
	}

	function toggleMessageType(type: MessageType) {
		if (selectedMessageTypes.includes(type)) {
			selectedMessageTypes = selectedMessageTypes.filter(t => t !== type);
		} else {
			selectedMessageTypes = [...selectedMessageTypes, type];
		}
		dispatch('message-types-change', { types: selectedMessageTypes });
	}

	function selectAll() {
		selectedMessageTypes = [...availableMessageTypes];
		dispatch('message-types-change', { types: selectedMessageTypes });
	}

	function clearAll() {
		selectedMessageTypes = [];
		dispatch('message-types-change', { types: selectedMessageTypes });
	}
</script>

<div class="message-type-filter">
	<div class="filter-controls">
		<button class="filter-btn" on:click={selectAll} disabled={selectedMessageTypes.length === availableMessageTypes.length}>
			Select All
		</button>
		<button class="filter-btn" on:click={clearAll} disabled={selectedMessageTypes.length === 0}>
			Clear All
		</button>
	</div>
	
	<div class="message-types">
		{#each availableMessageTypes as type}
			<label class="message-type-option">
				<input
					type="checkbox"
					checked={selectedMessageTypes.includes(type)}
					on:change={() => toggleMessageType(type)}
				/>
				<span class="option-content">
					<Icons icon={getIconForMessageType(type)} />
					<span class="type-name">{type}</span>
				</span>
			</label>
		{/each}
	</div>
</div>

<style>
	.message-type-filter {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filter-controls {
		display: flex;
		gap: 0.5rem;
	}

	.filter-btn {
		background: var(--oscd-base-03);
		border: 1px solid var(--oscd-base-02);
		color: var(--oscd-base-01);
		padding: 0.3rem 0.6rem;
		border-radius: 3px;
		cursor: pointer;
		font-size: 0.75rem;
		transition: all 0.2s ease;
	}

	.filter-btn:hover:not(:disabled) {
		background: var(--oscd-base-02);
		color: var(--oscd-base-00);
	}

	.filter-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.message-types {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.message-type-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		padding: 0.3rem;
		border-radius: 3px;
		transition: background-color 0.2s ease;
	}

	.message-type-option:hover {
		background: var(--oscd-base-03);
	}

	.option-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--oscd-base-01);
	}

	.type-name {
		font-weight: 500;
	}

	/* Icon sizing */
	.message-type-option :global(svg) {
		width: 16px;
		height: 16px;
	}
</style>