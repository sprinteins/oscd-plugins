<script lang="ts">
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
	import FloatingEdge from "./floating-edge.svelte"

import { writable } from "svelte/store"

	const edgeTypes = {
		floating: FloatingEdge
	}

	const defaultEdgeOptions = {
		style: "stroke-width: 2; stroke: black;",
		type:  "floating",
		// markerEnd: {
		// 	type: MarkerType.ArrowClosed,
		// 		color: 'black'
		// }
	}

	export let nodes: Node[] = []
	export let edges: Edge[] = []
	
	const nodes$ = writable<Node[]>(nodes)
	const edges$ = writable<Edge[]>(edges)

	// const connectionLineStyle = "stroke: black; stroke-width: 3;"
	const bgColor = writable('#1A192B');


</script>

<network-diagram>
	<SvelteFlow 
		nodes={nodes$} 
		edges={edges$} 
		fitView 
		minZoom={0.1} 
		maxZoom={2.5}
		{defaultEdgeOptions}
		style="background: {$bgColor}"
	>
		<!-- connectionLineType={ConnectionLineType.Straight} -->
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap />
	</SvelteFlow>
</network-diagram>

<style>
	network-diagram {
		display: block;
		/* height: 100vh; */
	}
	
	:global(.svelte-flow .svelte-flow__node.parent) {
		background-color: rgba(220, 220, 255, 0.4);
	}
	</style>