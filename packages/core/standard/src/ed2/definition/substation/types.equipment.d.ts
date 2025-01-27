import type { Common, UnsignedByte, AlphabetLetter } from '../shared'
import type { Substation } from './types.substation'

export namespace Equipment {
	export type GeneralEquipment = Equipment & {
		tag: 'GeneralEquipment'
		attributes: {
			type:
				| 'AXN'
				| 'BAT'
				| 'MOT'
				| 'FAN'
				| 'FIL'
				| 'PMP'
				| 'TNK'
				| 'VLV'
				| `E${AlphabetLetter}${AlphabetLetter}${string}`
		}
		subElements: {
			eqFunction?: EqFunction[]
		}
	}

	export type SubEquipment = Substation.PowerSystemResource & {
		tag: 'SubEquipment'
		attributes: {
			phase?: 'A' | 'B' | 'C' | 'N' | 'all' | 'none' | 'AB' | 'BC' | 'CA'
			virtual?: `${boolean}`
		}
		subElements: {
			eqFunction?: EqFunction[]
		}
	}

	export type ConductingEquipment = BaseConductingEquipment & {
		tag: 'ConductingEquipment'
		attributes: {
			type:
				| 'CBR'
				| 'DIS'
				| 'VTR'
				| 'CTR'
				| 'GEN'
				| 'CAP'
				| 'REA'
				| 'CON'
				| 'MOT'
				| 'EFN'
				| 'PSH'
				| 'BAT'
				| 'BSH'
				| 'CAB'
				| 'GIL'
				| 'LIN'
				| 'RES'
				| 'RRC'
				| 'SAR'
				| 'TCF'
				| 'TCR'
				| 'IFL'
				| 'FAN'
				| 'SCR'
				| 'SMC'
				| 'PMP'
				| `E${AlphabetLetter}${string}`
		}
		subElements: {
			eqFunction?: EqFunction[]
		}
	}

	export type PowerTransformer = Equipment & {
		tag: 'PowerTransformer'
		attributes: {
			name: 'PTR'
		}
		subElements: {
			transformerWinding?: TransformerWinding[]
			subEquipment?: SubEquipment[]
			eqFunction?: EqFunction[]
		}
	}

	export type TransformerWinding = BaseConductingEquipment & {
		tag: 'TransformerWinding'
		attributes: {
			name: 'PTW'
		}
		subElements: {
			tapChanger?: TapChanger
			neutralPoint?: Terminal
			eqFunction?: EqFunction[]
		}
	}

	export type TapChanger = Substation.PowerSystemResource & {
		tag: 'TapChanger'
		attributes: {
			name: 'LTC'
			virtual?: `${boolean}`
		}
		subElements: {
			subEquipment?: SubEquipment[]
			eqFunction?: EqFunction[]
		}
	}

	export type Terminal = Common.BaseElementWithDesc & {
		tag: 'Terminal'
		attributes: {
			name?: string
			connectivityNode: string
			processName?: string
			substationName?: string
			voltageLevelName?: string
			bayName?: string
			cNodeName: string
			lineName?: string
		}
	}

	//==== FUNCTIONS

	export type EqFunction = BaseEqFunction & {
		tag: 'EqFunction'
	}

	export type EqSubFunction = BaseEqFunction & {
		tag: 'EqSubFunction'
	}

	//==== BASE TYPES

	export type Equipment = Substation.PowerSystemResource & {
		attributes: {
			virtual?: `${boolean}`
		}
	}

	/** Refers to tEquipmentContainer */
	export type EquipmentContainer = Substation.PowerSystemResource & {
		subElements: {
			powerTransformer?: PowerTransformer[]
			generalEquipment?: GeneralEquipment[]
		}
	}

	/** Refers to tAbstractConductingEquipment */
	export type BaseConductingEquipment = Equipment & {
		subElements: {
			terminal?: [Terminal, Terminal]
			subEquipment?: SubEquipment[]
		}
	}

	/** Refers to tAbstractEqFuncSubFunc */
	export type BaseEqFunction = Substation.PowerSystemResource & {
		attributes: {
			type?: string
		}
		subElements: {
			generalEquipment?: GeneralEquipment[]
			eqSubFunction?: EqSubFunction[]
		}
	}
}
