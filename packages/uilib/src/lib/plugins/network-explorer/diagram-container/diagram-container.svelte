<script lang="ts">
/**
 * The responsibility of `diagram-container` is to:
 * 1. gather bays, and the network information if IEDs
 * 2. calculate the layout of the diagram
 * 3. render the diagram by converting ELKjs nodes to svelte-flow nodes
 * 
*/
import { extractIEDNetworkInfoV2, findAllIEDBays } from "./ied-network-info"
import { calculateLayoutV2, type Config } from "./layout-elkjs"
import Diagram from "./diagram.svelte"
import type { Edge, Node } from "@xyflow/svelte"
import { convertElKJSRootNodeToSvelteFlowObjects } from "./elk-svelteflow-converter"

// 
// INPUT
// 
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

let nodes: Node[] = []
let edges: Edge[] = []

async function updateNodesAndEdges(
	root: Element
) {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return []
	}
	const iedNetworkInfo = extractIEDNetworkInfoV2(root)
	const iedBayMap = findAllIEDBays(root)
	const rootNode = await calculateLayoutV2(iedNetworkInfo, iedBayMap, config)

	const resp = convertElKJSRootNodeToSvelteFlowObjects(rootNode)
	nodes = resp.nodes
	edges = resp.edges
}

</script>

<div class="root">
	{#if nodes}
		<Diagram 
			{nodes} 
			{edges} 
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
