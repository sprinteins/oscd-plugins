import { writable, get } from 'svelte/store'
import { ELEMENT_NAMES } from '@oscd-plugins/core'
import { dataTypeTemplatesStore } from './data-types-templates.store'
import type {
	Column,
	BayType,
	DataTypeTemplate,
	IEDType,
	LDeviceType,
	SubstationType,
	VoltageLevelType
} from './columns-type.store'

const initialColumns: Column[] = [
	{ name: ELEMENT_NAMES.substation, visible: true, items: [] },
	{ name: ELEMENT_NAMES.voltageLevel, visible: true, items: [] },
	{ name: ELEMENT_NAMES.bay, visible: true, items: [] },
	{ name: ELEMENT_NAMES.ied, visible: true, items: [] },
	{ name: ELEMENT_NAMES.lDevice, visible: true, items: [] },
	{ name: ELEMENT_NAMES.lNode, visible: true, items: [] }
]

const columns = writable<Column[]>(initialColumns)

function toggleColumnVisibility(currentColumnIndex: number) {
	columns.update((columns) =>
		columns.map((column, i) =>
			i === currentColumnIndex ? { ...column, visible: !column.visible } : column
		)
	)
}

function createNewItem(
	columnName: string,
	itemCount: number
): DataTypeTemplate | null {
	const newId = (itemCount + 1).toString()

	switch (columnName) {
		case 'Voltage Level':
			return {
				id: newId,
				name: `Voltage Level ${newId}`
			} as VoltageLevelType

		case 'IED':
			return {
				id: newId,
				name: `IED ${newId}`
			} as IEDType

		case 'Bay':
			return {
				id: newId,
				name: `Bay ${newId}`
			} as BayType

		case 'Substation':
			return {
				id: newId,
				name: `Substation ${newId}`
			} as SubstationType

		case 'Logical Device':
			return {
				id: newId,
				name: `Logical Device ${newId}`
			} as LDeviceType

		default:
			return null
	}
}

function addItemToColumn(currentColumnIndex: number) {
	columns.update((columns) => {
		const column = columns[currentColumnIndex]
		const itemCount = column.items.length
		const newItem = createNewItem(column.name, itemCount)

		if (newItem) {
			return columns.map((col, i) =>
				i === currentColumnIndex ? { ...col, items: [...col.items, newItem] } : col
			)
		}

		return columns
	})
}

async function loadDataFromSCD() {
	const dataTypeTemplatesSubElements = get(
		dataTypeTemplatesStore.dataTypeTemplatesSubElements
	)

	columns.update(() => [
		{
			name: ELEMENT_NAMES.substation,
			visible: true,
			items: dataTypeTemplatesSubElements?.substations || []
		},
		{
			name: ELEMENT_NAMES.voltageLevel,
			visible: true,
			items: dataTypeTemplatesSubElements?.voltageLevels || []
		},
		{
			name: ELEMENT_NAMES.bay,
			visible: true,
			items: dataTypeTemplatesSubElements?.bays || []
		},
		{
			name: ELEMENT_NAMES.ied,
			visible: true,
			items: dataTypeTemplatesSubElements?.ieds || []
		},
		{
			name: ELEMENT_NAMES.lDevice,
			visible: true,
			items: dataTypeTemplatesSubElements?.logicalDevices || []
		},
		{ name: ELEMENT_NAMES.lNode, visible: true, items: [] }
	])
}

export const columnsStore = {
	columns,
	toggleColumnVisibility,
	addItemToColumn,
	loadDataFromSCD
}
