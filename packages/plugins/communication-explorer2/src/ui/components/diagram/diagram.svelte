<script lang="ts">
import { onMount } from 'svelte'
import { SvelteFlowProvider, SvelteFlow, useSvelteFlow } from '@xyflow/svelte'
import '@xyflow/svelte/dist/style.css'

import IEDNode from './nodes/ied-node.svelte'
// STORES
import { diagramStore } from '@/headless/stores'
import { generateDiagramLayout } from '@/headless/stores/diagram/layout.helper'
// TYPES
import type { Node, Edge } from '@xyflow/svelte'

// State for nodes and edges
let nodes = $state.raw<Node[]>([])
let edges = $state.raw<Edge[]>([])
let isLoading = $state(true)

// Define node and edge types
const nodeTypes = {
	iedNode: IEDNode
}

// Load diagram data
async function loadDiagramData() {
	isLoading = true
	const layout = await generateDiagramLayout(
		diagramStore.iedCommunicationInfos,
		{} // Default layout config
	)
	console.log(layout)

	// Update state in a way that ensures reactivity
	nodes = [...layout.nodes]
	edges = [...layout.edges]

	// Give the diagram time to render before removing the loading overlay
	setTimeout(() => {
		isLoading = false
	}, 100)
}

$inspect('found IEDS', diagramStore.iedCommunicationInfos)
$inspect('found bays', diagramStore.bays)
$inspect('edges', edges)
$inspect('nodes', nodes)

// Initialize the diagram on component mount
onMount(async () => {
	await loadDiagramData()
})
</script>

<div class="diagram-container" style="height: 100%; width: 100%;">
  {#if isLoading}
    <div class="loading-overlay">
      <span>Loading diagram...</span>
    </div>
  {/if}
  
  <SvelteFlowProvider>
    <SvelteFlow
      nodes={nodes}
      edges={edges}
      fitView
      {nodeTypes}
      defaultEdgeOptions={{ 
        type: 'customEdge',
        animated: true
      }}
    >
    </SvelteFlow>
  </SvelteFlowProvider>
</div>

<style>
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 10;
  }
</style>




