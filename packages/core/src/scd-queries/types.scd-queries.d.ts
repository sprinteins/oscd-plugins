// CONSTANTS
import type {
	SCD_ELEMENTS,
	BASE_STANDARD_ATTRIBUTES
} from '../constants/element.constant'

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

//====== PRIVATE ELEMENTS

type PrivateElementAttributes = { type: string }
export type PrivateElement = SCDBaseElement & PrivateElementAttributes

//====== SCD ELEMENTS
export type AllowedElements = keyof typeof SCD_ELEMENTS

export type BaseElementStandardAttributes = {
	[key in (typeof BASE_STANDARD_ATTRIBUTES)[number]]: string
}

export type SubstationElementStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['substation']['element']['standardAttributes'][number]]: string
}
export type SubstationElement = SCDBaseElement &
	SubstationElementStandardAttributes

export type VoltageLevelElementStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['voltageLevel']['element']['standardAttributes'][number]]: string
}
export type VoltageLevelElement = SCDBaseElement &
	VoltageLevelElementStandardAttributes

export type BayElementStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['bay']['element']['standardAttributes'][number]]: string
}
export type BayElement = SCDBaseElement & BayElementStandardAttributes

export type IEDElementStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['ied']['element']['standardAttributes'][number]]: string
}
export type IEDElement = SCDBaseElement & IEDElementStandardAttributes

export type LDeviceElementStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['lDevice']['element']['standardAttributes'][number]]: string
}
export type LDeviceElement = SCDBaseElement & LDeviceElementStandardAttributes

export type LNodeElementStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['lNode']['element']['standardAttributes'][number]]: string
}
export type LNodeElement = SCDBaseElement & LNodeElementStandardAttributes
