// CONSTANTS
import type { SCD_ELEMENTS } from '../constants/element.constant'
// TYPES
import type {
	SCDBaseElement,
	AllowedElements,
	SubstationElement,
	VoltageLevelElement,
	BayElement,
	IEDElement,
	LDeviceElement,
	lNodeElement
} from '../types.scd-queries'

export namespace DataTypeTemplates {
	export type AllowedElementsTypeTags =
		(typeof SCD_ELEMENTS)[AllowedElements]['type']['tag']
	export type AllowedElementsTypeRefTags = Exclude<
		(typeof SCD_ELEMENTS)[AllowedElements]['typeRef']['tag'],
		undefined
	>

	export type AllowedTags =
		| 'DataTypeTemplates'
		| 'Private'
		| AllowedElementsTypeTags
		| AllowedElementsTypeRefTags

	export type RootElement = SCDBaseElement

	export type TypeElements = {
		substationTypes: SubstationElement[]
		voltageLevelTypes: VoltageLevelElement[]
		bayTypes: BayElement[]
		iedTypes: IEDElement[]
		lDeviceTypes: LDeviceElement[]
		lNodeTypes: lNodeElement[]
	}
}
