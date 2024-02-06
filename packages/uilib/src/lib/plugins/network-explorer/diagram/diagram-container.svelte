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

// import type { IEDNetworkInfoV3, PhysConnection } from "@oscd-plugins/core";
import type { Edge, Node } from "@xyflow/svelte";
// import type { DiagramStore, SelectedNode } from "../store";
import { buildCablePortId, useNewEdges } from "../store"
// import Diagram from "./diagram.svelte";
// import { generateElkJSLayout, type Config } from "./elkjs-layout-generator";
// import { convertElKJSRootNodeToSvelteFlowObjects } from "./elkjs-svelteflow-converter";
// import { useNodes, useEdges } from '@xyflow/svelte';
import type { Delete, Replace } from "../editor-events/editor-events";
import { getIedNameFromId } from "./ied-helper"
import type { Networking } from "@oscd-plugins/core";
import { SCDQueries, UCNetworkInformation } from "@oscd-plugins/core";

// 
// INPUT
// 
export let doc: Element
export let store: DiagramStore
$: store.updateNodesAndEdges(doc)

// 
// CONFIG
// 

// 
// INTERNAL
// 
let root: HTMLElement
// let iedNetworkInfos: IEDNetworkInfoV3[]
const nodes$ = useNodes();
$: store.updateSelectedNodes($nodes$)


const newEdges$ = useNewEdges()
$: onNewEdges($newEdges$)

function onNewEdges(edges: Edge[]): void {
	if (!edges) {
		return
	}

	const edge = edges[0]
	const sourceIedName = getIedNameFromId(edge.source)
	const targetIedName = getIedNameFromId(edge.target)
	const ieds = store.ieds
	const targetAndSource = ieds.filter(ied => ied.name === sourceIedName || ied.name === targetIedName)
	const sourceIed = targetAndSource.find(ied => ied.name === sourceIedName)
	const targetIed = targetAndSource.find(ied => ied.name === targetIedName)

	if (!sourceIed) {
		throw new Error(`Ied ${sourceIedName} not found`)
	}

	if (!targetIed) {
		throw new Error(`Ied ${targetIedName} not found`)
	}

	store.newConnectionBetweenNodes.set({
		source: sourceIed,
		target: targetIed
	})
}

// function updateSelectedNode(nodes: Node[]){
// 	const selectedNodes = nodes.filter(n => n.selected)

// 	const isSelectionReset = selectedNodes.length === 0
// 	if(isSelectionReset){
// 		controller.selectedNodes.set([])	
// 		return
// 	}

// 	const selectedIEDNetworkInfos = selectedNodes
// 		.map(node => iedNetworkInfos.find(ni => ni.iedName === node.data.label))
// 		.filter(Boolean)

// 	controller.selectedNodes.set( selectedIEDNetworkInfos )
// }

// async function updateNodesAndEdges(
// 	root: Element
// ) {
// 	if (!root) {
// 		console.info({ level: "info", msg: "initInfos: no root" })
// 		return []
// 	}

// 	iedNetworkInfos = extractIEDNetworkInfoV2(root)
// 	console.log(iedNetworkInfos)
// 	controller.iedNetworkInfos.set(iedNetworkInfos)
// 	const iedBayMap = findAllIEDBays(root)
// 	const rootNode = await generateElkJSLayout(iedNetworkInfos, iedBayMap, config)

// 	const resp = convertElKJSRootNodeToSvelteFlowObjects(rootNode)
// 	controller.nodes.set(resp.nodes)
// 	controller.edges.set(resp.edges)
// }
</script>

<div class="root" bind:this={root}>
	{#if store}
		<Diagram 
			nodes={store.nodes}
			edges={store.edges}
			ieds={store.ieds}
			on:delete
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
