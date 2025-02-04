export type NodeProps = {
	title: string
	subtitle: string
	showLeftCircle: boolean
	showRightCircle: boolean
	startDragging: (event: MouseEvent) => void
	stopDragging: (node: string, side: string) => void
}