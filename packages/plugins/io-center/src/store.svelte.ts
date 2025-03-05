import type { IED } from "./ied/ied";
import type { Nullable } from "./types";
import type { LpElement } from "./ui/components/lp-list/types.lp-list";
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";


const store = $state({
	doc: null as Nullable<XMLDocument>,
	iedList: [] as IED[],
	iedSelected: null as Nullable<IED>,
	objectTree: [] as TreeNode[],
	lpList: [] as LpElement[],
})

export type StoreType = typeof store

export default {
	get doc() { return store.doc },
	set doc(value: Nullable<XMLDocument>) { store.doc = value },

	get iedList() { return store.iedList },
	set iedList(value: IED[]) { store.iedList = value },

	get iedSelected() { return store.iedSelected },
	set iedSelected(value: Nullable<IED>) { store.iedSelected = value },

	get objectTree() { return store.objectTree },
	set objectTree(value: TreeNode[]) { store.objectTree = value },

	get lpList() { return store.lpList },
	set lpList(value: LpElement[]) { store.lpList = value }
}
