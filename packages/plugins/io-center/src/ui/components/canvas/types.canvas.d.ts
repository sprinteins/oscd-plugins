export type ConnectionPoint = {
	node: string
	side: string
}

export type Connection = {
	from: ConnectionPoint
	to: ConnectionPoint
}

export type NodeProps = {
	node: { name: string; attribute: string }
	showLeftCircle: boolean
	showRightCircle: boolean
	startDrawing: (event: MouseEvent) => void
	stopDrawing: (node: string, side: string) => void
}
