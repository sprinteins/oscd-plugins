export const BASE_STANDARD_ATTRIBUTES = ['id', 'name', 'desc'] as const

export const SCD_ELEMENTS = {
	substation: {
		element: {
			tag: 'Substation',
			name: 'Substation',
			standardAttributes: [...BASE_STANDARD_ATTRIBUTES],
			customAttributes: []
		},
		type: {
			tag: 'td:SubstationType',
			baseName: 'SubstationType_',
			baseId: 'substation-type-',
			insertBefore: 'voltageLevelTypes'
		},
		typeRef: {
			tag: undefined,
			to: undefined,
			from: 'voltageLevel'
		}
	},
	voltageLevel: {
		element: {
			tag: 'VoltageLevel',
			name: 'Voltage Level',
			standardAttributes: [
				...BASE_STANDARD_ATTRIBUTES,
				'nomFreq',
				'numPhases'
			],
			customAttributes: []
		},
		type: {
			tag: 'td:VoltageLevelType',
			baseName: 'VoltageLevelType_',
			baseId: 'voltage-level-type-',
			insertBefore: 'bayTypes'
		},
		typeRef: {
			tag: 'td:VoltageLevelTypeRef',
			to: 'substation',
			from: 'bay'
		}
	},
	bay: {
		element: {
			tag: 'Bay',
			name: 'Bay',
			standardAttributes: [...BASE_STANDARD_ATTRIBUTES],
			customAttributes: []
		},
		type: {
			tag: 'td:BayType',
			baseName: 'BayType_',
			baseId: 'bay-type-',
			insertBefore: 'iedTypes'
		},
		typeRef: {
			tag: 'td:BayTypeRef',
			to: 'voltageLevel',
			from: 'ied'
		}
	},
	ied: {
		element: {
			tag: 'IED',
			name: 'IED',
			standardAttributes: [
				...BASE_STANDARD_ATTRIBUTES,
				'originalSclRevision',
				'originalSclVersion',
				'configVersion',
				'owner',
				'manufacturer',
				'type'
			],
			customAttributes: []
		},
		type: {
			tag: 'td:IEDType',
			baseName: 'IEDType_',
			baseId: 'ied-type-',
			insertBefore: 'lDeviceTypes'
		},
		typeRef: {
			tag: 'td:IEDTypeRef',
			to: 'bay',
			from: 'lDevice'
		}
	},
	lDevice: {
		element: {
			tag: 'LDevice',
			name: 'Logical Device',
			standardAttributes: [...BASE_STANDARD_ATTRIBUTES, 'inst'],
			customAttributes: []
		},
		type: {
			tag: 'td:LDeviceType',
			baseName: 'LDeviceType_',
			baseId: 'ldevice-type-',
			insertBefore: undefined
		},
		typeRef: {
			tag: 'td:LDeviceTypeRef',
			to: 'ied',
			from: 'lNode'
		}
	},
	lNode: {
		element: {
			tag: 'LNode',
			name: 'Logical Node',
			standardAttributes: [...BASE_STANDARD_ATTRIBUTES, 'lnClass'],
			customAttributes: []
		},
		type: {
			tag: 'LNodeType',
			baseName: 'LNodeType_',
			baseId: 'lnode-type-',
			insertBefore: undefined
		},
		typeRef: {
			tag: 'td:LNodeTypeRef',
			to: 'lDevice',
			from: undefined
		}
	},
	reportControl: {
		element: {
			tag: 'ReportControl',
			name: 'Report Control',
			standardAttributes: [
				...BASE_STANDARD_ATTRIBUTES,
				'confRev',
				'datSet',
				'intgPd',
				'buffered',
				'bufTime',
				'indexed',
				'rptID'
			],
			customAttributes: []
		},
		type: undefined,
		typeRef: undefined
	},
	clientLN: {
		element: {
			tag: 'ClientLN',
			name: 'Client LNode',
			standardAttributes: [
				...BASE_STANDARD_ATTRIBUTES,
				'iedName',
				'ldInst',
				'prefix',
				'lnClass',
				'lnInst'
			],
			customAttributes: []
		},
		type: undefined,
		typeRef: undefined
	},
	inputs: {
		element: {
			tag: 'Inputs',
			name: 'Inputs',
			standardAttributes: [],
			customAttributes: []
		},
		type: undefined,
		typeRef: undefined
	},
	extRef: {
		element: {
			tag: 'ExtRef',
			name: 'External Reference',
			standardAttributes: [
				'iedName',
				'serviceType',
				'ldInst',
				'lnClass',
				'lnInst',
				'prefix',
				'doName',
				'daName',
				'srcLDInst',
				'srcPrefix',
				'srcCBName',
				'intAddr'
			],
			customAttributes: []
		},
		type: undefined,
		typeRef: undefined
	},
	gseControl: {
		element: {
			tag: 'GSEControl',
			name: 'GSE Control',
			standaAttributes: [
				'appID',
				'datSet',
				'confRev',
				'fixedOffs',
				'type'
			],
			customAttributes: []
		},
		type: undefined,
		typeRef: undefined
	}
} as const
