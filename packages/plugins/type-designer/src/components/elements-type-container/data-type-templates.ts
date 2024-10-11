import type { BayElementAttributes, IEDElementAttributes, LDeviceElementAttributes, SubstationElementAttributes, VoltageLevelElementAttributes } from "@oscd-plugins/core";

export type DataTypeTemplate = {
	id: string;
	name: string;
	desc: string;
};

export type LDeviceType = DataTypeTemplate & LDeviceElementAttributes
export type BayType = DataTypeTemplate & BayElementAttributes
export type IEDType = DataTypeTemplate & IEDElementAttributes;
export type VoltageLevelType = DataTypeTemplate & VoltageLevelElementAttributes;
export type SubstationType = DataTypeTemplate & SubstationElementAttributes;
