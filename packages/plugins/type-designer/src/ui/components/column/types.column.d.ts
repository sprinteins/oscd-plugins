import type {
	Columns,
	AvailableFamilies
} from '@/headless/stores/types.element-types'

export type ColumnSelect = {
	value: string
	// | 'bay'
	// | 'generalEquipment'
	// | 'conductingEquipment'
	// | 'function'
	// | 'eqFunction'
	label: string
	// 'Bay' | 'GenEq' | 'CondEq' | 'Func' | 'EqFunc'
}
export type ItemsPerFamily = Record<string, ColumnSelect[]>

export type ColumnFooter = {
	[key in Exclude<keyof Columns, 'lNodeType'>]: {
		itemsPerFamily?: ItemsPerFamily
		type: 'input' | 'select'
	}
}
