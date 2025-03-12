import type { LC_TYPE, NODE_ELEMENT_TYPE, NODE_TYPE } from "@/headless/constants"

export type ConnectionPoint = {
	node: string
	side: string
}

export type Connection = {
	from: ConnectionPoint
	to: ConnectionPoint
}

export type NodeElementType = keyof typeof NODE_ELEMENT_TYPE

export type NodeElement = {
	id: string
	type: NodeElementType
	name: string
}

export type NodeProps = {
	node: NodeElement
	showLeftCircle: boolean
	showRightCircle: boolean
	startDrawing: (event: MouseEvent) => void
	stopDrawing: (node: string, side: string) => void
}

export type FormData = {
	type: LcTypes,
	number?: number,
	nbOfLCIVPorts?: number
}

export type LogicalConditioner = {
	id: string,
	type: LcTypes,
	instance: string,
	isLinked: boolean,
}

export type LcTypes = keyof typeof LC_TYPE
