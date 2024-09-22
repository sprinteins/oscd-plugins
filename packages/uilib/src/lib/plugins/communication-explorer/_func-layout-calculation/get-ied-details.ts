import type { BayNode, IEDNode, RootNode } from "../../../components/diagram"

export function getIEDDetails(nodes: RootNode, label?: string): string[] {

	if (label === undefined) {
		return []
	}

	// find ied in nodes
	// enforces that IED labels are unique!
	const selectedNode = nodes.children.find((node: IEDNode | BayNode) => node.label == label)
	if (!selectedNode) {
		return []
	}

	return selectedNode.details;
}