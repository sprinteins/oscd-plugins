<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icons, openSCDIcons } from '@oscd-plugins/uilib';
	import type { DiagramType, MessageType, IedConnection } from '../types/diagram.js';
	import MessageTypeFilter from './MessageTypeFilter.svelte';

	export let connections: IedConnection[] = [];
	export let selectedConnection: IedConnection | null = null;
	export let availableMessageTypes: MessageType[] = [];
	export let selectedMessageTypes: MessageType[] = [];
	export let selectedDiagramType: DiagramType | null = null;

	const dispatch = createEventDispatcher();

	function getMessageTypeIcon(type: MessageType): string {
		switch (type) {
			case 'GOOSE':
				return openSCDIcons.gooseIcon;
			case 'SV':
				return openSCDIcons.smvIcon;
			case 'MMS':
				return openSCDIcons.reportIcon;
			default:
				return openSCDIcons.gooseIcon;
		}
	}

	function selectConnection(connection: IedConnection) {
		selectedConnection = connection;
		dispatch('connectionSelected', connection);
	}

	function clearSelection() {
		selectedConnection = null;
		dispatch('selectionCleared');
	}
</script>

<div class="sidebar">
	<div class="filters">
		<h3>Message Type Filters</h3>
		<MessageTypeFilter 
			{availableMessageTypes}
			{selectedMessageTypes}
			on:messageTypeToggled
		/>
		
		<h3>Connections</h3>
		<div class="connections-list">
			{#each connections as connection}
				<button 
					class="connection-item"
					class:selected={selectedConnection === connection}
					on:click={() => selectConnection(connection)}
				>
					<Icons name={getMessageTypeIcon(connection.messageType)} size="normal" />
					<span>{connection.name}</span>
				</button>
			{/each}
		</div>
		
		{#if selectedConnection}
			<div class="selected-connection">
				<h4>Selected: {selectedConnection.name}</h4>
				<button class="clear-all" on:click={clearSelection} aria-label="Clear selection">
					Clear Selection
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.sidebar {
		width: 300px;
		padding: 1rem;
		background: #f5f5f5;
		border-right: 1px solid #ddd;
		height: 100%;
		overflow-y: auto;
	}

	.filters h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #333;
	}

	.connections-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.connection-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #ddd;
		background: white;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.connection-item:hover {
		background: #f0f0f0;
	}

	.connection-item.selected {
		background: #e3f2fd;
		border-color: #2196f3;
	}

	.selected-connection {
		padding: 1rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.selected-connection h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
	}

	.clear-all {
		padding: 0.5rem 1rem;
		background: #f44336;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
	}

	.clear-all:hover {
		background: #d32f2f;
	}
</style>