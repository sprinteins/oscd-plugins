import type {
	BayType,
	DataTypeTemplate,
	IEDType,
	LDeviceType,
	SubstationType,
	VoltageLevelType,
} from "./data-type-templates";

export function createNewItem(
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
