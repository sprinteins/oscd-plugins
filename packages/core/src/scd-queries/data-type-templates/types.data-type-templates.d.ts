// TYPES
import type {
	SCDBaseElement,
	AllowedElements,
	AllowedElementNames,
	SubstationElementAttributes,
	VoltageLevelElementAttributes,
	BayElementAttributes,
	IEDElementAttributes,
	LDeviceElementAttributes
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
		substations: SubstationElementAttributes[]
		voltageLevels: VoltageLevelElementAttributes[]
		bays: BayElementAttributes[]
		ieds: IEDElementAttributes[]
		logicalDevices: LDeviceElementAttributes[]
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
