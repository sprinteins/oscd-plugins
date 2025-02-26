import type { pluginLocalStore } from '@/headless/stores'
import type { TYPE_FAMILY, REF_FAMILY, COLUMNS } from '@/headless/constants'
import type { Xml, Utils } from '@oscd-plugins/core-api/plugin/v1'
import type { IEC61850 } from '@oscd-plugins/core-standard'

export type AvailableTypeFamily = keyof typeof TYPE_FAMILY
// export type AvailableTypeFamilyWithTemplate = AvailableTypeFamily | 'template'
export type AvailableRefFamily = keyof typeof REF_FAMILY

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

export type TypeElement<GenericTypeFamily extends AvailableTypeFamily> = {
	element: Xml.SclElement<
		GenericTypeFamily,
		typeof pluginLocalStore.currentEdition,
		typeof pluginLocalStore.currentUnstableRevision
	>
	attributes: Record<string, string | null>
	parameters: {
		label: string
		refFamily: AvailableRefFamily | undefined
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

export type TypeToCreateAttributes = {
	name: string
	type?: string
}

export type TypeToCreateChildren = {
	family: IEC61850.AvailableElement<typeof pluginLocalStore.currentEdition>
	attributes: Record<string, string | null>
}[]

export type Column<GenericTypeFamily extends AvailableTypeFamily> = {
	name: string
	groupedTypeElements: Record<TypeElementByIds<GenericTypeFamily>>
}

export type Columns = {
	[COLUMNS.bayType]: Column<'bay'>
	[COLUMNS.equipmentType]:
		| Column<'generalEquipment'>
		| Column<'conductingEquipment'>
	[COLUMNS.functionType]: Column<'function'> | Column<'eqFunction'>
	[COLUMNS.lNodeType]: Column<'lNodeType'>
}
