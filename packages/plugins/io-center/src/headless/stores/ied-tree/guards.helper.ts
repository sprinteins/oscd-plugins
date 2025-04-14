// CONSTANTS
import { NODE_TYPE } from '@/headless/constants'
// TYPES
import type { TreeItem, DataObject } from '@/headless/stores'

export function isDataObject(treeItem: TreeItem): treeItem is DataObject {
	return (
		treeItem.level === NODE_TYPE.dO &&
		!!treeItem.objectPath &&
		!!treeItem.cdcType
	)
}
