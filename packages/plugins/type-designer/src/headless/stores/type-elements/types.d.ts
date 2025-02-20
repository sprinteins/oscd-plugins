import type { pluginLocalStore } from '@/headless/stores'
import type {
	TYPE_FAMILY_MAP,
	REF_FAMILY_MAP,
	COLUMNS
} from '@/headless/constants'
import type { Xml, Utils } from '@oscd-plugins/core-api/plugin/v1'

export type AvailableTypeFamily = keyof typeof TYPE_FAMILY_MAP
export type AvailableRefFamily = keyof typeof REF_FAMILY_MAP

export type TypeRawElement<GenericTypeFamily extends AvailableTypeFamily> =
	Xml.SclElement<
		GenericTypeFamily,
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
export type RefRawElement<GenericRefFamily extends AvailableRefFamily> =
	Xml.SclElement<
		GenericRefFamily,
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
export type PluginRawElement<
	GenericFamily extends AvailableTypeFamily | AvailableRefFamily
> = GenericFamily extends AvailableTypeFamily
	? TypeRawElement<GenericFamily>
	: RefRawElement<GenericFamily>

export type TypeElementsByFamily = {
	[key in AvailableTypeFamily]: TypeElementByIds<key>
}

export type TypeElementByIds<GenericTypeFamily extends AvailableTypeFamily> =
	Record<string, TypeElement<GenericTypeFamily>>

export type TypeElement<GenericFamily extends AvailableTypeFamily> = {
	element: GenericTypeFamily<GenericFamily>
	attributes: Record<string, string | null>
	parameters: {
		label: string
	}
	refs: RefElementsByFamily
}

export type RefElementsByFamily = {
	[key in AvailableRefFamily]: RefElementByIds<key>
}

export type RefElementByIds<GenericRefFamily extends AvailableRefFamily> =
	Record<string, RefElement<GenericRefFamily>>

export type RefElement<GenericRefFamily extends AvailableRefFamily> = {
	element: RefRawElement<GenericRefFamily>
	source: {
		id: string
		family: AvailableTypeFamily
	}
}

export type NewTypeAttributes = {
	name: string
	type?: string
}

export type Column<GenericFamily extends AvailableTypeFamily> = {
	name: string
	groupedTypeElements: Record<GenericFamily, TypeElements<Family>>
}

export type Columns = {
	[COLUMNS.bay]: Column<'bay'>
	[COLUMNS.equipmentTypeTemplates]:
		| Column<'generalEquipmentType'>
		| Column<'conductingEquipmentType'>
	[COLUMNS.functionTemplate]: Column<'functionTemplate'>
	[COLUMNS.lNodeType]: Column<'lNodeType'>
}
