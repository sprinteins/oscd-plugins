export const TYPE_FAMILY_MAP = {
	bay: 'bay',
	generalEquipmentType: 'generalEquipmentType',
	conductingEquipmentType: 'conductingEquipmentType',
	functionTemplate: 'functionTemplate',
	lNodeType: 'lNodeType'
} as const

export const REF_FAMILY_MAP = {
	generalEquipment: 'generalEquipment',
	conductingEquipment: 'conductingEquipment',
	function: 'function',
	eqFunction: 'eqFunction',
	lNode: 'lNode'
} as const

export const COLUMNS = {
	bay: 'bay',
	equipmentTypeTemplates: 'equipmentTypeTemplates',
	functionTemplate: 'functionTemplate',
	lNodeType: 'lNodeType'
} as const

export const KIND = {
	custom: 'custom',
	standard: 'standard',
	unstable: 'unstable'
} as const

export const READONLY_ATTRIBUTES = ['id', 'uuid', 'originUuid'] as const

//====== MAPPERS ======//

export const TYPE_FAMILY_TO_COLUMN_KEY = {
	[TYPE_FAMILY_MAP.bay]: COLUMNS.bay,
	[TYPE_FAMILY_MAP.generalEquipmentType]: COLUMNS.equipmentTypeTemplates,
	[TYPE_FAMILY_MAP.conductingEquipmentType]: COLUMNS.equipmentTypeTemplates,
	[TYPE_FAMILY_MAP.functionTemplate]: COLUMNS.functionTemplate,
	[TYPE_FAMILY_MAP.lNodeType]: COLUMNS.lNodeType
} as const

export const TYPE_FAMILY_TO_REF_FAMILY_MAP = {
	[TYPE_FAMILY_MAP.generalEquipmentType]: REF_FAMILY_MAP.generalEquipment,
	[TYPE_FAMILY_MAP.conductingEquipmentType]:
		REF_FAMILY_MAP.conductingEquipment,
	[TYPE_FAMILY_MAP.functionTemplate]: [
		REF_FAMILY_MAP.function,
		REF_FAMILY_MAP.eqFunction
	],
	[TYPE_FAMILY_MAP.lNodeType]: REF_FAMILY_MAP.lNode
} as const

export const REF_FAMILY_TO_TYPE_FAMILY_MAP = {
	[REF_FAMILY_MAP.generalEquipment]: TYPE_FAMILY_MAP.generalEquipmentType,
	[REF_FAMILY_MAP.conductingEquipment]:
		TYPE_FAMILY_MAP.conductingEquipmentType,
	[REF_FAMILY_MAP.function]: TYPE_FAMILY_MAP.functionTemplate,
	[REF_FAMILY_MAP.eqFunction]: TYPE_FAMILY_MAP.functionTemplate,
	[REF_FAMILY_MAP.lNode]: TYPE_FAMILY_MAP.lNodeType
} as const

export const TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES = {
	...TYPE_FAMILY_MAP,
	// standard equivalent for custom elements
	[TYPE_FAMILY_MAP.generalEquipmentType]: 'generalEquipment',
	[TYPE_FAMILY_MAP.conductingEquipmentType]: 'conductingEquipment'
} as const

export const REF_ATTRIBUTES_KIND_BY_REF_FAMILY = {
	[REF_FAMILY_MAP.generalEquipment]: KIND.custom,
	[REF_FAMILY_MAP.conductingEquipment]: KIND.custom,
	[REF_FAMILY_MAP.function]: KIND.standard,
	[REF_FAMILY_MAP.eqFunction]: KIND.standard,
	[REF_FAMILY_MAP.lNode]: KIND.standard
} as const

export const CUSTOM_TAG_NAME_MAP = {
	[TYPE_FAMILY_MAP.generalEquipmentType]: 'GeneralEquipmentType',
	[TYPE_FAMILY_MAP.conductingEquipmentType]: 'ConductingEquipmentType'
} as const

export const ALLOWED_TARGETS_BY_REF_FAMILY = {
	[REF_FAMILY_MAP.generalEquipment]: [TYPE_FAMILY_MAP.bay],
	[REF_FAMILY_MAP.conductingEquipment]: [TYPE_FAMILY_MAP.bay],
	[REF_FAMILY_MAP.function]: [TYPE_FAMILY_MAP.bay],
	[REF_FAMILY_MAP.eqFunction]: [
		TYPE_FAMILY_MAP.conductingEquipmentType,
		TYPE_FAMILY_MAP.generalEquipmentType
	],
	[REF_FAMILY_MAP.lNode]: [TYPE_FAMILY_MAP.functionTemplate]
} as const
