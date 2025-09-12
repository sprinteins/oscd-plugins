import type { ElkExtendedEdge, ElkNode } from "elkjs"
import type { IED, Utils, MESSAGE_TYPE } from "@oscd-plugins/core"

export interface Config {
	iedWidth: number
	iedHeight: number
	bayLabelHeight: number
	bayLabelGap: number
	spacingBase?: number
	spacingBetweenNodes?: number
}

export type IEDConnection = ElkExtendedEdge & {
	isRelevant?: boolean
	relevantIEDNames?: string[]
	messageType?: Utils.ValueOf<typeof MESSAGE_TYPE>
	messageTypeLabel?: string
}

export type IEDConnectionWithCustomValues = IEDConnection & {
	sourceIED?: IED.CommunicationInfo
	targetIED?: IED.CommunicationInfo
}

export type IEDNode = Omit<ElkNode, "edges" | "children"> & {
	label: string
	isRelevant?: boolean
	isBayNode?: boolean
	edges?: IEDConnection[]
	children?: IEDNode[]
	details?: IED.Details
	bays?: Set<string>
	bayLabelHeight?: number
	bayLabelGap?: number
	iedHeight?: number
	x: number
	y: number
	width: number
	height: number
}

export type BayNode = Omit<IEDNode, "isBayNode"> & {
	isBayNode: true
}

export type RootNode = Omit<ElkNode, "children" | "edges"> & {
	children: IEDNode[]
	edges?: IEDConnectionWithCustomValues[]
	x: number
	y: number
	width: number
	height: number
}

export function isBayNode(node: IEDNode): node is BayNode {
	return Boolean(node.isBayNode)
}