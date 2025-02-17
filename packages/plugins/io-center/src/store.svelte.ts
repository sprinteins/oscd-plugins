import type { IED } from "./ied/ied";
import type { Nullable } from "./types";
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";


const store = $state({
	doc: null as Nullable<XMLDocument>,
	iedList: [] as IED[],
	iedSelected: null as Nullable<IED>,
	objectTree: [] as TreeNode[],
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
	set objectTree(value: TreeNode[]) { store.objectTree = value }
}
