export type NodeProps = {
	title: string
	subtitle: string
	showLeftCircle: boolean
	showRightCircle: boolean
	startDrawing: (event: MouseEvent) => void
	stopDrawing: (node: string, side: string) => void
}
