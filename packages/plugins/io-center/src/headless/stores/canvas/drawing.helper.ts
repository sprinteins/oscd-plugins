// STORES
import { canvasStore } from '@/headless/stores'
// HELPERS
import { createConnection } from './connection-crud.helper'
// TYPES
import type { PortConfig, ConnectionId } from '@/headless/stores'

export function startDrawing(params: {
	event: MouseEvent
	source: PortConfig
}) {
	params.event.preventDefault()
	if (!params.event.target || !params.event.currentTarget) return

	canvasStore.drawnLineSource = getPortCoordinates(
		params.event.target as HTMLElement
	)

	canvasStore.currentPortSource = params.source
}

export async function stopDrawing(target: PortConfig) {
	if (!canvasStore.currentPortSource) return
	canvasStore.currentPortTarget = target
	await createConnection({
		source: canvasStore.currentPortSource,
		target
	}).catch((error) => {
		console.error('Error creating connection:', error)
	})
	canvasStore.resetCurrentPorts()
}

export function getSVGCoordinates(x: number, y: number) {
	if (!canvasStore.svgElement) {
		return { x, y }
	}

	const svgPoint = new DOMPoint(x, y)

	const transformedPoint = svgPoint.matrixTransform(
		canvasStore.svgElement.getScreenCTM()?.inverse()
	)
	return { x: transformedPoint.x, y: transformedPoint.y }
}

export function getConnectionsCoordinates(
	connectionUuids: ConnectionId[],
	portHTMLElementByUuids: Record<string, Element>,
	windowSizeWidthTrigger: number,
	windowSizeHeightTrigger: number
) {
	return connectionUuids
		.map((connectionUuid) => {
			const sourceElement =
				portHTMLElementByUuids[connectionUuid.dOISource]
			if (!sourceElement) return
			const targetElement =
				portHTMLElementByUuids[connectionUuid.lNRefTarget]
			if (!targetElement) return

			const { x: sourceX, y: sourceY } = getPortCoordinates(sourceElement)
			const { x: targetX, y: targetY } = getPortCoordinates(targetElement)

			const sourceXSourceY = `${sourceX},${sourceY}`
			const sourceXTargetXSourceY = `${(sourceX + targetX) / 2},${sourceY}`
			const sourceXTargetXTargetY = `${(sourceX + targetX) / 2},${targetY}`
			const targetXTargetY = `${targetX},${targetY}`

			return {
				source: connectionUuid.dOISource,
				target: connectionUuid.lNRefTarget,
				svgDPath: `M ${sourceXSourceY} C ${sourceXTargetXSourceY} ${sourceXTargetXTargetY} ${targetXTargetY}`
			}
		})
		.filter((connection) => connection !== undefined)
}

//====== LOCAL ======//

function getPortCoordinates(portElement: Element) {
	const rect = portElement.getBoundingClientRect()

	return getSVGCoordinates(
		rect.left + rect.width / 2,
		rect.top + rect.height / 2
	)
}
