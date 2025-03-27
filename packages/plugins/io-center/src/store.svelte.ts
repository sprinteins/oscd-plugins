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
	//Multiple Selection "Disabled for now" 
	//selectedDataObjects: ObjectNodeDataObject[] = $state([])
	selectedDataObject: ObjectNodeDataObject | null = $state(null)
	dataObjects: DataObject[] = $state([])
	objectTree: ObjectTree = $state(NullObjectTree)

	logicalConditioners: LogicalConditioner[] = $state([])
	public findLC(type: string, instance: string) {
		return this.logicalConditioners.find(lc => lc.type === type && lc.instance === instance)
	}


	connections = $state<Connection[]>([])
	public resetConnections(_: unknown) {
		this.connections = []
	}
	public connectionExistsFor(lp: LpElement) {
		return this.connections.some(connection => connection.to.name.includes(`${lp.type}-${lp.instance}`))
	}

	// 
	// #region Logical Physicals
	// 
	lpList: LpElement[] = $state([])
	_selectedLogicalPhysicals: LpElement[] = $state([])
	selectedLogicalPhysicals: LpElement[] = $derived([...this._selectedLogicalPhysicals])
	public findLP(type: string, instance: string) {
		return this.lpList.find(lp => lp.type === type && lp.instance === instance)
	}
	public selectLP(lp: LpElement) {
		this._selectedLogicalPhysicals.push(lp)
	}
	public deselectLP(element: LpElement) {
		this._selectedLogicalPhysicals = this._selectedLogicalPhysicals.filter((item) => item.id !== element.id);
	}
	public isLPSelected(lp: LpElement) {
		return this._selectedLogicalPhysicals.some((selectedLP) => selectedLP.id === lp.id)
	}
	public toggleElementSelection(element: LpElement) {
		if (this.isLPSelected(element)) {
			this.deselectLP(element);
		} else {
			this.selectLP(element);
		}
	}

}

export const store = new Store()
