import { writable } from 'svelte/store'
import { ELEMENT_NAMES } from '@oscd-plugins/core'
import type { DataTypeTemplates, DataTypeTemplatesService } from '@oscd-plugins/core'
import type { Column } from '../components/elements-type-container'
import { createNewItem } from '@/components/elements-type-container/create-new-item'

export function columnsStore(service: DataTypeTemplatesService) {
	const typeCluster = service.findTypeDesignerElements()

	const initialColumns: DataTypeTemplates.RootElement[] = [
		{
			name: ELEMENT_NAMES.substation,
			visible: true,
			items: typeCluster.substations
		},
		{
			name: ELEMENT_NAMES.voltageLevel,
			visible: true,
			items: typeCluster.voltageLevels
		},
		{ name: ELEMENT_NAMES.bay, visible: true, items: typeCluster.bays },
		{ name: ELEMENT_NAMES.ied, visible: true, items: typeCluster.ieds },
		{
			name: ELEMENT_NAMES.lDevice,
			visible: true,
			items: typeCluster.logicalDevices
		},
		{ name: ELEMENT_NAMES.lNode, visible: true, items: [] }
	]

	const { subscribe, update } = writable<Column[]>(initialColumns)

	function toggleColumnVisibility(currentColumnIndex: number) {
		update((columns) =>
			columns.map((column, i) =>
				i === currentColumnIndex
					? { ...column, visible: !column.visible }
					: column
			)
		)
	}

	function addItemToColumn(currentColumnIndex: number) {
		update((columns) => {
			const column = columns[currentColumnIndex]
			const itemCount = column.items.length
			const newItem = createNewItem(column.name, itemCount)

			if (newItem) {
				return columns.map((col, i) =>
					i === currentColumnIndex
						? { ...col, items: [...col.items, newItem] }
						: col
				)
			}

			return columns
		})
	}

	return {
		subscribe,
		toggleColumnVisibility,
		addItemToColumn
	}
}
