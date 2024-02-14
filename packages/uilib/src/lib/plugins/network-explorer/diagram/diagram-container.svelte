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

import { get } from "svelte/store"
import Diagram from "./diagram.svelte";
import { useNodes, type Node as ElkNode } from '@xyflow/svelte';

// import type { IEDNetworkInfoV3, PhysConnection } from "@oscd-plugins/core";
import type { Connection, Edge } from "@xyflow/svelte";
// import type { DiagramStore, SelectedNode } from "../store";
// import Diagram from "./diagram.svelte";
// import { generateElkJSLayout, type Config } from "./elkjs-layout-generator";
// import { convertElKJSRootNodeToSvelteFlowObjects } from "./elkjs-svelteflow-converter";
// import { useNodes, useEdges } from '@xyflow/svelte';
import { getIedNameFromId } from "./ied-helper"
import { extractCableNameFromId } from "./edge-helper"
import type { IED } from "./networking";

// 
// INPUT
// 
export let doc: Element
export let editCount: number
export let store: DiagramStore
// $: store.updateNodesAndEdges(doc)
$: updateOnEditCount(editCount)
$: updateOnDoc(doc)

// 
// CONFIG
// 

// 
// INTERNAL
// 
let root: HTMLElement
let _editCount: number
let _doc: Element
// let iedNetworkInfos: IEDNetworkInfoV3[]
const nodes$ = useNodes();
$: store.updateSelectedNodes($nodes$)

function updateOnDoc(doc: Element): void {
	if (doc === _doc) {
		return
	}

	_doc = doc
	store.updateNodesAndEdges(doc)
}

function updateOnEditCount(editCount: number): void {
	if (editCount < 0 || editCount === _editCount) {
		return
	}

	_editCount = editCount
	// TODO: We need to wait until the doc has been updated. Is there a better way than timeout?
	setTimeout(() => store.updateNodesAndEdges(doc), 0)
}

function onconnect(event: CustomEvent<Connection>): void {
	const { source, target } = event.detail
	const { sourceIed, targetIed } = getSourceAndTargetIed(source, target)

	store.connectionBetweenNodes.set({
		isNew: true,
		source: sourceIed,
		target: targetIed
	})
}

function onedgeclick(event: CustomEvent<{ edge: Edge }>): void {
	const { edge } = event.detail
	const { source, target } = edge

	const cableName = extractCableNameFromId(edge.id)
	const { sourceIed, targetIed } = getSourceAndTargetIed(source, target)

	store.connectionBetweenNodes.set({
		isNew: false,
		cableName,
		source: sourceIed,
		target: targetIed
	})
}

function getSourceAndTargetIed(source: string, target: string): { sourceIed: IED, targetIed: IED } {
	const sourceIedName = getIedNameFromId(source)
	const targetIedName = getIedNameFromId(target)
	const ieds = get(store.ieds)
	const targetAndSource = ieds.filter(ied => ied.name === sourceIedName || ied.name === targetIedName)
	const sourceIed = targetAndSource.find(ied => ied.name === sourceIedName)
	const targetIed = targetAndSource.find(ied => ied.name === targetIedName)

	if (!sourceIed) {
		throw new Error(`Ied ${sourceIedName} not found`)
	}

	if (!targetIed) {
		throw new Error(`Ied ${targetIedName} not found`)
	}

	return { sourceIed: sourceIed, targetIed: targetIed }
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
			on:connect={onconnect}
			on:edgeclick={onedgeclick}
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
