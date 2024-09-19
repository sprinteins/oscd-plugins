export type DataTypeTemplates = {
}

export type LDeviceType = {
	id: string
	desc: string
	inst: string
}

export type BayType = {
	id: string
	name: string
	desc: string
}

export type IEDType = {
	id: string
	name: string
	originalSclRevision: string
	originalSclVersion: string
	owner: string
	configVersion: string
	desc: string
	manufacturer: string
	type: string
}

export type VoltageLevelType = {
	id: string
	name: string
	desc: string
	nomFreq: string
	numPhases: string
}

export type SubstationType = {
    id: string
    name: string
    desc: string
}