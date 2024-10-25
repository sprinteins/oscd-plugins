import { writable, get } from "svelte/store";
// CONSTANTS
import { ELEMENT_NAMES } from "@oscd-plugins/core";
// STORES
import { dataTypeTemplatesStore } from "./data-types-templates.store";
// TYPES
import type {
	Column,
	BayType,
	DataTypeTemplate,
	IEDType,
	LDeviceType,
	SubstationType,
	VoltageLevelType,
} from "./columns-type.store";

const initialColumns: Column[] = [
	{ id: 0, name: ELEMENT_NAMES.substation, visible: true, items: [] },
	{ id: 1, name: ELEMENT_NAMES.voltageLevel, visible: true, items: [] },
	{ id: 2, name: ELEMENT_NAMES.bay, visible: true, items: [] },
	{ id: 3, name: ELEMENT_NAMES.ied, visible: true, items: [] },
	{ id: 4, name: ELEMENT_NAMES.lDevice, visible: true, items: [] },
	{ id: 5, name: ELEMENT_NAMES.lNode, visible: true, items: [] },
];

const columns = writable<Column[]>(initialColumns);

function toggleColumnVisibility(currentColumnIndex: number) {
	columns.update((columns) =>
		columns.map((column, i) =>
			i === currentColumnIndex
				? { ...column, visible: !column.visible }
				: column,
		),
	);
}

function createNewItem(
	columnName: string,
	itemCount: number,
): DataTypeTemplate | null {
	const newId = (itemCount + 1).toString();

	switch (columnName) {
		case "Voltage Level":
			return {
				id: newId,
				name: `Voltage Level ${newId}`,
			} as VoltageLevelType;

		case "IED":
			return {
				id: newId,
				name: `IED ${newId}`,
			} as IEDType;

		case "Bay":
			return {
				id: newId,
				name: `Bay ${newId}`,
			} as BayType;

		case "Substation":
			return {
				id: newId,
				name: `Substation ${newId}`,
			} as SubstationType;

		case "Logical Device":
			return {
				id: newId,
				name: `Logical Device ${newId}`,
			} as LDeviceType;

		default:
			return null;
	}
}

function addItemToColumn(currentColumnIndex: number) {
	columns.update((columns) => {
		const column = columns[currentColumnIndex];
		const itemCount = column.items.length;
		const newItem = createNewItem(column.name, itemCount);

		if (newItem) {
			return columns.map((col, i) =>
				i === currentColumnIndex
					? { ...col, items: [...col.items, newItem] }
					: col,
			);
		}

		return columns;
	});
}

async function loadDataFromSCD() {
	const dataTypeTemplatesSubElements = get(
		dataTypeTemplatesStore.dataTypeTemplatesSubElements,
	);

	columns.update(() => [
		{
			id: 0,
			name: ELEMENT_NAMES.substation,
			visible: true,
			items: dataTypeTemplatesSubElements?.substations || [],
		},
		{
			id: 1,
			name: ELEMENT_NAMES.voltageLevel,
			visible: true,
			items: dataTypeTemplatesSubElements?.voltageLevels || [],
		},
		{
			id: 2,
			name: ELEMENT_NAMES.bay,
			visible: true,
			items: dataTypeTemplatesSubElements?.bays || [],
		},
		{
			id: 3,
			name: ELEMENT_NAMES.ied,
			visible: true,
			items: dataTypeTemplatesSubElements?.ieds || [],
		},
		{
			id: 4,
			name: ELEMENT_NAMES.lDevice,
			visible: true,
			items: dataTypeTemplatesSubElements?.logicalDevices || [],
		},
		{ id: 5, name: ELEMENT_NAMES.lNode, visible: true, items: [] },
	]);
}

export const columnsStore = {
	columns,
	toggleColumnVisibility,
	addItemToColumn,
	loadDataFromSCD,
};
