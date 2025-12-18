// Custom domain types for SSD parsing
export type LNodeRef = {
	lnClass: string
	lnInst: string
	lnType: string
	iedName?: string
	uuid?: string
}

export type FunctionTemplate = {
	uuid: string
	name: string
	desc?: string
	lnodes: LNodeRef[]
}

export type EqFunctionTemplate = {
	uuid: string
	name: string
	desc?: string
	lnodes: LNodeRef[]
}

export type TerminalRef = {
	uuid: string
	name: string
	connectivityNode: string
	cNodeName: string
}

export type ConductingEquipmentTemplate = {
	uuid: string
	name: string
	type: string
	desc?: string
	terminals: TerminalRef[]
	eqFunctions: EqFunctionTemplate[]
}

export type BayType = {
	uuid: string
	name: string
	desc?: string
	conductingEquipments: Array<{ uuid: string; templateUuid: string }>
	functions: Array<{ uuid: string; templateUuid: string }>
}

export type DataObject = {
	name: string
	type: string
	accessControl?: string
	transient?: boolean
	desc?: string
}

export type LNodeType = {
	id: string
	lnClass: string
	iedType?: string
	desc?: string
	dataObjects: DataObject[]
}

export type DataAttribute = {
	name: string
	fc: string
	bType: string
	type?: string
	dchg?: boolean
	qchg?: boolean
	dupd?: boolean
	valKind?: string
	valImport?: boolean
	sAddr?: string
	count?: string
	desc?: string
}

export type SubDataObject = {
	name: string
	type: string
	count?: string
	desc?: string
}

export type DOType = {
	id: string
	cdc: string
	iedType?: string
	desc?: string
	dataAttributes: DataAttribute[]
}

export type BasicDataAttribute = {
	name: string
	bType: string
	type?: string
	valKind?: string
	valImport?: boolean
	sAddr?: string
	count?: string
	desc?: string
}

export type DAType = {
	id: string
}

export type EnumValue = {
	ord: string
	desc?: string
	value?: string
}

export type EnumType = {
	id: string
}