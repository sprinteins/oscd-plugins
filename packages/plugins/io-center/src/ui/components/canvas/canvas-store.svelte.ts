class UseCanvasStore {
	mousePosition = $state({ x: 0, y: 0 })
	drawStartPoint: EventTarget | null = $state(null)
	lastStartPoint: EventTarget | null = $state(null)
	svgElement = $state<SVGGraphicsElement | null>(null)
}

export const canvasStore = new UseCanvasStore()
