import type { pluginLocalStore } from '@/headless/stores'
import type { TYPE_FAMILY, REF_FAMILY, COLUMNS } from '@/headless/constants'
import type { Xml, Utils } from '@oscd-plugins/core-api/plugin/v1'
import type { IEC61850 } from '@oscd-plugins/core-standard'

export type AvailableColumn = keyof COLUMNS
export type AvailableTypeFamily = keyof typeof TYPE_FAMILY
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
		childrenOptions: Record<
			AvailableTypeFamily,
			ConductingEquipmentChildrenOptions | undefined
		>
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
	occurrence: number
}

export type SortedImportedTypeElements<
	GenericImportedTypeFamily extends AvailableTypeFamily
> = {
	all: TypeElementByIds<AvailableTypeFamily>
	toUpdate: TypeElementByIds<AvailableTypeFamily>
	toAdd: TypeElementByIds<AvailableTypeFamily>
}

export type Column<GenericTypeFamily extends AvailableTypeFamily> = {
	name: string
	groupedTypeElements: Record<
		GenericTypeFamily,
		TypeElementByIds<GenericTypeFamily>
	>
	importedTypeElements: Record<
		GenericTypeFamily,
		SortedImportedTypeElements<GenericTypeFamily>
	>
}

export type Columns = {
	[COLUMNS.bayType]: Column<'bay'>
	[COLUMNS.equipmentType]:
		| Column<'generalEquipment'>
		| Column<'conductingEquipment'>
	[COLUMNS.functionType]: Column<'function'> | Column<'eqFunction'>
	[COLUMNS.lNodeType]: Column<'lNodeType'>
}

// Children Options

type ConductingEquipmentChildrenOptions = {
	currentTerminalsElements: Element[]
	currentValue: number | undefined
	options: Array<{ label: string; value: number }>
}
