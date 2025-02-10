import type { pluginLocalStore } from '@/headless/stores'
import type {
	TYPE_FAMILY_MAP,
	REF_FAMILY_MAP,
	COLUMNS
} from '@/headless/constants'
import type { Xml, Utils } from '@oscd-plugins/core-api/plugin/v1'

export type AvailableTypeFamily = keyof typeof TYPE_FAMILY_MAP
export type AvailableRefFamily = keyof typeof REF_FAMILY_MAP

export type TypeElements<Family extends AvailableTypeFamily> = Record<
	string,
	TypeElement<Family>
>

export type TypeElement<Family extends AvailableTypeFamily> = {
	element: MapTypeFamilyToDefinitionElement[Family]
	attributes: Record<string, string | null>
	parameters: {
		label: string
	}
	refs: Record<AvailableTypeFamily, string[]>
}

export type MapTypeFamilyToDefinitionElement = {
	[TYPE_FAMILY_MAP.bay]: Xml.SclElement<
		'bay',
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
	[TYPE_FAMILY_MAP.generalEquipmentType]: Xml.SclCustomElement<'GeneralEquipmentType'>
	[TYPE_FAMILY_MAP.conductingEquipmentType]: Xml.SclCustomElement<'ConductingEquipmentType'>
	[TYPE_FAMILY_MAP.functionTemplate]: Xml.SclElement<
		'functionTemplate',
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
	[TYPE_FAMILY_MAP.lNodeType]: Xml.SclElement<
		'lNodeType',
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
}

export type TypeElementsPerFamily = {
	[TYPE_FAMILY_MAP.bay]: TypeElements<'bay'>
	[TYPE_FAMILY_MAP.generalEquipmentType]: TypeElements<'generalEquipmentType'>
	[TYPE_FAMILY_MAP.conductingEquipmentType]: TypeElements<'conductingEquipmentType'>
	[TYPE_FAMILY_MAP.functionTemplate]: TypeElements<'functionTemplate'>
	[TYPE_FAMILY_MAP.lNodeType]: TypeElements<'lNodeType'>
}

export type NewTypeAttributes = {
	name: string
	type?: string
}

export type Column<Family extends AvailableTypeFamily> = {
	name: string
	groupedTypeElements: Record<Family, TypeElements<Family>>
}

export type Columns = {
	[COLUMNS.bay]: Column<'bay'>
	[COLUMNS.equipmentTypeTemplates]:
		| Column<'generalEquipmentType'>
		| Column<'conductingEquipmentType'>
	[COLUMNS.functionTemplate]: Column<'functionTemplate'>
	[COLUMNS.lNodeType]: Column<'lNodeType'>
}
