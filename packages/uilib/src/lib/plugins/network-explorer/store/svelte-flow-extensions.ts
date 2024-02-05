import type { Edge } from "@xyflow/svelte"
import { useEdges } from "@xyflow/svelte"
import { derived } from "svelte/store"

export const useNewEdges = () => {
	return derived(useEdges(), (edges: Edge[], set) => {
		const newEdges = edges.filter(e => isNewEdge(e))
	
		if (newEdges.length > 0) {
			set(newEdges)
		}
	})
}

// TODO: Is this safe enough? What if svelteflow changes the prefix
const svelteFlowEdgePrefix = "xyflow__edge"
export const isNewEdge = (edge: Edge): boolean => edge.id.startsWith(svelteFlowEdgePrefix)
