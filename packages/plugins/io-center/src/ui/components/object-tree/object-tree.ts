
export type ObjectTree = TreeNode[]

export type TreeNode = {
	name: string
	children?: TreeNode[]
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