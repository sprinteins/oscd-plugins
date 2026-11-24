<script lang="ts">
/**
 * This component is responsible to configure SvelteFlow
 */

import type { Networking } from '@oscd-plugins/core'
import {
	Background,
	BackgroundVariant,
	type Connection,
	Controls,
	type Edge,
	type Node,
	SvelteFlow,
	useSvelteFlow
} from '@xyflow/svelte'
import xyflowStyles from '@xyflow/svelte/dist/style.css?inline'
import type { Writable } from 'svelte/store'
import BayNode from './bay-node.svelte'
import { getPhysConnectionsFromEdge } from './edge-helper'
import IEDNode from './ied-node.svelte'
import { injectDiagramStyles } from './inject-styles.diagram'
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
let diagramRoot: HTMLElement | null = $state(null)

$effect(() => {
	if (!diagramRoot) return

	const observer = new ResizeObserver(() => {
		void fitView({ padding: 0.08, maxZoom: 1.5 })
	})
	observer.observe(diagramRoot)

	return () => {
		observer.disconnect()
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

<network-diagram
	bind:this={diagramRoot}
	use:injectDiagramStyles={xyflowStyles}
>
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
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
	}

	:global(.svelte-flow__pane) {
		cursor: unset;
	}
</style>
