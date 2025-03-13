import { NODE_TYPE } from "../../../headless/constants/constants";
import type { ObjectNodeDataObject } from "../../../ied/object-tree.type";
import type { TreeNode as TreeNodeType } from "./types.object-tree";

/**
* gatherDataObjects is recursive
* @param children
*/
export function gatherDataObjects(children: TreeNodeType[]){
	const dataObjects: ObjectNodeDataObject[] = children.map( (child) => {
		if(child.type === NODE_TYPE.dataObjectInstance){
			return child.dataObject
		}
		if(child.children && child.children.length > 0){
			return gatherDataObjects(child.children)
		}

	})
	.filter(Boolean)
	.flat() as ObjectNodeDataObject[]

	return dataObjects
}