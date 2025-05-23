import * as ed2 from '@oscd-plugins/core-standard/ed2'

// EQUIPMENTS

export const GENERAL_EQUIPMENTS = ed2.rev1.stable.GENERAL_EQUIPMENTS
export const CONDUCTING_EQUIPMENTS = ed2.rev1.stable.CONDUCTING_EQUIPMENTS
export const EQUIPMENTS = { ...GENERAL_EQUIPMENTS, ...CONDUCTING_EQUIPMENTS }

// TYPES AND REFS

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

export const TYPE_ID_ATTRIBUTE = {
	[TYPE_FAMILY.bay]: 'uuid',
	[TYPE_FAMILY.generalEquipment]: 'uuid',
	[TYPE_FAMILY.conductingEquipment]: 'uuid',
	[TYPE_FAMILY.function]: 'uuid',
	[TYPE_FAMILY.lNodeType]: 'id'
} as const

export const REF_FAMILY_TO_TYPE_ID_ATTRIBUTE = {
	[REF_FAMILY.generalEquipment]: 'templateUuid',
	[REF_FAMILY.conductingEquipment]: 'templateUuid',
	[REF_FAMILY.function]: 'templateUuid',
	[REF_FAMILY.eqFunction]: 'templateUuid',
	[REF_FAMILY.lNode]: 'lnType'
} as const

// COLUMNS

export const COLUMNS = {
	bayType: 'bayType',
	equipmentType: 'equipmentType',
	functionType: 'functionType',
	lNodeType: 'lNodeType'
} as const

// ATTRIBUTES
export const READONLY_ATTRIBUTES = [
	'id',
	'uuid',
	'templateUuid',
	'originUuid',
	'lnType',
	'lnClass',
	'type'
] as const

// ALLOWED

export const ALLOWED_USER_DECISIONS = [
	'proceed',
	'forceCreate',
	'cancel'
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

export const ALLOWED_TARGETS_BY_TYPE_FAMILY = {
	[TYPE_FAMILY.bay]: undefined,
	[TYPE_FAMILY.generalEquipment]: TYPE_FAMILY.bay,
	[TYPE_FAMILY.conductingEquipment]: TYPE_FAMILY.bay,
	[TYPE_FAMILY.function]: [
		TYPE_FAMILY.generalEquipment,
		TYPE_FAMILY.conductingEquipment,
		TYPE_FAMILY.bay
	],
	[TYPE_FAMILY.lNodeType]: TYPE_FAMILY.function
} as const
