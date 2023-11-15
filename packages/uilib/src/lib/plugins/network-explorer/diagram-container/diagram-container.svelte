<script lang="ts">
import { extractIEDInfosWithBay, extractIEDNetworkInfoV2 } from "../layout/get-ieds"
import { calculateLayout, calculateLayoutV2, type Config } from "../layout/node-layout"
import Diagram from "./diagram.svelte"
import { Position, type Edge, type Node } from "@xyflow/svelte"
import type { RootNode } from "../../../components/diagram"


// 
// INPUT
// 
export let root: Element

// 
// CONFIG
// 
const config: Config = {
	width: 	200,
	height: 100,

	spacingBase:         100,
	spacingBetweenNodes: 100,
}

let rootNode: RootNode | undefined = undefined
$: initInfos(root)

let nodes: Node[] = []
let edges: Edge[] = []

async function initInfos(
	root: Element
) {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return []
	}
		
	const iedInfos = extractIEDInfosWithBay(root)
	rootNode = await calculateLayout(iedInfos)
	const iedNetworkInfo = extractIEDNetworkInfoV2(root)
	rootNode = await calculateLayoutV2(iedNetworkInfo, config)


	nodes = rootNode?.children.map(child => {
		return {
			...child,
			position: {
				x: child.x!,
				y: child.y!,
			},
			data: {
				label: child.label,
			},
			targetPosition: Position.Right,
			sourcePosition: Position.Left,
			// targetPosition: Position.Top,
			// sourcePosition: Position.Bottom,
		}
	})

	edges = rootNode?.edges?.map(edge => {
		return {
			id:     edge.id,
			source: edge.sources[0],
			target: edge.targets[0],
			type:   "smoothstep",
			// type: "straight",
		}
	}) ?? []

	console.log({level: "dev", iedInfos, iedNetworkInfo, rootNode, nodes})
}



</script>


<div class="root">
	{#if rootNode}
		{#key nodes}
		<Diagram 
			{nodes} 
			{edges} 
		/>	
		{/key}
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
