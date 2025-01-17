import type { Common, UnsignedByte, LNClass } from '../shared'
import type { Equipment } from './types.equipment'

export namespace Substation {
	export type Root = {
		tag: 'Substation'
		attributes: Record<never, never>
		subElements: {
			voltageLevel?: VoltageLevel[]
			function?: Function[]
		}
	}

	export type VoltageLevel = Equipment.EquipmentContainer & {
		tag: 'VoltageLevel'
		attributes: {
			nomFreq?: `${number}`
			numPhases?: `${UnsignedByte}`
		}
		subElements: {
			voltage?: Voltage
			bay?: Bay[]
			function?: Function[]
		}
	}

	export type Function = PowerSystemResource & {
		tag: 'Function'
		attributes: {
			type?: string
		}
		subElements: {
			subFunction?: SubFunction[]
			generalEquipment?: Equipment.GeneralEquipment[]
			conductingEquipment?: Equipment.ConductingEquipment[]
		}
	}

	//==== SUB ELEMENTS

	export type SubFunction = PowerSystemResource & {
		tag: 'SubFunction'
		attributes: {
			type?: string
		}
		subElements: {
			subFunction?: SubFunction[]
			generalEquipment?: Equipment.GeneralEquipment[]
			conductingEquipment?: Equipment.ConductingEquipment[]
		}
	}

	export type Voltage = Common.BaseElementWithDesc & {
		tag: 'Voltage'
		attributes: {
			unit: 'V'
			multiplier?:
				| ''
				| 'm'
				| 'k'
				| 'M'
				| 'mu'
				| 'y'
				| 'z'
				| 'a'
				| 'f'
				| 'p'
				| 'n'
				| 'c'
				| 'd'
				| 'da'
				| 'h'
				| 'G'
				| 'T'
				| 'P'
				| 'E'
				| 'Z'
				| 'Y'
		}
	}

	export type Bay = Equipment.EquipmentContainer & {
		tag: 'Bay'
		attributes: {
			name: string
		}
		subElements: {
			conductingEquipment?: Equipment.ConductingEquipment[]
			connectivityNode?: ConnectivityNode[]
			function?: Function[]
		}
	}

	export type ConnectivityNode = PowerSystemResource & {
		tag: 'ConnectivityNode'
		attributes: {
			pathName: string
		}
		subElements: Record<never, never>
	}

	export type LNode = {
		tag: 'LNode'
		attributes: {
			iedName?: string | 'None'
			ldInst?: string
			prefix?: string
			lnClass:
				| LNClass.SystemGroup
				| LNClass.DomainGroupA
				| LNClass.DomainGroupC
				| LNClass.DomainGroupF
				| LNClass.DomainGroupG
				| LNClass.DomainGroupI
				| LNClass.DomainGroupK
				| LNClass.DomainGroupM
				| LNClass.DomainGroupP
				| LNClass.DomainGroupQ
				| LNClass.DomainGroupR
				| LNClass.DomainGroupS
				| LNClass.DomainGroupT
				| LNClass.DomainGroupX
				| LNClass.DomainGroupY
				| LNClass.DomainGroupZ
			lnInst?: string
			lnType?: string
		}
		subElements: Record<never, never>
	}

	//==== CONTAINERS

	/** Abtraction to LNodeContainer */
	export type PowerSystemResource = Common.BaseElementWithName & {
		subElements: {
			lNode?: LNode[]
		}
	}
}
