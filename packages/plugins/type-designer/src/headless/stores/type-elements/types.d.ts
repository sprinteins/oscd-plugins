import type { pluginLocalStore } from '@/headless/stores'
import type { TYPE_FAMILY_MAP, REF_FAMILY_MAP } from '@/headless/constants'
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
	bay: Xml.SclElement<
		'bay',
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
	generalEquipmentType: Xml.SclCustomElement<'GeneralEquipmentType'>
	conductingEquipmentType: Xml.SclCustomElement<'ConductingEquipmentType'>
	functionTemplate: Xml.SclElement<
		'functionTemplate',
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
	lNodeType: Xml.SclElement<
		'lNodeType',
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
}

export type TypeElementsPerFamily = {
	bay: TypeElements<'bay'>
	generalEquipmentType: TypeElements<'generalEquipmentType'>
	conductingEquipmentType: TypeElements<'conductingEquipmentType'>
	functionTemplate: TypeElements<'functionTemplate'>
	lNodeType: TypeElements<'lNodeType'>
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
	bay: Column<'bay'>
	equipmentTypeTemplates:
		| Column<'generalEquipmentType'>
		| Column<'conductingEquipmentType'>
	functionTemplate: Column<'functionTemplate'>
	lNodeType: Column<'lNodeType'>
}
