<script lang="ts">
import { derived } from 'svelte/store'
import type {
	CreateCableEvent,
	UpdateCableEvent
} from '../editor-events/network-events'
import type { DiagramStore } from '../store'
import { IEDAccordion } from './ied-accordion'
import NewConnection from './new-connection/new-connection.svelte'
import { ScdAssumptions } from './scd-assumptions'
import { SidebarMode } from './types'

//
// INPUT

interface Props {
	store: DiagramStore
	createCable: (event: CreateCableEvent) => void
	updateCable: (event: UpdateCableEvent) => void
}

let { store, createCable, updateCable }: Props = $props()

//
// INTERNAL
//
let selectedNodes$ = store.selectedNodes
let connectionBetweenNodes$ = store.connectionBetweenNodes
const sidebarMode$ = derived(
	[selectedNodes$, connectionBetweenNodes$],
	([$selectedNodes$, $connectionBetweenNodes$]) => {
		if ($connectionBetweenNodes$) {
			return SidebarMode.ConnectionBetweenNodes
		}
		if ($selectedNodes$.length > 0) {
			return SidebarMode.SelectedNodes
		}
		return SidebarMode.ScdAssumptions
	}
)
const cableNames$ = derived(store.ieds, ($ieds) =>
	$ieds.flatMap((ied) => ied.networking.map((networking) => networking.cable))
)

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
			{#if $connectionBetweenNodes$}
				<NewConnection
					connectionBetweenNodes={$connectionBetweenNodes$}
					cableNames={$cableNames$}
					{createCable}
					{updateCable}
					cancel={onCancelConnection}
				/>
			{/if}
		{:else}
			<ScdAssumptions />
		{/if}
	</div>
</div>

<style>
	.sidebar {
		flex: 0 0 var(--sidebar-width);
		width: var(--sidebar-width);
		min-width: 0;
		height: 100%;
		overflow: hidden;
		border-left: 1px solid hsl(var(--border));
	}

	.sidebar-content {
		box-sizing: border-box;
		padding: 1rem;
		height: 100%;
		overflow-y: auto;
		background-color: #fcf6e5;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
