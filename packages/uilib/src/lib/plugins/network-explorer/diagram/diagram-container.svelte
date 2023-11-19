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
import { extractIEDNetworkInfoV2, findAllIEDBays } from "./ied-network-info"
import { generateElkJSLayout, type Config } from "./elkjs-layout-generator"
import Diagram from "./diagram.svelte"
import type { Edge, Node } from "@xyflow/svelte"
import { convertElKJSRootNodeToSvelteFlowObjects } from "./elkjs-svelteflow-converter"
import type { DiagramController } from "../controller";
    import type { IEDNetworkInfoV3 } from "@oscd-plugins/core";

// 
// INPUT
// 
export let controller: DiagramController
export let root: Element
$: updateNodesAndEdges(root)

// 
// CONFIG
// 
const config: Config = {
	width: 	200,
	height: 30,

	spacingBase:         10,
	spacingBetweenNodes: 100,
}

// 
// INTERNAL
// 
let iedNetworkInfos: IEDNetworkInfoV3[]

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


function handleNodeClick(node: Node){
	const iedNetworkInfo = iedNetworkInfos.find(ni => ni.iedName === node.data.label)
	controller.selectedNode.set(iedNetworkInfo)
}

</script>

<div class="root">
	{#if controller}
		<Diagram 
			nodes={controller.nodes}
			edges={controller.edges}
			on:nodeclick={(e) => handleNodeClick(e.detail.node)}
		/>	
	{/if}
</div>

<style>
	.root {
		--header-height: 128px;
		display: grid;
		grid-template-columns: auto 0;
		height: calc(100vh - var(--header-height));
		width: 100%;
		overflow-x: hidden;
	}
	
	.root.showSidebar {
		grid-template-columns: auto var(--sidebar-width);
	}
</style>
