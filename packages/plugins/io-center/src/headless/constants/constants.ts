import type {
	PortConfig,
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

export const TREE_LEVEL = {
	ied: 'IED',
	accessPoint: 'AccessPoint',
	lDevice: 'LDevice',
	lN: 'LN',
	dO: 'DO'
} as const

export const PORT_KIND = {
	dataObject: 'dataObject',
	logicalConditioner: 'logicalConditioner',
	logicalPhysical: 'logicalPhysical'
} as const

export const CONNECTION_ELEMENT_TAG_NAME = {
	dOI: 'DOI',
	lNRef: 'LNRef'
}

export const PORT_KIND_TO_ELEMENT_TAG_NAME = {
	[PORT_KIND.dataObject]: CONNECTION_ELEMENT_TAG_NAME.lNRef,
	[PORT_KIND.logicalConditioner]: CONNECTION_ELEMENT_TAG_NAME.dOI,
	[PORT_KIND.logicalPhysical]: CONNECTION_ELEMENT_TAG_NAME.lNRef
} as const

export const PORT_SIDE = {
	left: 'left',
	right: 'right'
} as const

export const LOGICAL_KIND = {
	conditioner: 'conditioner',
	physical: 'physical'
} as const

export const L_DEVICE_0_INSTANCE = 'LD0'

export const LOGICAL_PHYSICAL_CLASS = {
	LPDO: 'LPDO',
	LPDI: 'LPDI',
	LPAI: 'LPAI',
	LPAO: 'LPAO'
} as const

export const LOGICAL_CONDITIONER_CLASS = {
	LCBI: 'LCBI',
	LCBO: 'LCBO',
	LCDP: 'LCDP',
	LCIV: 'LCIV'
} as const

export const ELEMENT_WITH_REQUIRED_UUID_ATTRIBUTES = [
	'IED',
	'AccessPoint',
	'Server',
	'LDevice',
	'LN',
	'DOI',
	'LNRef'
] as const

export const L_NODE_TYPE_CONTENT = {
	LCBI: `
        <DO name="NamPlt" type="LPL"/>
        <DO name="OutInd" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="Mod" type="ENC"/>
        <DO name="ActHi" type="SPG"/>
        <DO name="InvOut" type="SPG"/>
        <DO name="OscNum" type="ING"/>
        <DO name="OscTm" type="ING"/>
        <DO name="PlsDur" type="ING"/>
        <DO name="InRef" type="ORG"/>
    `,
	LCBO: `
        <DO name="NamPlt" type="LPL"/>
        <DO name="OutInd" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="LatchRs" type="SPC"/>
        <DO name="Mod" type="ENC"/>
        <DO name="DlDropout" type="ING"/>
        <DO name="Dwell" type="SPG"/>
        <DO name="InvOut" type="SPG"/>
        <DO name="Latch" type="SPG"/>
        <DO name="MaxPlsDur" type="ING"/>
        <DO name="MinPlsDur" type="ING"/>
        <DO name="InRef" type="ORG"/>
    `,
	LCDP: '<DO name="OutPos" type="DPS"/>',
	LCIV: '<DO name="OutPos" type="INS"/>',
	LPDO: `
        <DO name="BrdRef" type="VSD"/>
        <DO name="DsgOutCom" type="VSD"/>
        <DO name="DsgOutSig" type="VSD"/>
        <DO name="FctOutCom" type="VSD"/>
        <DO name="FctOutSig" type="VSD"/>
        <DO name="OutNam" type="VSD"/>
        <DO name="OutOffCap" type="VSD"/>
        <DO name="OutOnCap" type="VSD"/>
        <DO name="OutRefDsg" type="VSD"/>
        <DO name="NamPlt" type="LPL"/>
        <DO name="RdbSt" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="Mod" type="ENC"/>
        <DO name="FastOut" type="SPG"/>
        <DO name="OutOffDl" type="ASG"/>
        <DO name="OutOnDl" type="ASG"/>
        <DO name="OutTyp" type="ENG"/>
        <DO name="InRef" type="ORG"/>
    `,
	LPDI: `
        <DO name="BrdRef" type="VSD"/>
        <DO name="DsgInpCom" type="VSD"/>
        <DO name="DsgInpSig" type="VSD"/>
        <DO name="FctInpCom" type="VSD"/>
        <DO name="FctInpSig" type="VSD"/>
        <DO name="InpNam" type="VSD"/>
        <DO name="InpRefDsg" type="VSD"/>
        <DO name="NamPlt" type="LPL"/>
        <DO name="In" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="Mod" type="ENC"/>
        <DO name="DebTm" type="ING"/>
        <DO name="OscNum" type="ING"/>
        <DO name="OscTm" type="ING"/>
        <DO name="VlnOff" type="ASG"/>
        <DO name="VlnOn" type="ASG"/>
        <DO name="VlnTyp" type="ENG"/>
        <DO name="InRef" type="ORG"/>
    `,
	LPAI: '<DO name="Ind" type="SPS"/>',
	LPAO: '<DO name="Ind" type="SPS"/>'
} as const

export const L_NODE_TYPE_HELPER_TEXT =
	'The selected type has no matching LNodeType, which will be created automatically, or you can create one using the Template Plugin.'

export const PORTS_CONFIG_PER_CLASS = {
	LCBI: [
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.dataObject,
				side: PORT_SIDE.right
			},
			name: 'OutInd',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		},
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.logicalPhysical,
				side: PORT_SIDE.left
			},
			name: 'In',
			side: PORT_SIDE.right,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LCBO: [
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.dataObject,
				side: PORT_SIDE.right
			},
			name: 'In',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		},
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.logicalPhysical,
				side: PORT_SIDE.left
			},
			name: 'OutInd',
			side: PORT_SIDE.right,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LCDP: [
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.dataObject,
				side: PORT_SIDE.right
			},
			name: 'OutPos',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		},
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.logicalPhysical,
				side: PORT_SIDE.left
			},
			name: 'InOn',
			side: PORT_SIDE.right,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		},
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.logicalPhysical,
				side: PORT_SIDE.left
			},
			name: 'InOff',
			side: PORT_SIDE.right,
			index: 1,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LCIV: [
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.dataObject,
				side: PORT_SIDE.right
			},
			name: 'OutInd',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		},
		{
			kind: PORT_KIND.logicalConditioner,
			allowedTarget: {
				kind: PORT_KIND.logicalPhysical,
				side: PORT_SIDE.left
			},
			name: 'In',
			side: PORT_SIDE.right,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LPDO: [
		{
			kind: PORT_KIND.logicalPhysical,
			allowedTarget: {
				kind: PORT_KIND.logicalConditioner,
				side: PORT_SIDE.right
			},
			name: 'In',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LPDI: [
		{
			kind: PORT_KIND.logicalPhysical,
			allowedTarget: {
				kind: PORT_KIND.logicalConditioner,
				side: PORT_SIDE.right
			},
			name: 'Ind',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LPAI: [
		{
			kind: PORT_KIND.logicalPhysical,
			allowedTarget: {
				kind: PORT_KIND.logicalConditioner,
				side: PORT_SIDE.right
			},
			name: 'Ind',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	],
	LPAO: [
		{
			kind: PORT_KIND.logicalPhysical,
			allowedTarget: {
				kind: PORT_KIND.logicalConditioner,
				side: PORT_SIDE.right
			},
			name: 'Ind',
			side: PORT_SIDE.left,
			index: 0,
			payload: {
				uuid: '',
				ldInst: L_DEVICE_0_INSTANCE,
				lnUuid: '',
				lnClass: '',
				lnInst: ''
			}
		}
	]
} as const satisfies Record<
	LogicalConditionerClass | LogicalPhysicalClass,
	PortConfig[]
>

export const ALLOWED_LOGICAL_CONDITIONER_CLASS_BY_CDC = {
	dps: [LOGICAL_CONDITIONER_CLASS.LCDP],
	sps: [LOGICAL_CONDITIONER_CLASS.LCBI, LOGICAL_CONDITIONER_CLASS.LCBO]
} as const

// TARGET_CDC: Only data objects with a cdc attribute included in targetCdc will be collected from the SCD document
// Currently hard-coded per client request but in future we may make it dynamic and allow the user to fill the targetScd
export const TARGET_CDC_TYPES = [
	'dps',
	'sps',
	'dpc',
	'spc',
	'ins',
	'ens'
] as const
