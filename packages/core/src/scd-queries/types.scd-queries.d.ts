// CONSTANTS
import type { ELEMENT_NAMES } from '../constants/element.constant'
import type { LNodeElement } from './scd-query'

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

export type DataTypeTemplate = {
	id: string
	name: string
	desc: string
	refElements: RefElements[]
}

export type SubstationElementAttributes = DataTypeTemplate & {
	refElements: VoltageLevelElement[]
}
export type SubstationElement = SCDBaseElement & SubstationElementAttributes

export type VoltageLevelElementAttributes = DataTypeTemplate & {
	nomFreq: string
	numPhases: string
	refElements: BayElement[]
}
export type VoltageLevelElement = SCDBaseElement & VoltageLevelElementAttributes

export type BayElementAttributes = DataTypeTemplate & {
	refElements: IEDElement[]
}
export type BayElement = SCDBaseElement & BayElementAttributes

export type IEDElementAttributes = DataTypeTemplate & {
	originalSclRevision: string
	originalSclVersion: string
	owner: string
	configVersion: string
	manufacturer: string
	type: string
	refElements: LDeviceElement[]
}
export type IEDElement = SCDBaseElement & IEDElementAttributes

export type LDeviceElementAttributes = DataTypeTemplate & {
	inst: string
	refElements: LNodeElement[]
}
export type LDeviceElement = SCDBaseElement & LDeviceElementAttributes

export type RefElements =
	| VoltageLevelElement
	| BayElement
	| IEDElement
	| LDeviceElement
	| LNodeElement