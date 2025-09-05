<script lang="ts">
	import type { Node } from "@xyflow/svelte";
	import type { DiagramStore, ConnectionBetweenNodes } from "../store"
	import { IEDAccordion } from "./ied-accordion";
	import { ScdAssumptions } from "./scd-assumptions"
	import { writable, derived } from "svelte/store";
	import NewConnection from "./new-connection/new-connection.svelte";
	
	enum SidebarMode {
		SelectedNodes,
		ConnectionBetweenNodes,
		ScdAssumptions
	}
	
	// 
	// INPUT
	
	interface Props {
		// 
		store: DiagramStore;
	}

	let { store }: Props = $props();
	
	//
	// INTERNAL
	//
	let selectedNodes$ = store.selectedNodes
	let connectionBetweenNodes$ = store.connectionBetweenNodes
	const sidebarMode$ = derived([selectedNodes$, connectionBetweenNodes$], ([$selectedNodes$, $connectionBetweenNodes$]) => {
		if ($connectionBetweenNodes$) {
			return SidebarMode.ConnectionBetweenNodes
		} else if ($selectedNodes$.length > 0) {
			return SidebarMode.SelectedNodes
		} else {
			return SidebarMode.ScdAssumptions
		}
	})
	const cableNames$ = derived(store.ieds, $ieds$ => $ieds$.map(ied => ied.networking.map(n => n.cable)).flat())
	
	function onCancelConnection(): void {
		store.resetNewConnection()
	}
</script>

<div class="sidebar sidebar-right">
	<div class="sidebar-content">
		{#if $sidebarMode$ === SidebarMode.SelectedNodes}
		{#each $selectedNodes$ as node }
		<IEDAccordion
		selectedIED={node}
		/>
		{/each}
		{:else if $sidebarMode$ === SidebarMode.ConnectionBetweenNodes}
		<NewConnection
		connectionBetweenNodes={$connectionBetweenNodes$}
		cableNames={$cableNames$}
		on:createCable
		on:updateCable
		on:cancel={onCancelConnection}
		/>
		{:else}
		<ScdAssumptions />
		{/if}
	</div>
</div>

<style>
	hr {
		margin: 2rem 0;
	}
	
	.sidebar {
		width: var(--sidebar-width);
		overflow: auto;
		max-height: 100%;
	}
	
	.sidebar .sidebar-content {
		padding: 1rem;
		background-color: #fcf6e5;
		height: 100%;
		overflow: auto;
		
		display: flex;
		flex-direction: column;
		gap:2rem;
	}
	
</style>
