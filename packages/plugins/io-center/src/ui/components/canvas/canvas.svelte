<script lang="ts">
import Node from './node.svelte'
import { onMount } from 'svelte'
import type { Connection, ConnectionPoint } from './types.canvas'

let connections = $state<Connection[]>([])
let dragStartCircle: EventTarget | null = $state(null)
let startNode = $state<string | null>('')
let mousePosition = $state({ x: 0, y: 0 })
let svgElement = $state<SVGGraphicsElement | null>(null)
let container = $state<HTMLDivElement | null>(null)

function startDragging(event: MouseEvent) {
	event.preventDefault()
	if (!event.target || !event.currentTarget) {
		console.log('event.target is null')
		return
	}
	dragStartCircle = event.target
	const currentTarget = event.currentTarget as HTMLElement
	if (!currentTarget.parentElement) {
		console.log('no parent')
		return
	}
	startNode = currentTarget.parentElement.getAttribute('data-title')
	mousePosition = convertToSVGCoordinates(event.clientX, event.clientY)
}

function handleMouseMove(event: MouseEvent) {
	event.preventDefault()
	if (dragStartCircle && svgElement) {
		mousePosition = convertToSVGCoordinates(event.clientX, event.clientY)
	}
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

function stopDragging(targetNode: string, targetSide: string) {
	const startCircle = dragStartCircle
	if (!container) {
		console.log('container is null')
		return
	}

	const target = container.querySelector(
		`[data-title="${targetNode}"]`
	) as HTMLElement | null

	if (startCircle && target && startCircle !== target) {
		let fromNode = startNode
		if (!fromNode) {
			console.log('fromNode is null')
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
	if (!svgElement || !container) {
		console.log('svgElement or container is null')
		return { x: 0, y: 0 }
	}

	const target = container.querySelector(
		`[data-title="${connectionPoint.node}"]`
	) as HTMLElement | null

	if (!target) {
		console.log('target is null')
		return { x: 0, y: 0 }
	}

	const circle = target.querySelector(
		connectionPoint.side === 'left' ? '#left-circle' : '#right-circle'
	)

	if (!circle) {
		console.log('circle is null')
		return { x: 0, y: 0 }
	}

	const rect = circle.getBoundingClientRect()

	const svgPoint = new DOMPoint(
		rect.left + rect.width / 2,
		rect.top + rect.height / 2
	)

	const transformedPoint = svgPoint.matrixTransform(
		svgElement.getScreenCTM()?.inverse()
	)
	return { x: transformedPoint.x, y: transformedPoint.y }
}

function getCirclePosition(target: EventTarget | null) {
	if (!target || !(target instanceof HTMLElement) || !svgElement) {
		return { x: 0, y: 0 }
	}

	const rect = target.getBoundingClientRect()

	const svgPoint = new DOMPoint(
		rect.left + rect.width / 2,
		rect.top + rect.height / 2
	)

	const transformedPoint = svgPoint.matrixTransform(
		svgElement.getScreenCTM()?.inverse()
	)
	return { x: transformedPoint.x, y: transformedPoint.y }
}

function convertToSVGCoordinates(clientX: number, clientY: number) {
	if (!svgElement) {
		return { x: clientX, y: clientY }
	}

	const svgPoint = new DOMPoint(clientX, clientY)

	const transformedPoint = svgPoint.matrixTransform(
		svgElement.getScreenCTM()?.inverse()
	)
	return { x: transformedPoint.x, y: transformedPoint.y }
}

function redrawConnections() {
	connections = [...connections]
}

onMount(() => {
	window.addEventListener('resize', () => redrawConnections())
	connections = [
		{
			from: { node: 'DO X', side: 'right' },
			to: { node: 'Logical Component X', side: 'left' }
		},
		{
			from: { node: 'DO Y', side: 'right' },
			to: { node: 'Logical Component X', side: 'left' }
		}
	]
})
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="grid grid-cols-3 h-full"
  onmousemove={handleMouseMove}
  onmouseup={(dragStartCircle = null)}
  bind:this={container}
>
  <div class="flex flex-col items-center w-full gap-2" data-title="DO">
    <div class="text-center">DO</div>
    {#each ["DO X", "DO Y"] as node}
      <Node
        title={node}
        subtitle="Attribut"
        showLeftCircle={false}
        showRightCircle={true}
        {startDragging}
        {stopDragging}
      />
    {/each}
  </div>
  <div class="flex flex-col items-center w-full gap-2" data-title="LC">
    <div class="text-center">LC</div>
    {#each ["Logical Component X", "Logical Component Y"] as node}
      <Node
        title={node}
        subtitle="Attribut"
        showLeftCircle={true}
        showRightCircle={true}
        {startDragging}
        {stopDragging}
      />
    {/each}
  </div>
  <div class="flex flex-col items-center w-full gap-2" data-title="LP">
    <div class="text-center">LP</div>
    {#each ["LP X", "LP Y"] as node}
      <Node
        title={node}
        subtitle="Attribut"
        showLeftCircle={true}
        showRightCircle={false}
        {startDragging}
        {stopDragging}
      />
    {/each}
  </div>
</div>

<svg
  class="absolute top-0 left-0 w-full h-full pointer-events-none"
  bind:this={svgElement}
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
  {#if dragStartCircle}
    <path
      class="stroke-black stroke-2"
      d={`M ${getCirclePosition(dragStartCircle).x},${getCirclePosition(dragStartCircle).y} L ${mousePosition.x},${mousePosition.y}`}
    />
  {/if}
</svg>
