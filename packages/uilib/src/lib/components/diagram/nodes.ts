import type { ElkExtendedEdge, ElkNode } from "elkjs"
import type { IEDCommInfo, MessageType } from "@oscd-plugins/core"
import type { IED } from "../ied"

export function newIEDNode(iedNode: IEDNode): IEDNode {
	const newIEDNode: IEDNode = {
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

export type RootNode = Omit<ElkNode, "children" | "edges"> & {
	children: Array<IEDNode | BayNode>,
	edges?: IEDConnectionWithCustomValues[]
}

export type SubnetworkEdge = ElkExtendedEdge & {
	isRelevant?: boolean
}

export type IEDNode = Omit<ElkNode, "edges" | "children"> & {
	label: string,
	isRelevant?: boolean
	isBayNode?: boolean
	edges?: IEDConnection[]
	children: IEDNode[]
}

export type BayNode = Omit<IEDNode, "isBayNode"> & {
	isBayNode: true;
}

export function isBayNode(node: IEDNode | BayNode): node is BayNode {
	return Boolean(node.isBayNode)
}
