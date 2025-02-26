export const COMMON_FAMILY = {
	generalEquipment: 'generalEquipment',
	conductingEquipment: 'conductingEquipment',
	function: 'function'
} as const

export const TYPE_FAMILY = {
	...COMMON_FAMILY,
	bay: 'bay',
	lNodeType: 'lNodeType'
} as const

export const REF_FAMILY = {
	...COMMON_FAMILY,
	eqFunction: 'eqFunction',
	lNode: 'lNode'
} as const

export const COLUMNS = {
	bayType: 'bayType',
	equipmentType: 'equipmentType',
	functionType: 'functionType',
	lNodeType: 'lNodeType'
} as const

export const READONLY_ATTRIBUTES = [
	'id',
	'uuid',
	'templateUuid',
	'originUuid'
] as const

//====== MAPPERS ======//

export const COLUMN_KEY_TO_TYPE_FAMILY = {
	[COLUMNS.bayType]: TYPE_FAMILY.bay,
	[COLUMNS.equipmentType]: [
		TYPE_FAMILY.generalEquipment,
		TYPE_FAMILY.conductingEquipment
	],
	[COLUMNS.functionType]: TYPE_FAMILY.function,
	[COLUMNS.lNodeType]: TYPE_FAMILY.lNodeType
} as const

export const REF_FAMILY_TO_TYPE_FAMILY_MAP = {
	...COMMON_FAMILY,
	[REF_FAMILY.eqFunction]: TYPE_FAMILY.function,
	[REF_FAMILY.lNode]: TYPE_FAMILY.lNodeType
} as const

export const ALLOWED_TARGETS_BY_REF_FAMILY = {
	[REF_FAMILY.generalEquipment]: [TYPE_FAMILY.bay],
	[REF_FAMILY.conductingEquipment]: [TYPE_FAMILY.bay],
	[REF_FAMILY.function]: [TYPE_FAMILY.bay],
	[REF_FAMILY.eqFunction]: [
		TYPE_FAMILY.conductingEquipment,
		TYPE_FAMILY.generalEquipment
	],
	[REF_FAMILY.lNode]: [TYPE_FAMILY.function]
} as const
