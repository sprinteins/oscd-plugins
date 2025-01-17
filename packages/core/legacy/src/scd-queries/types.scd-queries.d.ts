// CONSTANTS
import type {
	SCD_ELEMENTS,
	BASE_STANDARD_ATTRIBUTES
} from '@/constants/element.constant'

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

export type ReportControlStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['reportControl']['element']['standardAttributes'][number]]: string
}
export type ReportControlElement = SCDBaseElement &
	ReportControlStandardAttributes

export type ClientLNStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['clientLN']['element']['standardAttributes'][number]]: string
}
export type ClientLNElement = SCDBaseElement & ClientLNStandardAttributes

export type InputsStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['inputs']['element']['standardAttributes'][number]]: string
}
export type InputsElement = SCDBaseElement & InputsStandardAttributes

export type ExtRefStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['extRef']['element']['standardAttributes'][number]]: string
}
export type ExtRefElement = SCDBaseElement & ExtRefStandardAttributes

export type GSEControlStandardAttributes = {
	[key in (typeof SCD_ELEMENTS)['gseControl']['element']['standardAttributes'][number]]: string
}
export type GSEControlElement = SCDBaseElement & GSEControlStandardAttributes
