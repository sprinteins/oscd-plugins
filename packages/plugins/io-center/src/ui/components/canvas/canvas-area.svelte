<script lang="ts">
import NodeElement from './node-element.svelte'
import { onDestroy, onMount } from 'svelte'
import type { Connection, ConnectionPoint } from './types.canvas'
import { calulateCoordinates } from './mouse-action.svelte'
import { canvasStore } from './canvas-store.svelte'

let connections = $state<Connection[]>([])
let startNode = $state<string | null>('')
let container = $state<HTMLDivElement | null>(null)

let dataObjects = $state<{ name: string; attribute: string }[]>([
	{ name: 'DO X', attribute: 'Pwr' },
	{ name: 'DO Y', attribute: 'Pos' }
])
let logicalConditoners = $state<{ name: string; attribute: string }[]>([
	{ name: 'LC X', attribute: 'attr' },
	{ name: 'LC Y', attribute: 'attr' }
])
let logicalPhyscials = $state<{ name: string; attribute: string }[]>([
	{ name: 'LP X', attribute: 'attr' },
	{ name: 'LP Y', attribute: 'attr' }
])

function startDrawing(event: MouseEvent) {
	event.preventDefault()
	if (!event.target || !event.currentTarget) {
		return
	}
	canvasStore.drawStartPoint = event.target
	const currentTarget = event.currentTarget as HTMLElement
	if (!currentTarget.parentElement) {
		return
	}
	startNode = currentTarget.parentElement.getAttribute('data-title')
}

function isWrongColumn(node1: string, node2: string) {
	if (!container) {
		return false
	}

	const column1 = container
		.querySelector(`[data-title="${node1}"]`)
		?.closest('.flex-col')
	const column2 = container
		.querySelector(`[data-title="${node2}"]`)
		?.closest('.flex-col')
	if (!column1 || !column2) {
		return false
	}
	if (column1 === column2) {
		return true
	}

	const column1Title = column1.getAttribute('data-title')
	const column2Title = column2.getAttribute('data-title')
	if (!column1Title || !column2Title) {
		return false
	}

	if (
		(column1Title === 'DO' && column2Title === 'LP') ||
		(column1Title === 'LP' && column2Title === 'DO')
	) {
		return true
	}
	return false
}

function isSameSide(startSide: string, targetSide: string) {
	return (
		(startSide === 'left-circle' && targetSide === 'left') ||
		(startSide === 'right-circle' && targetSide === 'right')
	)
}

function connectionExists(fromNode: string, toNode: string) {
	return connections.some(
		(connection) =>
			(connection.from.node === fromNode &&
				connection.to.node === toNode) ||
			(connection.from.node === toNode && connection.to.node === fromNode)
	)
}

function stopDrawing(targetNode: string, targetSide: string) {
	const startCircle = canvasStore.lastStartPoint
	canvasStore.lastStartPoint = null
	if (!container) {
		return
	}

	const target = container.querySelector(
		`[data-title="${targetNode}"]`
	) as HTMLElement | null

	if (startCircle && target && startCircle !== target) {
		let fromNode = startNode
		if (!fromNode) {
			return
		}
		let toNode = targetNode

		if (startCircle instanceof HTMLElement)
			if (
				fromNode === toNode ||
				isWrongColumn(fromNode, toNode) ||
				isSameSide(startCircle.id, targetSide)
			) {
				return
			}

		if (
			startCircle instanceof HTMLElement &&
			startCircle.id === 'left-circle'
		) {
			;[fromNode, toNode] = [toNode, fromNode]
		}

		if (!connectionExists(fromNode, toNode)) {
			connections = [
				...connections,
				{
					from: { node: fromNode, side: 'right' },
					to: { node: toNode, side: 'left' }
				}
			]
		}
	}
}

