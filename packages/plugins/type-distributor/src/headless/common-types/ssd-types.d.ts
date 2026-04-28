// Custom types for SSD parsing
export type BayType = {
	uuid: string
	name: string
	desc?: string
	conductingEquipments: ConductingEquipmentType[]
	generalEquipments: GeneralEquipmentType[]
	functions: FunctionType[]
}

export type BayTypeWithTemplates = BayType & {
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
	generalEquipmentTemplates: GeneralEquipmentTemplate[]
	functionTemplates: FunctionTemplate[]
	conductingEquipmentTemplateMap: Map<string, ConductingEquipmentTemplate>
	generalEquipmentTemplateMap: Map<string, GeneralEquipmentTemplate>
	functionTemplateMap: Map<string, FunctionTemplate>
}

export type ConductingEquipmentType = {
	uuid: string
	templateUuid: string
	virtual?: boolean
}

export type FunctionType = {
	uuid: string
	templateUuid: string
}

export type GeneralEquipmentType = {
	uuid: string
	templateUuid: string
	virtual?: boolean
}

// TEMPLATE section
export type ConductingEquipmentTemplate = {
	uuid: string
	name: string
	type: string
	desc?: string
	virtual?: boolean
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

export type GeneralEquipmentTemplate = {
	uuid: string
	name: string
	type: string
	desc?: string
	virtual?: boolean
	eqFunctions: EqFunctionTemplate[]
}

export type FunctionTemplate = {
	uuid: string
	name: string
	type?: string
	desc?: string
	lnodes: LNodeTemplate[]
}

export type LNodeTemplate = {
	uuid?: string
	lnClass: string
	lnType: string
	lnInst: string
	iedName?: string
	ldInst?: string
	prefix?: string
}

export type LDeviceData = {
	ldInst: string
	lNodes: LNodeTemplate[]
}

export type AssignableTemplates =
	| EqFunctionTemplate
	| FunctionTemplate
	| LNodeTemplate // GeneralEqupipment

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
	subDataObjects: SubDataObject[]
	dataAttributes: DataAttribute[]
}

export type SubDataObject = {
	name: string
	type: string
	count?: string
	desc?: string
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
