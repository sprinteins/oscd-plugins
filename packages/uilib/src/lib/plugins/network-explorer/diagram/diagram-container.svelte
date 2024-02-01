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
import type { IEDNetworkInfoV3, PhysConnection } from "@oscd-plugins/core";
import type { Node } from "@xyflow/svelte";
import type { DiagramStore, SelectedNode } from "../store";
import { buildCablePortId } from "../store"
import Diagram from "./diagram.svelte";
import { generateElkJSLayout, type Config } from "./elkjs-layout-generator";
import { convertElKJSRootNodeToSvelteFlowObjects } from "./elkjs-svelteflow-converter";
import { extractIEDNetworkInfoV2, findAllIEDBays, extractPhysConnectionCable } from "./ied-network-info";
import { useNodes } from '@xyflow/svelte';
import type { Delete, Replace } from "./events";

// 
// INPUT
// 
export let controller: DiagramStore
export let doc: Element
$: updateNodesAndEdges(doc)

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
let root: HTMLElement
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
		.map(networkInfo => {
			const cableToConnectedIed: { [cable: string]: string } = {}
			const connections = networkInfo?.networkInfo.connections ?? []

			for (const connection of connections) {
				const cable = connection.cable
				const connectedNodes = iedNetworkInfos.filter(
					ni => ni.iedName !== networkInfo.iedName &&
					ni.networkInfo.connections.map(c => c.cable).includes(cable)
				)

				if (connectedNodes.length > 1) {
					console.warn(`Found ${connectedNodes.length} connected nodes for cable ${cable}. Connected nodes will be ignored.`)
					continue;
				}

				if (connectedNodes.length === 1) {
					const iedName = connectedNodes[0].iedName

					const cableId = buildCablePortId(cable, connection.port)
					cableToConnectedIed[cableId] = iedName
				}
			}

			return {
				...networkInfo, // we filter out undefined values
				cableToConnectedIed
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
	controller.iedNetworkInfos.set(iedNetworkInfos)
	const iedBayMap = findAllIEDBays(root)
	const rootNode = await generateElkJSLayout(iedNetworkInfos, iedBayMap, config)

	const resp = convertElKJSRootNodeToSvelteFlowObjects(rootNode)
	controller.nodes.set(resp.nodes)
	controller.edges.set(resp.edges)
}

function handleDelete(event: CustomEvent<PhysConnection[]>): void {
	const emptyCableName = "0"

	const cableReplaces: Replace[] = event.detail.map(physConn => {
		const cableElement = extractPhysConnectionCable(physConn.node.element)

		if (cableElement === null) {
			throw new Error(`Element for cable ${physConn.cable} not found`)
		}
		
		const modifiedCable = cableElement.element.cloneNode(true) as Element
		modifiedCable.innerHTML = emptyCableName

		return {
			old: { element: cableElement.element },
			new: { element: modifiedCable },
		}
	})

	const replaceEditorAction = buildEditorActionEvent(cableReplaces)

	root.dispatchEvent(replaceEditorAction)

	console.log(replaceEditorAction)
}

function buildEditorActionEvent(replaces: Replace[]) {
	const detail = {
		action: {
			actions: replaces
		}
	}

	return new CustomEvent("editor-action", {
		detail,
		composed: true,
		bubbles:  true,
	})
}


</script>

<div class="root" bind:this={root}>
	{#if controller}
		<Diagram 
			nodes={controller.nodes}
			edges={controller.edges}
			iedNetworkInfos={controller.iedNetworkInfos}
			on:delete={handleDelete}
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
