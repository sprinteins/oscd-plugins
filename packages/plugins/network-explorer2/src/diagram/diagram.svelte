<script lang="ts">
	/**
	 * This component is responsible to configure SvelteFlow
	*/
	import { 
		type Node, 
		type Edge,
		SvelteFlow,
		Background,
		BackgroundVariant,
		Controls,
		MiniMap,
        type Connection,
        addEdge,
	} from "@xyflow/svelte"
	import { createEventDispatcher } from "svelte"
	import "@xyflow/svelte/dist/style.css"
	import type { IEDNetworkInfoV3, Networking, PhysConnection } from "@oscd-plugins/core"
	import { getIedNameFromId } from "./ied-helper"
	import IEDNode from "./ied-node.svelte"
	import BayNode from "./bay-node.svelte"
    import type { Writable } from "svelte/store";
	import { getPhysConnectionsFromEdge } from "./edge-helper"
    import type { IED } from "./networking";

	// 
	// INPUT
	
	
	interface Props {
		// 
		nodes: Node[];
		edges: Edge[];
		// export let iedNetworkInfos: Writable<IEDNetworkInfoV3[]>
		ieds: Writable<IED[]>;
		connect: (connection: Connection) => void;
		onDelete: (networkings: Networking[]) => void;
	}

	let { nodes, edges, ieds, connect, onDelete }: Props = $props();

	// 
	// CONFIG
	// 
	const nodeTypes = {
		ied: IEDNode,
		bay: BayNode,
	}

	const defaultEdgeOptions = {
		// style: "stroke-width: 2; stroke: black;",
		// type:  "floating",
		// markerEnd: {
		// 	type: MarkerType.ArrowClosed,
		// 		color: 'black'
		// }
	}

	// 
	// INTERNAL
	// 

	function ondelete(deleteEvent: { nodes: Node[], edges: Edge[] }): void {
		const { edges } = deleteEvent
		const currentIEDs = $ieds

		const networkings: Networking[] = edges
			.map(edge => getPhysConnectionsFromEdge(edge, currentIEDs))
			.flat()

		onDelete(networkings)
	}
</script>

<network-diagram>
	<SvelteFlow 
		bind:nodes
		bind:edges
		nodesConnectable={false}
		fitView 
		minZoom={0.1} 
		maxZoom={2.5}
		colorMode="light"
		{defaultEdgeOptions}
		{nodeTypes}
		snapGrid={[20, 20]}
		on:nodeclick
		on:edgeclick
		on:paneclick
		{ ondelete }
		onbeforeconnect={ connect }
		panOnDrag={false}
	>
		<!-- connectionLineType={ConnectionLineType.Straight} -->
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<!-- <MiniMap /> -->
	</SvelteFlow>
</network-diagram>

<style>
	network-diagram {
		display: block;
		/* height: 100vh; */
	}

	:global(.svelte-flow__pane){
		cursor: unset;
	}
	
	:global(.svelte-flow .svelte-flow__node.parent) {
		/* background-color: rgba(220, 220, 255, 0.4); */
	}
	</style>