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
	} from "@xyflow/svelte"
	import "@xyflow/svelte/dist/style.css"
	import IEDNode from "./ied-node.svelte"
	import BayNode from "./bay-node.svelte"
    import type { Writable } from "svelte/store";


	// 
	// INPUT
	// 
	export let nodes: Writable<Node[]>
	export let edges: Writable<Edge[]>

	// 
	// CONFIG
	// 
	const nodeTypes = {
		ied: IEDNode,
		bay: BayNode,
	}

	const defaultEdgeOptions = {
		style: "stroke-width: 2; stroke: black;",
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


</script>

<network-diagram>
	<SvelteFlow 
		nodes={nodes} 
		edges={edges} 
		fitView 
		minZoom={0.1} 
		maxZoom={2.5}
		{defaultEdgeOptions}
		{nodeTypes}
		snapGrid={[20, 20]}
		on:nodeclick
		on:edgeclick
		on:paneclick
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