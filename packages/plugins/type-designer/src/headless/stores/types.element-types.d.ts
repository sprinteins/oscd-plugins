import type {
	Substation,
	Equipment,
	DataTypeTemplates
} from '@oscd-plugins/core-standard/ed2'
import type { Xml, Utils } from '@oscd-plugins/core-api/plugin/v1'

export type AvailableFamilies = keyof ElementTypesPerFamily

export type ElementTypes<Family extends AvailableFamilies | 'lNodeType'> =
	Record<string, ElementType<Family>>

export type ElementType<Family extends AvailableFamilies | 'lNodeType'> = {
	name: string
	element: Xml.SclElement<Family>
	attributes: ElementAttributes[Family]
	family: Family
	allowedTargets: Array<keyof Columns>
	typeRefs: string[]
}

export type ElementTypesPerFamily = {
	bay: ElementTypes<'bay'>
	generalEquipment: ElementTypes<'generalEquipment'>
	conductingEquipment: ElementTypes<'conductingEquipment'>
	function: ElementTypes<'function'>
	eqFunction: ElementTypes<'eqFunction'>
}
export type Column<Family extends AvailableFamilies | 'lNodeType'> = {
	name: string
	groupedElementTypes: Record<Family, ElementTypes<Family>>
}

export type Columns = {
	bay: Column<'bay'>
	equipment: Column<'generalEquipment'> | Column<'conductingEquipment'>
	function: Column<'function'> | Column<'eqFunction'>
	lNodeType: Column<'lNodeType'>
}
