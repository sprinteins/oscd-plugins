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
	LNodeElement
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

	export type TypeRefElement = {
		element: Element
		type: string
	}

	export type SubstationTypeElement = SubstationElement & {
		typeRefs: TypeRefElement[]
	}
	export type VoltageLevelTypeElement = VoltageLevelElement & {
		typeRefs: TypeRefElement[]
	}
	export type BayTypeElement = BayElement & { typeRefs: TypeRefElement[] }
	export type IEDTypeElement = IEDElement & { typeRefs: TypeRefElement[] }
	export type LDeviceTypeElement = LDeviceElement & {
		typeRefs: TypeRefElement[]
	}
	export type LNodeTypeElement = LNodeElement & { typeRefs: undefined }

	export type TypeElement =
		| SubstationTypeElement
		| VoltageLevelTypeElement
		| BayTypeElement
		| IEDTypeElement
		| LDeviceTypeElement
		| LNodeTypeElement

	export type TypeElements = {
		substationTypes: SubstationTypeElement[]
		voltageLevelTypes: VoltageLevelTypeElement[]
		bayTypes: BayTypeElement[]
		iedTypes: IEDTypeElement[]
		lDeviceTypes: LDeviceTypeElement[]
		lNodeTypes: LNodeTypeElement[]
	}
}
