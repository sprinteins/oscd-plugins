// Custom types for SSD parsing
export type BayType = {
	uuid: string
	name: string
	desc?: string
	conductingEquipments: ConductingEquipmentType[]
	functions: FunctionType[]
}

export type ConductingEquipmentType = {
	uuid: string
	templateUuid: string
	virtual: boolean
}

export type FunctionType = {
	uuid: string
	templateUuid: string
}

// TEMPLATE section
export type ConductingEquipmentTemplate = {
	uuid: string
	name: string
	type: string
	desc?: string
	terminals: TerminalTemplate[]
	eqFunctions: EqFunctionTemplate[]
}

export type TerminalTemplate = {
	uuid: string
	name: string
	connectivityNode: string
	cNodeName: string
}

export type EqFunctionTemplate = {
	uuid: string
	name: string
	desc?: string
	lnodes: LNodeTemplate[]
}

export type FunctionTemplate = {
	uuid: string
	name: string
	desc?: string
	lnodes: LNodeTemplate[]
}

export type LNodeTemplate = {
	uuid: string
	lnClass: string
	lnType: string
	lnInst: string
	iedName?: string
}

// Data Type Templates
export type LNodeType = {
	id: string
	lnClass: string
	iedType?: string
	desc?: string
	dataObjects: DataObject[]
}

export type DataObject = {
	name: string
	type: string
	accessControl?: string
	transient?: boolean
	desc?: string
}

export type DOType = {
	id: string
	cdc: string
	iedType?: string
	desc?: string
	dataAttributes: DataAttribute[]
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

export type DAType = {
	id: string
}

export type EnumType = {
	id: string
}
