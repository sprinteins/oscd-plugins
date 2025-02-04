<script lang="ts">
import Node from './node.svelte'
import { onMount } from 'svelte'
import type { Connection } from './types.canvas'

let connections = $state<Connection[]>([])
let dragStartNode: EventTarget | null = $state(null)
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
	dragStartNode = event.target
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
	if (dragStartNode && svgElement) {
		mousePosition = convertToSVGCoordinates(event.clientX, event.clientY)
	}
}

function isSameColumn(node1: string, node2: string) {
	if (!container) {
		return
	}
	const column1 = container
		.querySelector(`[data-title="${node1}"]`)
		?.closest('.flex-col')
	const column2 = container
		.querySelector(`[data-title="${node2}"]`)
		?.closest('.flex-col')
	return column1 === column2
}

function isDOandLPColumn(node1: string, node2: string) {
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

function isSameSide(tmpDragStartNode: HTMLElement, targetSide: string) {
	const isSameSide =
		(tmpDragStartNode.id === 'left-circle' && targetSide === 'left') ||
		(tmpDragStartNode.id === 'right-circle' && targetSide === 'right')
	return isSameSide
}

function stopDragging(targetNode: string, targetSide: string) {
	const tmpDragStartNode = dragStartNode
	if (!container) {
		console.log('container is null')
		return
	}

	const target = container.querySelector(
		`[data-title="${targetNode}"]`
	) as HTMLElement | null

	if (tmpDragStartNode && target && tmpDragStartNode !== target) {
		let fromNode = startNode
		if (!fromNode) {
			console.log('fromNode is null')
			return
		}
		let toNode = targetNode

		if (tmpDragStartNode instanceof HTMLElement)
			if (
				fromNode === toNode ||
				isSameColumn(fromNode, toNode) ||
				isDOandLPColumn(fromNode, toNode) ||
				isSameSide(tmpDragStartNode, targetSide)
			) {
				return
			}

		if (
			tmpDragStartNode instanceof HTMLElement &&
			tmpDragStartNode.id === 'left-circle'
		) {
			;[fromNode, toNode] = [toNode, fromNode]
		}

		const connectionExists = connections.some(
			(connection) =>
				(connection.from.node === fromNode &&
					connection.to.node === toNode) ||
				(connection.from.node === toNode &&
					connection.to.node === fromNode)
		)

		if (!connectionExists) {
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

function getConnection(connection: { node: string; side: string }) {
	if (!svgElement || !container) {
		console.log('svgElement or container is null')
		return { x: 0, y: 0 }
	}

	const target = container.querySelector(
		`[data-title="${connection.node}"]`
	) as HTMLElement | null

	if (!target) {
		console.log('target is null')
		return { x: 0, y: 0 }
	}

	const circle = target.querySelector(
		connection.side === 'left' ? '#left-circle' : '#right-circle'
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
	  onmouseup={(dragStartNode = null)}
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
			d={`M ${getConnection(connection.from).x},${getConnection(connection.from).y} 
					 C ${(getConnection(connection.from).x + getConnection(connection.to).x) / 2},${getConnection(connection.from).y} 
					 ${(getConnection(connection.from).x + getConnection(connection.to).x) / 2},${getConnection(connection.to).y} 
					 ${getConnection(connection.to).x},${getConnection(connection.to).y}`}
		  />
		{/each}
	  {/key}
	  {#if dragStartNode}
		<path
		  class="stroke-black stroke-2"
		  d={`M ${getCirclePosition(dragStartNode).x},${getCirclePosition(dragStartNode).y} L ${mousePosition.x},${mousePosition.y}`}
		/>
	  {/if}
	</svg>
	