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
	import { createEventDispatcher } from "svelte/internal"
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
	// 
	export let nodes: Writable<Node[]>
	export let edges: Writable<Edge[]>
	// export let iedNetworkInfos: Writable<IEDNetworkInfoV3[]>
	export let ieds: IED[]

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

	// const connectionLineStyle = "stroke: black; stroke-width: 3;"
	// const bgColor = writable('#1A192B');
	const dispatch = createEventDispatcher()

	function ondelete(deleteEvent: { nodes: Node[], edges: Edge[] }): void {
		const { edges } = deleteEvent
		const currentIEDs = ieds

		const networkings: Networking[] = edges
			.map(edge => getPhysConnectionsFromEdge(edge, currentIEDs))
			.flat()

		dispatch("delete", networkings)
	}

	function onedgecreate(connection: Connection): void {
		dispatch("connect", connection)
	}
</script>

<network-diagram>
	<SvelteFlow 
		nodes={nodes} 
		edges={edges} 
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
		onedgecreate={ onedgecreate }
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