export type ObjectTree = {
	ied: ObjectNodeIED
}

export type ObjectNodeIED = {
	id: string
	name: string
	children: ObjectNodeAccessPoint[]
	_type: NodeTypes.ied
}

export type ObjectNodeAccessPoint = {
	id: string
	name: string
	children: ObjectNodeLogicalDevice[],
	objectPath: Pick<ObjectPath, 'ied'>
	_type: NodeTypes.accessPoint
}

export type ObjectNodeLogicalDevice = {
	id: string
	inst: string
	children: ObjectNodeLogicalNode[]
	objectPath: Pick<ObjectPath, 'ied' | 'accessPoint'>
	_type: NodeTypes.logicalDevice
}

export type ObjectNodeLogicalNode = {
	id: string
	lnClass: string
	inst: string
	children: ObjectNodeDataObject[]
	objectPath: Pick<ObjectPath, 'ied' | 'accessPoint' | 'lDevice'>
	_type: NodeTypes.logicalNode
}

export type ObjectNodeDataObject = {
	id: string,
	name: string,
	isLinked?: boolean,
	objectPath: ObjectPath
	_type: NodeTypes.dataObject
}

export type ObjectPath = {
	ied?: {
		id: string
		name: string
	},
	accessPoint?: {
		name: string
	}
	lDevice?: {
		id: string
		inst: string
	}
	ln?: {
		id: string
		lnClass: string
		inst: string
	}
}
export const NodeTypes = {
	ied: 'ied',
	accessPoint: 'accessPoint',
	logicalDevice: 'logicalDevice',
	logicalNode: 'logicalNode',
	dataObject: 'dataObject'
} as const
export type NodeType = typeof NodeTypes[keyof typeof NodeTypes]


export const NullObjectTree: ObjectTree = {
	ied: {
		id: '',
		name: '',
		children: [],
		_type: NodeTypes.ied,
	}
}
