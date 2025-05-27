import { canvasStore } from '@/headless/stores'

export function calculateCoordinates(node: HTMLElement) {
	function updateMousePosition(event: MouseEvent) {
		event.preventDefault()
		canvasStore.mousePosition = canvasStore.getSVGCoordinates(
			event.clientX,
			event.clientY
		)
	}

	function onMouseUp() {
		canvasStore.drawnLineSource = null
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
