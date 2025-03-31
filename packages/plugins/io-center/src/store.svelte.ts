import type { DataObject } from "./ied/data-object";
import type { IED } from "./ied/ied";
import {
	NullObjectTree,
	type ObjectNodeDataObject,
	type ObjectTree,
} from "./ied/object-tree.type.d";
import type { Nullable } from "./types";
import type { Connection, LogicalConditioner } from "./ui/components/canvas/types.canvas";
import type { LpElement } from "./ui/components/right-bar/lp-list/types.lp-list";


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

	//
	// #region Logical Conditioners
	//
	logicalConditioners: LogicalConditioner[] = $state([])
	_selectedLogicalConditioners: LogicalConditioner[] = $state([])
	selectedLogicalConditioners: LogicalConditioner[] = $derived([...this._selectedLogicalConditioners])
	public findLC(type: string, instance: string) {
		return this.logicalConditioners.find(lc => lc.type === type && lc.instance === instance)
	}
	public selectLC(lc: LogicalConditioner) {
		this._selectedLogicalConditioners.push(lc)
	}
	public deselectLC(lc: LogicalConditioner) {
		this._selectedLogicalConditioners = this._selectedLogicalConditioners.filter((item) => item.id !== lc.id);
	}
	public isLcSelected(lc: LogicalConditioner) {
		return this._selectedLogicalConditioners.some((selectedLC) => selectedLC.id === lc.id)
	}
	public toggleLcSelection(lc: LogicalConditioner) {
		if (this.isLcSelected(lc)) {
			this.deselectLC(lc);
		} else {
			this.selectLC(lc);
		}
	}


	connections = $state<Connection[]>([])
	public resetConnections(_: unknown) {
		this.connections = []
	}
	public connectionExistsFor(element: LpElement | LogicalConditioner) {
		return this.connections.some(connection => connection.to.name.includes(`${element.type}-${element.instance}`))
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
	public toggleLpElementSelection(element: LpElement) {
		if (this.isLPSelected(element)) {
			this.deselectLP(element);
		} else {
			this.selectLP(element);
		}
	}

}

export const store = new Store()
