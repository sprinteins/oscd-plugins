// CONSTANTS
import type { ELEMENT_NAMES } from '../constants/element.constant'

//====== SCD QUERIES

export type SCDBaseElement = {
	element: Element
}

export type CommonOptions = {
	root?: Element
}
export type Optional<T> = T | undefined
export type AttributeList<T extends SCDBaseElement> = Exclude<
	keyof T,
	keyof SCDBaseElement
>

//====== SCD ELEMENTS
export type AllowedElements = keyof typeof ELEMENT_NAMES
export type AllowedElementNames = (typeof ELEMENT_NAMES)[AllowedElements]

export type SubstationElementAttributes = {
	id: string
	desc: string
	name: string
}
export type SubstationElement = SCDBaseElement & SubstationElementAttributes

export type VoltageLevelElementAttributes = {
	id: string
	desc: string
	name: string
	nomFreq: string
	numPhases: string
}
export type VoltageLevelElement = SCDBaseElement & VoltageLevelElementAttributes

export type BayElementAttributes = {
	id: string
	desc: string
	name: string
}
export type BayElement = SCDBaseElement & BayElementAttributes

export type IEDElementAttributes = {
	id: string
	desc: string
	name: string
	originalSclRevision: string
	originalSclVersion: string
	owner: string
	configVersion: string
	manufacturer: string
	type: string
}
export type IEDElement = SCDBaseElement & IEDElementAttributes

export type LDeviceElementAttributes = {
	id: string
	name: string
	desc: string
	inst: string
}
export type LDeviceElement = SCDBaseElement & LDeviceElementAttributes
