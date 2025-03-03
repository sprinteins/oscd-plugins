import type { Connection, NodeElement } from "./types.canvas"
import {store} from "../../../store.svelte"
import type { LogicalConditioner } from "../../../ied/logical-conditioner"

class Store {
	dataObjects = $state<NodeElement[]>([])
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