import type {
	BayElementAttributes,
	IEDElementAttributes,
	LDeviceElementAttributes,
	SubstationElementAttributes,
	VoltageLevelElementAttributes,
} from "@oscd-plugins/core";

export type DataTypeTemplate = {
	id: string;
	name: string;
	desc: string;
};
export type SubstationType = DataTypeTemplate & SubstationElementAttributes;
export type VoltageLevelType = DataTypeTemplate & VoltageLevelElementAttributes;
export type BayType = DataTypeTemplate & BayElementAttributes;
export type IEDType = DataTypeTemplate & IEDElementAttributes;
export type LDeviceType = DataTypeTemplate & LDeviceElementAttributes;

// TODO
// type IsElementTypeExpanded = {
// 	isExpanded: boolean;
// };

export type DataTypeTemplates =
	| SubstationType
	| VoltageLevelType
	| BayType
	| IEDType
	| LDeviceType;

// export type ElementType = IsElementTypeExpanded & DataTypeTemplates;

export type Column = {
	name: string;
	visible: boolean;
	items: DataTypeTemplates[];
};
