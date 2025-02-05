export type NodeProps = {
	node: { name: string; attribute: string }
	showLeftCircle: boolean
	showRightCircle: boolean
	startDrawing: (event: MouseEvent) => void
	stopDrawing: (node: string, side: string) => void
}
