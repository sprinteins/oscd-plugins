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
			tag: undefined
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
			tag: 'td:VoltageLevelTypeRef'
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
			tag: 'td:BayTypeRef'
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
			tag: 'td:IEDTypeRef'
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
			tag: 'td:LDeviceTypeRef'
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
			tag: 'td:LNodeTypeRef'
		}
	}
} as const
