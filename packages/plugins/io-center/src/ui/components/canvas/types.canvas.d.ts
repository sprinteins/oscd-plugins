export type ConnectionPoint = {
	node: string
	side: string
}

export type Connection = {
	from: ConnectionPoint
	to: ConnectionPoint
}

export type NodeElement = {
	id: string
	name: string
}

export type NodeProps = {
	node: NodeElement
	showLeftCircle: boolean
	showRightCircle: boolean
	startDrawing: (event: MouseEvent) => void
	stopDrawing: (node: string, side: string) => void
}
