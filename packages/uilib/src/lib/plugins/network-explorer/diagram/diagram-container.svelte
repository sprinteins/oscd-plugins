<script lang="ts">
    import type { DiagramStore } from "../store";
/**
 * The responsibility of `diagram-container` is to:
 * 1. gather bays, and the network information if IEDs
 * 2. calculate the layout of the diagram
 * 3. render the diagram by converting ELKjs nodes to svelte-flow nodes
 * 
 * > See [network-explorer.tldr](../network-explorer.tldr) for 
 * > a graphical representation
*/

import Diagram from "./diagram.svelte";
import { useNodes, type Node as ElkNode } from '@xyflow/svelte';

// 
// INPUT
// 
export let store: DiagramStore
export let root: Element
$: store.updateNodesAndEdges(root)

// 
// CONFIG
// 

// 
// INTERNAL
// 
const nodes$ = useNodes();
$: store.updateSelectedNodes($nodes$)




</script>

<div class="root">
	{#if store}
		<Diagram 
			nodes={store.nodes}
			edges={store.edges}
		/>	
	{/if}
			<!-- on:nodeclick={(e) => handleNodeClick(e.detail.node)}
			on:paneclick={deselect} -->
</div>

<style>
	.root {
		/* --header-height: 128px; */
		display: grid;
		grid-template-columns: auto 0;
		height: calc(100vh - var(--header-height));
		width: 100%;
		overflow-x: hidden;
		flex-grow: 1;
	}
</style>
