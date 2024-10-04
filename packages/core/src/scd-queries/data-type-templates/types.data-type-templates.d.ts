// TYPES
import type {
	SCDBaseElement,
	AllowedElements,
	AllowedElementNames,
	SubstationElement,
	VoltageLevelElement,
	BayElement,
	IEDElement,
	LDeviceElement
} from '../types.scd-queries'

export namespace DataTypeTemplates {
	type TreeOrder =
		| `${number}`
		| `${number}.${number}`
		| `${number}.${number}.${number}`

	export type AllowedTag =
		| 'SubstationType'
		| 'VoltageLevelType'
		| 'BayType'
		| 'IEDType'
		| 'LDeviceType'

	export type RootElement = SCDBaseElement
	export type SubElements = {
		substations: SubstationElement[]
		voltageLevels: VoltageLevelElement[]
		bays: BayElement[]
		ieds: IEDElement[]
		logicalDevices: LDeviceElement[]
	}

	export type ElementsTreeStructure = Record<
		AllowedElements,
		{
			elementName: AllowedElementNames
			treeOrder: TreeOrder
			tagName: DataTypeTemplates.Tag
			children: DataTypeTemplates.Tag[]
		}
	>
}
