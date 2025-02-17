import type { NODE_TYPE } from "@/headless/constants"

export type ObjectTree = TreeNode[]

export type TreeNode = {
	id: string,
	name: string
	type: keyof typeof NODE_TYPE
	isOpen?: boolean
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
