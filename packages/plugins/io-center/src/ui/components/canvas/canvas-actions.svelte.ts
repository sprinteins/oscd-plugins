import { canvasStore } from './canvas-store.svelte'

export function calulateCoordinates(node: HTMLElement) {
	function convertToSVGCoordinates(clientX: number, clientY: number) {
		if (!canvasStore.svgElement) {
			return { x: clientX, y: clientY }
		}

		const svgPoint = new DOMPoint(clientX, clientY)

		const transformedPoint = svgPoint.matrixTransform(
			canvasStore.svgElement.getScreenCTM()?.inverse()
		)
		return { x: transformedPoint.x, y: transformedPoint.y }
	}

	function updateMousePosition(event: MouseEvent) {
		event.preventDefault()
		canvasStore.mousePosition = convertToSVGCoordinates(
			event.clientX,
			event.clientY
		)
	}

	function onMouseUp() {
		canvasStore.lastStartPoint = canvasStore.drawStartPoint
		canvasStore.drawStartPoint = null
	}

	$effect(() => {
		node.addEventListener('mousemove', updateMousePosition)
		node.addEventListener('mouseup', onMouseUp)

		return () => {
			node.removeEventListener('mousemove', updateMousePosition)
			node.removeEventListener('mouseup', onMouseUp)
		}
	})
}
