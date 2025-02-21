import type { IED } from "./ied/ied";
import type { Nullable } from "./types";
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";


export class Store {
	doc: Nullable<XMLDocument> = $state(null)
	iedList: IED[] = $state([])
	iedSelected: Nullable<IED> = $state(null)
	objectTree: TreeNode[] = $state([])
}

export const store = new Store()
