import type { Connection, NodeElement } from "./types.canvas"

class UseCanvasStore {
	dataObjects = $state<NodeElement[]>([])
	logicalConditioners = $state<NodeElement[]>([])
	logicalPhysicals = $state<NodeElement[]>([])
	connections = $state<Connection[]>([])
	container = $state<HTMLDivElement | null>(null)
	mousePosition = $state({ x: 0, y: 0 })
	startNode = $state<string | null>("");
	drawStartPoint = $state<EventTarget | null>(null)
	lastStartPoint = $state<EventTarget | null>(null)
	svgElement = $state<SVGGraphicsElement | null>(null)
}

export const canvasStore = new UseCanvasStore()
