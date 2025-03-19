import type { DataObject } from "./ied/data-object";
import type { IED } from "./ied/ied";
import {
	NullObjectTree,
	type ObjectNodeDataObject,
	type ObjectTree,
} from "./ied/object-tree.type.d";
import type { Nullable } from "./types";
import type { LogicalConditioner } from "./ui/components/canvas/types.canvas";
import type { LpElement } from "./ui/components/lp-list/types.lp-list";
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";


export class Store {
	editCount: number = $state(-100)
	doc: XMLDocument = $state(new DOMParser().parseFromString('<SCL></SCL>', 'application/xml'))
	iedList: IED[] = $state([])
	selectedIED: Nullable<IED> = $state(null)
	selectedDataObjects: ObjectNodeDataObject[] = $state([])
	selectedLogicalPhysicals: LpElement[] = $state([])
	lpList: LpElement[] = $state([])
	dataObjects: DataObject[] = $state([])
	objectTree: TreeNode[] = $state([])
	objectTreeV2: ObjectTree = $state(NullObjectTree)
	logicalConditioners: LogicalConditioner[] = $state([])
}

export const store = new Store()