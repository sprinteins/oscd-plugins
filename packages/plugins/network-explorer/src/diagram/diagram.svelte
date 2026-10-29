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
	type Connection
} from '@xyflow/svelte'
import { useSvelteFlow } from '@xyflow/svelte'
import xyflowStyles from '@xyflow/svelte/dist/style.css?inline'
import { injectStyles } from '@oscd-plugins/ui'
import type { Networking } from '@oscd-plugins/core'
import IEDNode from './ied-node.svelte'
import BayNode from './bay-node.svelte'
import type { Writable } from 'svelte/store'
import { getPhysConnectionsFromEdge } from './edge-helper'
import type { IED } from './networking'

interface Props {
	nodes: Node[]
	edges: Edge[]
	ieds: Writable<IED[]>
	isOutsidePluginContext?: boolean
	connect: (connection: Connection) => void
	onDelete: (networkings: Networking[]) => void
}

let {
	nodes,
	edges,
	ieds,
	isOutsidePluginContext = false,
	connect,
	onDelete
}: Props = $props()

const nodeTypes = {
	ied: IEDNode,
	bay: BayNode
}

const { fitView } = useSvelteFlow()

$effect(() => {
	if (!isOutsidePluginContext) return

	function handleResize() {
		fitView()
	}
	window.addEventListener('resize', handleResize)
	return () => {
		window.removeEventListener('resize', handleResize)
	}
})

function ondelete(deleteEvent: { nodes: Node[]; edges: Edge[] }): void {
	const { edges } = deleteEvent
	const currentIEDs = $ieds
	const networkings: Networking[] = edges.flatMap((edge) =>
		getPhysConnectionsFromEdge(edge, currentIEDs)
	)
	onDelete(networkings)
}
</script>

<network-diagram use:injectStyles={xyflowStyles}>
	<SvelteFlow 
		bind:nodes
		bind:edges
		fitView 
		minZoom={0.1} 
		maxZoom={2.5}
		colorMode="light"
		{nodeTypes}
		snapGrid={[20, 20]}
		{ondelete}
		onbeforeconnect={connect}
		panOnDrag={!isOutsidePluginContext}
	>
		{#if !isOutsidePluginContext}
			<Controls />
		{/if}
		<Background variant={BackgroundVariant.Dots} />
	</SvelteFlow>
</network-diagram>

<style>
	network-diagram {
		display: block;
		/* height: 100vh; */
	}

	:global(.svelte-flow__pane) {
		cursor: unset;
	}
</style>
