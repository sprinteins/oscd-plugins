export type DataTypeTemplate = {
	id: string;
	name: string;
	desc: string;
};

export type LDeviceType = DataTypeTemplate & {
	name: string;
	inst: string;
};

export type BayType = DataTypeTemplate & {
	name: string;
};

export type IEDType = DataTypeTemplate & {
	name: string;
	originalSclRevision: string;
	originalSclVersion: string;
	owner: string;
	configVersion: string;
	manufacturer: string;
	type: string;
};

export type VoltageLevelType = DataTypeTemplate & {
	name: string;
	nomFreq: string;
	numPhases: string;
};

export type SubstationType = DataTypeTemplate & {
	name: string;
};
