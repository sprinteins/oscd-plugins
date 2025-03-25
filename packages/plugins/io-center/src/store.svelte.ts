import type { DataObject } from "./ied/data-object";
import type { IED } from "./ied/ied";
import {
	NullObjectTree,
	type ObjectNodeDataObject,
	type ObjectTree,
} from "./ied/object-tree.type.d";
import type { Nullable } from "./types";
import type { Connection, LogicalConditioner } from "./ui/components/canvas/types.canvas";
import type { LpElement } from "./ui/components/lp-list/types.lp-list";
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";


export class Store {
	
	// 
	// #region OpenSCD
	// 
	editCount: number = $state(-100)
	doc: XMLDocument = $state(new DOMParser().parseFromString('<SCL></SCL>', 'application/xml'))


	// 
	// #region IEDs
	// 
	iedList: IED[] = $state([])
	selectedIED: Nullable<IED> = $state(null)

	// 
	// #region Object Tree
	// 
	selectedDataObjects: ObjectNodeDataObject[] = $state([])
	dataObjects: DataObject[] = $state([])
	objectTree: TreeNode[] = $state([])
	objectTreeV2: ObjectTree = $state(NullObjectTree)
	
	logicalConditioners: LogicalConditioner[] = $state([])
	
	connections = $state<Connection[]>([])
	
	
	// 
	// #region Logical Physicals
	// 
	lpList: LpElement[] = $state([])
	_selectedLogicalPhysicals: LpElement[] = $state([])
	selectedLogicalPhysicals: LpElement[] = $derived([...this._selectedLogicalPhysicals])
	public selectLP(lp: LpElement) {
		this._selectedLogicalPhysicals.push(lp)
	}
	public deselectLP(element: LpElement){
		this._selectedLogicalPhysicals = this._selectedLogicalPhysicals.filter( (item) => item.id !== element.id );
	}
	public isLPSelected(lp: LpElement) {
		return this._selectedLogicalPhysicals.some((selectedLP) => selectedLP.id === lp.id)
	}
	public toggleElementSelection(element: LpElement) {
		if (this.isLPSelected(element)) {
            this.deselectLP(element);
        }else {
			this.selectLP(element);
		}
	}

}

export const store = new Store()
