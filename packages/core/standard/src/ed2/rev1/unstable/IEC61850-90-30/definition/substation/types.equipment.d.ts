import type { Substation } from './types.substation'

export namespace Equipment {
	// Mock used by FunctionTemplate
	export type GeneralEquipment = Substation.LNodeContainer & {
		tag: 'GeneralEquipment'
	}

	// Mock used by FunctionTemplate
	export type ConductingEquipment = Substation.LNodeContainer & {
		tag: 'ConductingEquipment'
	}
}
