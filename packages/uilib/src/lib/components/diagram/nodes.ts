import type { ElkExtendedEdge, ElkNode } from "elkjs"
import type { IEDCommInfo, MessageType } from "@oscd-plugins/core"

export type IEDNode = Omit<ElkNode, "edges"> & {
	label: string,
	isRelevant?: boolean
	edges?: IEDConnection[]
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
	children: IEDNode[],
	edges?: IEDConnectionWithCustomValues[]
}

