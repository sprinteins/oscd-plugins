// TYPES
import type { ElkExtendedEdge, ElkNode } from "elkjs"
import type { IED, Utils, MESSAGE_TYPE } from "@oscd-plugins/core"

export function newIEDElkNode(iedElkNode: IEDElkNode): IEDElkNode {
	const newIEDElkNode: IEDElkNode = {
		...iedElkNode,
	}

	return newIEDElkNode
}

export type IEDConnection = ElkExtendedEdge & {
	isRelevant?: boolean
	relevantIEDNames?: string[]
	messageType?: Utils.ValueOf<typeof MESSAGE_TYPE>
	messageTypeLabel?: string
}

export type IEDConnectionWithCustomValues = IEDConnection & {
	sourceIED: IED.CommunicationInfo
	targetIED: IED.CommunicationInfo
}

export type RootNode<ChildNodes = IEDElkNode> = Omit<ElkNode, "children" | "edges"> & {
	children: Array<ChildNodes>,
	edges?: IEDConnectionWithCustomValues[]
}

export type SubnetworkEdge = ElkExtendedEdge & {
	isRelevant?: boolean
}

export type IEDElkNode = Omit<ElkNode, "edges" | "children"> & {
	label: string
	isRelevant?: boolean
	isBayNode?: boolean
	edges?: IEDConnection[]
	children: IEDElkNode[]
	details: IED.Details
	bays: Set<string>
	bayLabelHeight: number
	bayLabelGap: number
	iedHeight: number
}

export type BayElkNode = Omit<IEDElkNode, "isBayNode"> & {
	isBayNode: true;
}

export type NetworkNode = IEDElkNode | BayElkNode

export function isBayNode(node: IEDElkNode | BayElkNode): node is BayElkNode {
	return Boolean(node.isBayNode)
}
