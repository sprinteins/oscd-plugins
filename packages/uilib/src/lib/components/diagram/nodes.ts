import type { ElkExtendedEdge, ElkNode } from "elkjs"
import type { IEDDetails, IEDCommInfo, MessageType } from "@oscd-plugins/core"

export function newIEDNode(iedNode: IEDElkNode): IEDElkNode {
	const newIEDNode: IEDElkNode = {
		...iedNode,
	}

	return newIEDNode
}

export type IEDConnection = ElkExtendedEdge & {
	isRelevant?: boolean
	relevantIEDNames?: string[]
	messageType?: MessageType
	messageTypeLabel?: string
}

export type IEDConnectionWithCustomValues = IEDConnection & {
	sourceIED: IEDCommInfo
	targetIED: IEDCommInfo
}

export type RootNode<ChildNodes=IEDElkNode> = Omit<ElkNode, "children" | "edges"> & {
	children: Array<ChildNodes>,
	edges?: IEDConnectionWithCustomValues[]
}

export type SubnetworkEdge = ElkExtendedEdge & {
	isRelevant?: boolean
}

export type IEDElkNode = Omit<ElkNode, "edges" | "children"> & {
	label: string,
	isRelevant?: boolean
	isBayNode?: boolean
	edges?: IEDConnection[]
	children: IEDElkNode[]
	details: IEDDetails
}

export type BayElkNode = Omit<IEDElkNode, "isBayNode"> & {
	isBayNode: true;
}

export type NetworkNode = IEDElkNode | BayElkNode

export function isBayNode(node: IEDElkNode | BayElkNode): node is BayElkNode {
	return Boolean(node.isBayNode)
}
