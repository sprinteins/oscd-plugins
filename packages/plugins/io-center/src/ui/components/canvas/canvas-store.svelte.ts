import type { ConnectionPort, LogicalConditioner, NodeElement, NodeElementType } from "./types.canvas"
import { store } from "../../../store.svelte"
import type { ObjectNodeDataObject } from "../../../ied/object-tree.type"
import type { LpElement } from "../lp-list/types.lp-list"
import { NODE_ELEMENT_TYPE, NODE_TYPE } from "@/headless/constants"

class Store {
	dataObjects = $derived<NodeElement[]>(store.selectedDataObject ? [dataObjectToNodeElement(store.selectedDataObject)] : [])
	logicalConditioners = $derived(store.logicalConditioners.map(LCToNodeElement))
	logicalPhysicals = $derived(store.selectedLogicalPhysicals.map(LPToNodeElement))
	container = $state<HTMLDivElement | null>(null)
	mousePosition = $state({ x: 0, y: 0 })
	startNode = $state<string | null>("");
	startPort = $state<ConnectionPort | null>(null);
	startNodeType = $state<NodeElementType | null>(null)
	drawStartPoint = $state<EventTarget | null>(null)
	lastStartPoint = $state<EventTarget | null>(null)
	svgElement = $state<SVGGraphicsElement | null>(null)
}

export const canvasStore = new Store()

export function LPToNodeElement(lp: LpElement): NodeElement {
	return {
		id: lp.id,
		type: NODE_ELEMENT_TYPE.LP,
		name: `${lp.name || lp.type}-${lp.instance}`,
		title: `${lp.type}-${lp.instance}`,
		isLinked: lp.isLinked,
		lnClass: lp.type,
		numberOfDynamicPorts: lp.numberOfLPDOPorts
	}
}

export function LCToNodeElement(lc: LogicalConditioner): NodeElement {
	return {
		id: lc.id,
		type: NODE_ELEMENT_TYPE.LC,
		name: `${lc.type}-${lc.instance}`,
		lnClass: lc.type,
		numberOfDynamicPorts: lc.numberOfLCIVPorts
	}
}

export function dataObjectToNodeElement(dataObject: ObjectNodeDataObject): NodeElement {

	const id = [
		dataObject.objectPath.ied?.name,
		dataObject.objectPath.lDevice?.inst,
		dataObject.objectPath.ln?.lnClass,
		dataObject.objectPath.ln?.inst,
		dataObject.name
	]
	.filter(Boolean)
	.join("-")

	const nodeElement = {
		name: dataObject.name,
		type: NODE_ELEMENT_TYPE.DO,
		isLinked: dataObject.isLinked,
		id,
	}
	return nodeElement
}
