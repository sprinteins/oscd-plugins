import type { LC_TYPE, NODE_ELEMENT_TYPE, NODE_TYPE } from "@/headless/constants"


export type Connection = {
	id: string
	from: string
	to: string
}

export type NodeElementType = keyof typeof NODE_ELEMENT_TYPE

export type NodeElement = {
	id: string
	type: NodeElementType
	name: string
}

export type LogicalConditioner = {
	id: string,
	type: LcTypes,
	instance: string,
	isLinked: boolean,
}

export type AddLCFormData = {
	type: LcTypes | "",
	number?: number,
	numberOfLCIVPorts?: number
}

export type LcTypes = keyof typeof LC_TYPE
