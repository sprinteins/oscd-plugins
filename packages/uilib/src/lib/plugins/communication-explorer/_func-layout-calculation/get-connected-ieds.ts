import type { MessageType } from "@oscd-plugins/core"
import type { IEDConnection, IEDNode, RootNode } from "../../../components/diagram"

export type ConnectedIEDs = {
	publishedTo: ConnectedIED[]
	subscribedFrom: ConnectedIED[]
}

export type ConnectedIED = {
	node: IEDNode
	serviceType: MessageType | undefined
	serviceTypeLabel: string | undefined
}

export function getConnectedIEDsByLabel(nodes: RootNode, label?: string): ConnectedIEDs {

	const connectedIEDs: ConnectedIEDs = {
		publishedTo:    [],
		subscribedFrom: [],
	}

	if (label === undefined) {
		return connectedIEDs
	}

	// find ied in nodes
	// enforces that IED labels are unique!
	const selectedNode = nodes.children.find((node) => node.label == label)
	if (!selectedNode) {
		return connectedIEDs
	}

	const selectedNodeID = selectedNode.id

	nodes.edges?.forEach((edge: IEDConnection | undefined) => {

		// forEach is less flexible, continue does not work
		if (edge !== undefined) {

			const sources = edge.sources
			const targets = edge.targets
			const messageType = edge.messageType
			const messageTypeLabel = edge.messageTypeLabel
	
			const isConnectedSource = sources.includes(selectedNodeID)
			const isConnectedTarget = targets.includes(selectedNodeID)
			
	
			if (isConnectedSource) {
				const targetNodeID = edge.targets.find((target) => target !== selectedNodeID)
				const targetNode = getRelatedIEDNode(targetNodeID, nodes.children)

				if (targetNode) {
					connectedIEDs.publishedTo.push({
						node:             targetNode,
						serviceType:      messageType,
						serviceTypeLabel: messageTypeLabel,
					})
				}
			}
	
			if (isConnectedTarget) {
				const sourceNodeID = edge.sources.find((source) => source !== selectedNodeID)
				const sourceNode = getRelatedIEDNode(sourceNodeID, nodes.children)

				if (sourceNode) {
					connectedIEDs.subscribedFrom.push({
						node:             sourceNode,
						serviceType:      messageType,
						serviceTypeLabel: messageTypeLabel,
					})
				}
			}
		}

	})
	return connectedIEDs
}

function getRelatedIEDNode(nodeID: string | undefined, nodeChildren: IEDNode[]): IEDNode | undefined {
	if(nodeID) {
		return nodeChildren.find((node) => node.id === nodeID)
	}
	return undefined
}