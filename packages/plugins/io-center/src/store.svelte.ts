import type { IED } from "./ied/ied";
import type { LogicalConditioner } from "./ied/logical-conditioner";
import type { Nullable } from "./types";
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";


export class Store {
	editCount: number = $state(-100)
	doc: XMLDocument = $state( new DOMParser().parseFromString('<SCL></SCL>', 'application/xml') )
	iedList: IED[] = $state([])
	iedSelected: Nullable<IED> = $state(null)
	objectTree: TreeNode[] = $state([])
	logicalConditioners: LogicalConditioner[] = $state([])
}

export const store = new Store()

