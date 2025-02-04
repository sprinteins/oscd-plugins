
export type ObjectTree = {
	logicalDevices: LogicalDevice[]
}

export type LogicalDevice = {
	logicalNodes: LogicalNode[]
}

export type LogicalNode = {
	dataObjectInstances: DataObjectInstance[]
}

export type DataObjectInstance = {
	name: string
}