function getCoordinates(connectionPoint: ConnectionPoint) {
	if (!canvasStore.svgElement || !container) {
		return { x: 0, y: 0 }
	}

	const target = container.querySelector(
		`[data-title="${connectionPoint.node}"]`
	) as HTMLElement | null

	if (!target) {
		return { x: 0, y: 0 }
	}

	const circle = target.querySelector(
		connectionPoint.side === 'left' ? '#left-circle' : '#right-circle'
	)

	if (!circle) {
		return { x: 0, y: 0 }
	}

	const rect = circle.getBoundingClientRect()

	const svgPoint = new DOMPoint(
		rect.left + rect.width / 2,
		rect.top + rect.height / 2
	)

	const transformedPoint = svgPoint.matrixTransform(
		canvasStore.svgElement.getScreenCTM()?.inverse()
	)
	return { x: transformedPoint.x, y: transformedPoint.y }
}

function getCirclePosition(target: EventTarget | null) {
	if (
		!target ||
		!(target instanceof HTMLElement) ||
		!canvasStore.svgElement
	) {
		return { x: 0, y: 0 }
	}

	const rect = target.getBoundingClientRect()

	const svgPoint = new DOMPoint(
		rect.left + rect.width / 2,
		rect.top + rect.height / 2
	)

	const transformedPoint = svgPoint.matrixTransform(
		canvasStore.svgElement.getScreenCTM()?.inverse()
	)
	return { x: transformedPoint.x, y: transformedPoint.y }
}

function redrawConnections() {
	connections = [...connections]
}

onMount(() => {
	window.addEventListener('resize', redrawConnections)
	connections = [
		{
			from: { node: 'DO X', side: 'right' },
			to: { node: 'LC X', side: 'left' }
		},
		{
			from: { node: 'DO Y', side: 'right' },
			to: { node: 'LC X', side: 'left' }
		}
	]
})

onDestroy(() => {
	window.removeEventListener('resize', redrawConnections)
})
</script>

<div
  use:calulateCoordinates
  class="grid grid-cols-3 h-screen p-2 gap-2"
  bind:this={container}
>
  <div class="flex flex-col items-center w-full gap-2 bg-gray-50" data-title="DO">
    <div class="text-center">Data Objects</div>
    {#each dataObjects as node}
      <NodeElement
        {node}
        showLeftCircle={false}
        showRightCircle={true}
        {startDrawing}
        {stopDrawing}
      />
    {/each}
  </div>
  <div class="flex flex-col items-center w-full gap-2 bg-gray-50" data-title="LC">
    <div class="text-center">Logical Conditioners</div>
    {#each logicalConditoners as node}
      <NodeElement
        {node}
        showLeftCircle={true}
        showRightCircle={true}
        {startDrawing}
        {stopDrawing}
      />
    {/each}
  </div>
  <div class="flex flex-col items-center w-full gap-2 bg-gray-50" data-title="LP">
    <div class="text-center">Logical Physical Inputs/Outputs</div>
    {#each logicalPhyscials as node}
      <NodeElement
        {node}
        showLeftCircle={true}
        showRightCircle={false}
        {startDrawing}
        {stopDrawing}
      />
    {/each}
  </div>
</div>

<svg
  class="absolute top-0 left-0 w-full h-full pointer-events-none"
  bind:this={canvasStore.svgElement}
>
  {#key connections}
    {#each connections as connection}
      <path
        class="stroke-black stroke-2 fill-none"
        d={`M ${getCoordinates(connection.from).x},${getCoordinates(connection.from).y} 
					 C ${(getCoordinates(connection.from).x + getCoordinates(connection.to).x) / 2},${getCoordinates(connection.from).y} 
					 ${(getCoordinates(connection.from).x + getCoordinates(connection.to).x) / 2},${getCoordinates(connection.to).y} 
					 ${getCoordinates(connection.to).x},${getCoordinates(connection.to).y}`}
      />
    {/each}
  {/key}
  {#if canvasStore.drawStartPoint}
    <path
      class="stroke-black stroke-2"
      d={`M ${getCirclePosition(canvasStore.drawStartPoint).x},${getCirclePosition(canvasStore.drawStartPoint).y} L ${canvasStore.mousePosition.x},${canvasStore.mousePosition.y}`}
    />
  {/if}
</svg>
