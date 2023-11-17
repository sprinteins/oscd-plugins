<script lang="ts">
import { extractIEDInfosWithBay, extractIEDNetworkInfoV2, findAllIEDBays } from "../layout/get-ieds"
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
	height: 30,

	spacingBase:         10,
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
		
	// const iedInfos = extractIEDInfosWithBay(root)
	// rootNode = await calculateLayout(iedInfos)

	const iedNetworkInfo = extractIEDNetworkInfoV2(root)
	const iedBayMap = findAllIEDBays(root)
	rootNode = await calculateLayoutV2(iedNetworkInfo, iedBayMap, config)


	for(const node of rootNode.children){
		// const targetPosition = node.layoutOptions.
		const newNode = {
			...node,
			position: {
				x: node.x!,
				y: node.y!,
			},
			data: {
				label: node.label,
			},
			style: `width: ${node.width}px; height: ${node.height}px;`,
			// targetPosition: Position.Right,
			// sourcePosition: Position.Left,
			targetPosition: Position.Top,
			sourcePosition: Position.Bottom,
		}
		nodes.push(newNode)

		const hasChildren = node.children?.length ?? 0 > 0
		if(hasChildren){
			for(const subNode of node.children){
				nodes.push({
					...subNode,
					parentNode: newNode.id,
					position: {
						x: subNode.x!,
						y: subNode.y!,
					},
					data: {
						label: subNode.label ?? "",
					},
					style: `width: ${subNode.width}px; height: ${subNode.height}px;`,
					targetPosition: Position.Right,
					sourcePosition: Position.Left,
					// targetPosition: Position.Top,
					// sourcePosition: Position.Bottom,
				})
			}
		}
			
	}


	edges = rootNode?.edges?.map(edge => {
		return {
			id:     edge.id,
			source: edge.sources[0],
			target: edge.targets[0],
			// type:   "smoothstep",
			// type: "step",
			// type: "straight",
			type: "bezier",
			// animated: true,
			style: 'stroke: #fff;',
		}
	}) ?? []

	console.log({level: "dev", iedBayMap, iedNetworkInfo, rootNode, nodes})
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
