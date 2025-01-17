import type { Common, LNClass } from '../shared'

export namespace DataTypeTemplates {
	export type Root = {
		tag: 'DataTypeTemplates'
		attributes: Record<never, never>
		subElements: {
			lNodeType?: LNodeType[]
			dOType?: DOType[]
			dAType?: DAType[]
			enumType?: EnumType[]
		}
	}

	export type LNodeType = Common.BaseElementWithId & {
		tag: 'LNodeType'
		attributes: {
			iedType?: string
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
		}
		subElements: {
			dO?: DO[]
		}
	}

	export type DOType = Common.BaseElementWithId & {
		tag: 'DOType'
		attributes: {
			iedType?: string
			cdc:
				| 'SPS'
				| 'DPS'
				| 'INS'
				| 'ENS'
				| 'ACT'
				| 'ACD'
				| 'SEC'
				| 'BCR'
				| 'HST'
				| 'VSS'
				| 'MV'
				| 'CMV'
				| 'SAV'
				| 'WYE'
				| 'DEL'
				| 'SEQ'
				| 'HMV'
				| 'HWYE'
				| 'HDEL'
				| 'SPC'
				| 'DPC'
				| 'INC'
				| 'ENC'
				| 'BSC'
				| 'ISC'
				| 'APC'
				| 'BAC'
				| 'SPG'
				| 'ING'
				| 'ENG'
				| 'ORG'
				| 'TSG'
				| 'CUG'
				| 'VSG'
				| 'ASG'
				| 'CURVE'
				| 'CSG'
				| 'DPL'
				| 'LPL'
				| 'CSD'
				| 'CST'
				| 'BTS'
				| 'UTS'
				| 'LTS'
				| 'GTS'
				| 'MTS'
				| 'NTS'
				| 'STS'
				| 'CTS'
				| 'OTS'
				| 'VSD'
				| 'ORS'
				| 'TCS'
		}
		subElements: {
			sDO?: SDO[]
			dA?: DA[]
		}
	}

	export type DAType = Common.BaseElementWithId & {
		tag: 'DAType'
		attributes: {
			iedType?: string
		}
		subElements: {
			bDA?: BDA[]
			protNs?: ProtNs[]
		}
	}

	export type EnumType = Common.BaseElementWithId & {
		tag: 'EnumType'
		subElements: {
			enumVal?: EnumVal[]
		}
	}

	//==== SUB ELEMENTS

	export type DO = Common.BaseElementWithDesc & {
		tag: 'DO'
		attributes: {
			name: string
			type: string
			accessControl?: string
			transient?: `${boolean}`
		}
	}

	export type SDO = Common.BaseElementWithDesc & {
		tag: 'SDO'
		attributes: {
			name: string
			type: string
			count?: string
		}
	}

	export type DA = Common.BaseDataAttribute & {
		tag: 'DA'
		attributes: {
			dchg?: `${boolean}`
			qchg?: `${boolean}`
			dupd?: `${boolean}`
			fc:
				| 'ST'
				| 'MX'
				| 'CO'
				| 'SP'
				| 'SG'
				| 'SE'
				| 'SV'
				| 'CF'
				| 'DC'
				| 'EX'
				| 'SR'
				| 'BL'
				| 'OR'
		}
		subElements: {
			protNs?: ProtNs[]
		}
	}

	export type BDA = Common.BaseDataAttribute & {
		tag: 'BDA'
	}

	export type ProtNs = {
		tag: 'ProtNs'
		attributes: {
			type?: '8-MMS' | string
		}
		subElements: Record<never, never>
	}

	export type Val = Common.BaseElementWithDesc & {
		tag: 'Val'
		attributes: {
			sGroup?: `${number}`
		}
	}

	export type EnumVal = {
		tag: 'EnumVal'
		attributes: {
			ord: `${number}`
			desc?: string
		}
		subElements: Record<never, never>
	}

	//==== BASE TYPES

	export type BaseAttributeName =
		| string
		| 'T'
		| 'Test'
		| 'Check'
		| 'SIUnit'
		| 'Oper'
		| 'SBO'
		| 'SBOw'
		| 'Cancel'
		| 'Addr'
		| 'PRIORITY'
		| 'VID'
		| 'APPID'
		| 'TransportInUse'
		| 'IPClassOfTraffic'
		| 'IPv6FlowLabel'
		| 'IPAddressLength'
		| 'IPAddress'

	export type BaseDataAttribute = Common.BaseElementWithDesc & {
		attributes: {
			name: BaseAttributeName
			sAddr?: string
			bType:
				| 'BOOLEAN'
				| 'INT8'
				| 'INT16'
				| 'INT24'
				| 'INT32'
				| 'INT64'
				| 'INT128'
				| 'INT8U'
				| 'INT16U'
				| 'INT24U'
				| 'INT32U'
				| 'FLOAT32'
				| 'FLOAT64'
				| 'Enum'
				| 'Dbpos'
				| 'Tcmd'
				| 'Quality'
				| 'Timestamp'
				| 'VisString32'
				| 'VisString64'
				| 'VisString65'
				| 'VisString129'
				| 'VisString255'
				| 'Octet64'
				| 'Unicode255'
				| 'Struct'
				| 'EntryTime'
				| 'Check'
				| 'ObjRef'
				| 'Currency'
				| 'PhyComAddr'
				| 'TrgOps'
				| 'OptFlds'
				| 'SvOptFlds'
				| 'LogOptFlds'
				| 'EntryID'
				| 'Octet6'
				| 'Octet16'
			valKind?: 'Spec' | 'Conf' | 'RO' | 'Set'
			type?: string
			count?: BaseAttributeName
			valImport?: `${boolean}`
		}
		subElements: {
			val?: Val[]
		}
	}
}
