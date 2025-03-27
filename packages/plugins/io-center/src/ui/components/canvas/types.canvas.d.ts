import type { LC_TYPE, NODE_ELEMENT_TYPE, NODE_TYPE } from "@/headless/constants"
import type { LpTypes } from "../lp-list/types.lp-list"

export type ConnectionPort = {
	side: "right" | "left"
	index?: number
	name: string
}

export type ConnectionPoint = {
	name: string
	type: NodeElementType
	port: ConnectionPort
}

export type Connection = {
	id: string
	from: ConnectionPoint
	to: ConnectionPoint
}

export type NodeElementType = keyof typeof NODE_ELEMENT_TYPE

export type NodeElement =
	| {
		id: string
		type: "DO",
		name: string
		isLinked?: boolean
	}
	| {
		id: string
		type: "LC" | "LP",
		name: string
		isLinked?: boolean
		lnClass: LcTypes | LpTypes
		title?: string
		numberOfDynamicPorts?: number
	}

export type LogicalConditioner = {
	id: string,
	type: LcTypes,
	instance: string,
	isLinked: boolean,
	numberOfLCIVPorts?: number,
}

export type AddLCFormData = {
	type: LcTypes | "",
	number?: number,
	numberOfLCIVPorts?: number
}

export type LcTypes = keyof typeof LC_TYPE
