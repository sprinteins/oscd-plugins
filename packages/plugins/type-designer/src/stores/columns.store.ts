import { writable, get } from 'svelte/store'
// CONSTANTS
import { ELEMENT_NAMES } from '@oscd-plugins/core'
// STORES
import { dataTypeTemplatesStore } from './data-types-templates.store'
// TYPES
import type {
	Column,
	BayType,
	DataTypeTemplate,
	IEDType,
	LDeviceType,
	SubstationType,
	VoltageLevelType
} from './columns-type.store'

//==== FOREIGN STORES

const dataTypeTemplatesSubElements = get(
	dataTypeTemplatesStore.dataTypeTemplatesSubElements
)
//==== INIT STATE

const initialColumns: Column[] = [
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
]

//==== STATE
const columns = writable<Column[]>(initialColumns)

//==== PRIVATE ACTIONS

const toggleColumnVisibility = (index: number) => {
	columns.update((columns) =>
		columns.map((column, i) =>
			i === index ? { ...column, visible: !column.visible } : column
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

const addItemToColumn = (index: number) => {
	columns.update((columns) => {
		const column = columns[index]
		const itemCount = column.items.length
		const newItem = createNewItem(column.name, itemCount)

		if (newItem) {
			return columns.map((col, i) =>
				i === index ? { ...col, items: [...col.items, newItem] } : col
			)
		}

		return columns
	})
}

export const columnsStore = {
	//state
	columns,
	//actions
	toggleColumnVisibility,
	addItemToColumn
}
