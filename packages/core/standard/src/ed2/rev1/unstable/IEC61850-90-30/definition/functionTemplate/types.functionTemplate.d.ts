import type { IEC61850_90_30 } from '../../global'
import type { Equipment, Substation } from '../substation'

export namespace FunctionTemplate {
	export type Root = Substation.LNodeContainer & {
		tag: 'FunctionTemplate'
		attributes: {
			type?: string
		}
		subElements: {
			subFunctionTemplate: SubFunctionTemplate[]
			generalEquipment: Equipment.GeneralEquipment[]
			conductingEquipment: Equipment.ConductingEquipment[]
		}
	}

	export type SubFunctionTemplate = Substation.LNodeContainer & {
		tag: 'SubFunctionTemplate'
		attributes: {
			uuid: string
		}
		subElements: {
			subFunctionTemplate: SubFunctionTemplate[]
			generalEquipment: Equipment.GeneralEquipment[]
			conductingEquipment: Equipment.ConductingEquipment[]
		}
	}
}
