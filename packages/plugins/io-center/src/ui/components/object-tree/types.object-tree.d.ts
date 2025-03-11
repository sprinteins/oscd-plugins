import type { NODE_TYPE } from "@/headless/constants"
import type { DataObject } from "../../../ied/data-object"
import type { ObjectNodeDataObject } from "../../../ied/object-tree.type"


export type TreeNode = {
	id: string,
	name: string
	type: keyof typeof NODE_TYPE
	isOpen?: boolean
	children?: TreeNode[]
	dataObject?: ObjectNodeDataObject
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
