export type ObjectTree = {
	ied: ObjectNodeIED
}

export type ObjectNodeIED = {
	id: string
	name: string
	children: ObjectNodeLogicalDevice[]
	_type: NodeTypes.ied
}

export type ObjectNodeLogicalDevice = {
	id: string
	inst: string
	children: ObjectNodeLogicalNode[]
	objectPath: Pick<ObjectPath, 'ied'>
	_type: NodeTypes.logicalDevice
}

export type ObjectNodeLogicalNode = {
	id: string
	lnClass: string
	inst: string
	children: ObjectNodeDataObject[]
	objectPath: Pick<ObjectPath, 'ied' | 'lDevice'>
	_type: NodeTypes.logicalNode
}

export type ObjectNodeDataObject = {
	id: string,
	name: string,
	objectPath: ObjectPath
	_type: NodeTypes.dataObject
}

export type ObjectPath = {
	ied?: { 
		id:string 
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
