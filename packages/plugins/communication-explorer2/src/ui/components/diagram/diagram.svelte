<script lang="ts">
	import type {
		IEDConnectionWithCustomValues,
		IEDElkNode,
		RootNode
	} from "./nodes"
	import { isBayNode } from "./nodes"
	import { IEDElement } from "./ied-element"
	import Message from "./message.svelte"
	import { createEventDispatcher } from "svelte"
	import type { ElkExtendedEdge } from "elkjs"
	import {
		isConnectionSelected,
		isIEDSelected,
	} from "../../../stores/_store-view-filter"
	import BayContainer from "./bay-container/bay-container.svelte"

	//
	// Inputs
	//
	export let rootNode: RootNode
	export let playAnimation = true
	export let showConnectionArrows = true
	export let showBayLabels = false

	//
	// Setup
	//

	let svgRoot: SVGElement
	let root: HTMLElement

	const dispatch = createEventDispatcher()
	function handleIEDClick(e: MouseEvent, node: IEDElkNode) {
		if (draggingEnabled) {
			return
		}

		const element = e.target;
		if (!(element instanceof HTMLElement)) {
			return;
		}

		const isAdditiveSelect = e.metaKey || e.ctrlKey || e.shiftKey

		if (element.classList.contains("bayLabel")) {
			dispatchBaySelect(element.textContent)
			return;
		}

		if (isAdditiveSelect) {
			dispatchIEDAdditiveSelect(node)
			return
		}
		dispatchIEDSelect(node)
	}
	function dispatchIEDSelect(node: IEDElkNode) {
		dispatch("iedselect", node)
	}
	function dispatchIEDAdditiveSelect(node: IEDElkNode) {
		dispatch("iedadditiveselect", node)
	}
	function dispatchBaySelect(bay: string) {
		dispatch("bayselect", bay)
	}

	function dispatchConnectionClick(connection: ElkExtendedEdge) {
		if (draggingEnabled) {
			return
		}
		dispatch("connectionclick", connection)
	}

	function handleClick(e: Event) {
		if (draggingEnabled || isDragging) {
			return
		}
		if (e.target !== svgRoot && e.target !== root) {
			return
		}

		dispatch("clearclick")
	}

	function isConnectionsAnyIEDSelected(
		connection: IEDConnectionWithCustomValues
	): boolean {
		return (
			isIEDSelected({ label: connection.sourceIED?.iedName }) ||
			isIEDSelected({ label: connection.targetIED?.iedName })
		)
	}

	//
	// Draggable Diagram
	//
	let pos = { top: 0, left: 0, x: 0, y: 0 }
	let draggingEnabled = false
	let isDragging = false
	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLElement

		if (e.code !== "Space" || target.tagName !== "BODY") {
			return
		}

		draggingEnabled = true
		e.stopImmediatePropagation()
		e.stopPropagation()
		e.preventDefault()
	}

	function handleMouseDown(e: MouseEvent) {
		if (!draggingEnabled) {
			return
		}

		isDragging = true
		pos = {
			// The current scroll
			left: root.scrollLeft,
			top:  root.scrollTop,
			// Get the current mouse position
			x:    e.clientX,
			y:    e.clientY,
		}

		e.stopImmediatePropagation()
		e.stopPropagation()
		e.preventDefault()
	}
	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) {
			return
		}

		// How far the mouse has been moved
		const dx = e.clientX - pos.x
		const dy = e.clientY - pos.y

		// Scroll the element
		root.scrollTop = pos.top - dy
		root.scrollLeft = pos.left - dx
	}

	function handleMouseUp(e: MouseEvent) {
		isDragging = false
		e.stopImmediatePropagation()
		e.stopPropagation()
		e.preventDefault()
	}

	function handleMouseLeave() {
		disableDragging()
	}

	function handleKeyUp() {
		disableDragging()
	}
	function disableDragging() {
		draggingEnabled = false
		isDragging = false
	}
	function resetZoom(width: number, height: number) {
		//only reset zoom if rootNodeWidth / height actually changed
		//(the rune also triggers when they didn't for some reason...)
		if (width !== savedRootNodeWidth && height !== savedRootNodeHeight) {
			svgWidth = width
			svgHeight = height
			savedRootNodeWidth = width
			savedRootNodeHeight = height
		}
	}

	//
	// Zoom
	//
	let zoomModifier = 1
	let zoomStep = 0.1
	let svgWidth = 0
	let svgHeight = 0
	let savedRootNodeWidth = 0
	let savedRootNodeHeight = 0
	$: resetZoom(rootNode.width, rootNode.height)

	async function handleMouseWheel(e: WheelEvent) {
		if (!e.ctrlKey && !e.metaKey) {
			return
		}

		const direction = e.deltaY < 0 ? 1 : -1
		const zooming = zoomModifier + zoomStep * direction
		const newSVGWidth = svgWidth * zooming
		const newSVGHeight = svgHeight * zooming
		if (newSVGWidth < 0 || newSVGHeight < 0) {
			return
		}

		svgHeight = newSVGHeight
		svgWidth = newSVGWidth
	}
</script>

<svelte:body on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

{#if rootNode}
	<diagram
		bind:this={root}
		on:click={handleClick}
		on:keypress
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:mouseleave={handleMouseLeave}
		on:wheel={handleMouseWheel}
		class:draggingEnabled
		class:isDragging
	>
		<svg
			bind:this={svgRoot}
			on:keypress
			viewBox={`0 0 ${rootNode.width} ${rootNode.height}`}
			style:--width={`${svgWidth}px`}
			style:--height={`${svgHeight}px`}
			xmlns="http://www.w3.org/2000/svg"
		>
			{#if rootNode.children}
				{#each rootNode.children as node}
					{#if isBayNode(node)}
						<foreignObject
							x={node.x}
							y={node.y}
							width={node.width}
							height={node.height}
							overflow="visible"
						>
							<BayContainer
								{node}
								testid={`bay-${node.label}`}
							/>
						</foreignObject>
					{:else}
						<foreignObject
							x={node.x}
							y={node.y}
							width={node.width}
							height={node.height}
							overflow="visible"
							on:click={(e) => handleIEDClick(e, node)}
							on:keydown
						>
							<IEDElement
								{node}
								isBaySelected= {false}
								isIEDSelected={isIEDSelected(node)}
								showBayLabels={showBayLabels}
								testid={`ied-${node.label}`}
							/>
						</foreignObject>
					{/if}
				{/each}
			{/if}

			{#if rootNode.edges}
				{#each rootNode.edges as edge}
					<Message
						{edge}
						isSelected={isConnectionSelected(edge)}
						isIEDSelected={isConnectionsAnyIEDSelected(edge)}
						on:click={() => dispatchConnectionClick(edge)}
						testid={`connection-${edge.id}`}
						{playAnimation}
						{showConnectionArrows}
					/>
				{/each}
			{/if}
		</svg>
	</diagram>
{/if}

<style>
	diagram {
		display: block;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	diagram.draggingEnabled {
		cursor: grab;
	}

	diagram.isDragging {
		cursor: grabbing;
	}

	svg {
		width: var(--width);
		height: var(--height);
		display: block;
		margin: auto;
	}
</style>
