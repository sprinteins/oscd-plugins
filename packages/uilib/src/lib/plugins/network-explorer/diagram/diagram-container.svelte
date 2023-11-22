<script lang="ts">
/**
 * The responsibility of `diagram-container` is to:
 * 1. gather bays, and the network information if IEDs
 * 2. calculate the layout of the diagram
 * 3. render the diagram by converting ELKjs nodes to svelte-flow nodes
 * 
 * > See [network-explorer.tldr](../network-explorer.tldr) for 
 * > a graphical representation
*/
import type { IEDNetworkInfoV3 } from "@oscd-plugins/core";
import type { Node } from "@xyflow/svelte";
import type { DiagramStore, SelectedNode } from "../store";
import Diagram from "./diagram.svelte";
import { generateElkJSLayout, type Config } from "./elkjs-layout-generator";
import { convertElKJSRootNodeToSvelteFlowObjects } from "./elkjs-svelteflow-converter";
import { extractIEDNetworkInfoV2, findAllIEDBays } from "./ied-network-info";
import { useNodes } from '@xyflow/svelte';

// 
// INPUT
// 
export let controller: DiagramStore
export let root: Element
$: updateNodesAndEdges(root)

// 
// CONFIG
// 
const config: Config = {
	width: 	200,
	height: 30,

	spacingBase:         10,
	spacingBetweenLaysers: 100,
}

// 
// INTERNAL
// 
let iedNetworkInfos: IEDNetworkInfoV3[]
const nodes$ = useNodes();
$: updateSelectedNode($nodes$)

function updateSelectedNode(nodes: Node[]){
	const selectedNodes = nodes.filter(n => n.selected)
	const isSelectionReset = selectedNodes.length === 0
	if(isSelectionReset){
		controller.selectedNodes.set([])	
		return
	}
	// TODO: clean up this mess
	const selectedIEDNetworkInfos = selectedNodes
		.map(node => iedNetworkInfos.find(ni => ni.iedName === node.data.label))
		.filter(Boolean)
		.map(node => {
			const connectedIEDs = node?.networkInfo.cables
				.map(cable => {
					const connectedNodes = iedNetworkInfos.filter(ni => ni.networkInfo.cables.includes(cable))
					return connectedNodes?.map(n=> n.iedName)
				}) 
				.flat()
				.filter(iedName => iedName !== node.iedName) // filter out the node itself
				.filter(Boolean)
				?? []


			return {
				...node, // we filter out undefined values
				connectedIEDs
			} satisfies SelectedNode
		})

	controller.selectedNodes.set( selectedIEDNetworkInfos )
}

async function updateNodesAndEdges(
	root: Element
) {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return []
	}
	
	iedNetworkInfos = extractIEDNetworkInfoV2(root)
	const iedBayMap = findAllIEDBays(root)
	const rootNode = await generateElkJSLayout(iedNetworkInfos, iedBayMap, config)

	const resp = convertElKJSRootNodeToSvelteFlowObjects(rootNode)
	controller.nodes.set(resp.nodes)
	controller.edges.set(resp.edges)
}


</script>

<div class="root">
	{#if controller}
		<Diagram 
			nodes={controller.nodes}
			edges={controller.edges}
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
