import type { BayNode, IEDNode, RootNode } from '@oscd-plugins/ui/src/components/diagram'
import type { IED } from '@oscd-plugins/core'

export function getIEDDetails(
	nodes: RootNode,
	label?: string
): IED.Details | null {
	if (label === undefined) {
		return null
	}

	// find ied in nodes
	// enforces that IED labels are unique!
	const selectedNode = nodes.children.find(
		(node: IEDNode | BayNode) => node.label == label
	)
	if (!selectedNode) {
		return null
	}

	return selectedNode.details
}
