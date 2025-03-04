import type { Connection, NodeElement } from "./types.canvas"
import {store} from "../../../store.svelte"
import type { LogicalConditioner } from "../../../ied/logical-conditioner"
import type { DataObject } from "../../../ied/data-object"
import type { ObjectNodeDataObject } from "../../../ied/object-tree.type"

class Store {
	dataObjects = $derived<NodeElement[]>(store.selectedDataObjects.map(dataObjectToNodeElement))
	logicalConditioners = $derived(store.logicalConditioners.map(LCToNodeElement))
	logicalPhysicals = $state<NodeElement[]>([])
	connections = $state<Connection[]>([])
	container = $state<HTMLDivElement | null>(null)
	mousePosition = $state({ x: 0, y: 0 })
	startNode = $state<string | null>("");
	drawStartPoint = $state<EventTarget | null>(null)
	lastStartPoint = $state<EventTarget | null>(null)
	svgElement = $state<SVGGraphicsElement | null>(null)
}

export const canvasStore = new Store()

export function LCToNodeElement(lc: LogicalConditioner): NodeElement {
	return {
		id: `${lc.type}-${lc.instance}`,
		name: `${lc.type}-${lc.instance}`
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
		id,
	}
	return nodeElement
}