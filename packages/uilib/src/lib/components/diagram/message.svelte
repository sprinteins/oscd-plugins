<script lang="ts">
	import { path as d3Path } from "d3-path"
	import type { IEDConnection } from "./nodes"
	import { MessageType } from "@oscd-plugins/core"
	import type { ElkEdgeSection } from "elkjs"

	//
	// Input
	//
	export let edge: IEDConnection
	export let isSelected = false
	export let isIEDSelected = false
	export let testid = ""
	export let playAnimation = true
	export let showConnectionArrows = true

	//
	// Internal
	//
	let path: string
	$: path = drawLine(edge, showConnectionArrows)
	$: shouldPlayAnimation =
		playAnimation && edge.isRelevant && (isSelected || isIEDSelected)

	let arrowRightHeight = 0
	let arrowRightWidth = 0
	let arrowTopHeight = 0
	let arrowTopWidth = 0
	let arrowBottomHeight = 0
	let arrowBottomWidth = 0

	const defaultColor = "var(--color-black)"
	const messageTypeToColorMap: { [key in MessageType]: string } = {
		[MessageType.GOOSE]:         "var(--color-message-goose)",
		[MessageType.SampledValues]: "var(--color-message-sampledvalues)",
		[MessageType.MMS]:           "var(--color-message-mms)",
		[MessageType.Unknown]:       "var(--color-message-unknown)",
	}

	const defaultHighlightColor = "var(--color-grey-3)"
	const messageTypeToHighlightColorMap: { [key in MessageType]: string } = {
		[MessageType.GOOSE]: "var(--color-message-highlight-goose)",
		[MessageType.SampledValues]:
			"var(--color-message-highlight-sampledvalues)",
		[MessageType.MMS]:     "var(--color-message-highlight-mms)",
		[MessageType.Unknown]: "var(--color-message-unknown)",
	}

	const defaultPattern = "4, 32"
	const messageTypeToDashArray: { [key in MessageType]: string } = {
		// [MessageType.GOOSE]:         "4, 8",
		// [MessageType.MMS]:           "16, 8, 16, 32",
		// [MessageType.SampledValues]: "16, 32",
		[MessageType.GOOSE]:         "16,8, 16,8, 4,8, 4,8 4,8 ",
		[MessageType.SampledValues]: "4, 8",
		[MessageType.MMS]:           "16, 40",
		[MessageType.Unknown]:       "16,40",
	}

	$: pathColor = calcPathColor(edge)
	$: pathHighlightColor = calcPathHighlightColor(edge)
	$: dashArray = calcDashArray(edge)

	function drawLine(
		edge: IEDConnection | undefined,
		showArrows: boolean
	): string {
		const arrowSize = 7

		const sections = edge?.sections ?? []
		if (sections.length === 0) {
			return ""
		}

		const section = sections[0]

		if (!section) {
			return ""
		}

		const reverseDirection = section.endPoint.x < section.startPoint.x

		const path = d3Path()
		path.moveTo(section.startPoint.x, section.startPoint.y)

		if (section.bendPoints) {
			section.bendPoints.forEach((b) => {
				path.lineTo(b.x, b.y)
			})
		}

		let endpointX = section.endPoint.x
		if (showArrows) {
			endpointX = section.endPoint.x - arrowSize
			if (reverseDirection) {
				endpointX = section.endPoint.x + arrowSize
			}
		}

		path.lineTo(endpointX, section.endPoint.y)

		calcArrow(section, reverseDirection, arrowSize)

		return path.toString()
	}

	function calcPathColor(edge?: IEDConnection): string {
		if (!edge?.messageType) {
			return defaultColor
		}

		const color = messageTypeToColorMap[edge.messageType]
		if (!color) {
			return defaultColor
		}

		return color
	}
	function calcPathHighlightColor(edge?: IEDConnection): string {
		if (!edge?.messageType) {
			return defaultHighlightColor
		}

		const color = messageTypeToHighlightColorMap[edge.messageType]
		if (!color) {
			return defaultHighlightColor
		}

		return color
	}

	function calcDashArray(edge?: IEDConnection): string {
		if (!edge?.messageType) {
			return defaultPattern
		}

		const dashArray = messageTypeToDashArray[edge.messageType]
		if (!dashArray) {
			return defaultPattern
		}
		return dashArray
	}

	function calcArrow(
		section: ElkEdgeSection,
		reverseDirection: boolean,
		arrowSize: number
	) {
		arrowRightHeight = section.endPoint.y
		arrowRightWidth = section.endPoint.x

		arrowTopHeight = section.endPoint.y + arrowSize / 2
		arrowBottomHeight = section.endPoint.y - arrowSize / 2

		if (reverseDirection) {
			arrowTopWidth = section.endPoint.x + arrowSize
			arrowBottomWidth = section.endPoint.x + arrowSize
		} else {
			arrowTopWidth = section.endPoint.x - arrowSize
			arrowBottomWidth = section.endPoint.x - arrowSize
		}
	}
</script>

<g
	on:click
	on:keypress
	class:show-selected-path={isSelected}
	class:selected={isSelected}
	class:ied-selected={isIEDSelected}
	class:needs-solid-animation={true}
	class:irrelevant={!edge.isRelevant}
	data-testid={testid}
>
	<title>{`${edge.messageType} - ${edge.messageTypeLabel}`}</title>
	{#if path}
		<path d={path} class="path-hover-box" />
		<path d={path} class="path-strong" style:stroke={pathColor} />
		<path
			d={path}
			class="path"
			style:stroke={pathColor}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d={path}
			class="path-selected"
			style:stroke={pathColor}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		{#if shouldPlayAnimation}
			<path
				d={path}
				class="path-animation-border"
				style:stroke="black"
				stroke-dasharray={dashArray}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d={path}
				class="path-animation"
				style:stroke={pathHighlightColor}
				stroke-dasharray={dashArray}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/if}

		{#if showConnectionArrows}
			<path
				class="path-end"
				d="M{arrowRightWidth} {arrowRightHeight} L{arrowBottomWidth} {arrowBottomHeight} L{arrowTopWidth} {arrowTopHeight} Z"
				style="fill: {pathColor};"
			/>
			<circle
				class="path-start"
				cx={edge?.sections?.at(0)?.startPoint?.x}
				cy={edge?.sections?.at(0)?.startPoint?.y}
				r="2"
				style="fill: {pathColor}; z-index: 1000;"
			/>
		{/if}
	{/if}
</g>

<style>
	path {
		fill: none;
		cursor: pointer;
	}

	.path-animation-border,
	.path-animation {
		display: none;
	}

	.path-animation-border {
		stroke-width: 0.3rem;
	}

	.path-animation {
		stroke-width: 0.2rem;
	}

	.path {
		/* TODO: extract colors */
		stroke-width: 0.2rem;
		/* stroke-width: 2px; */
		stroke: #288409;
		background: #288409;
		border: 1.5px solid #1c5907;
	}

	.path-hover-box {
		stroke-width: 0.8rem;
		stroke: transparent;
		opacity: 0.1;
	}

	.path-strong {
		stroke-width: 0.275rem;
		opacity: 0;
	}

	.path-selected {
		stroke-width: 0.275rem;
		display: none;
	}

	.selected .path-selected {
		display: block;
	}

	.ied-selected .path-animation,
	.ied-selected .path-animation-border,
	.selected .path-animation-border,
	.selected .path-animation {
		display: block;
		animation-name: ied-connection-animation;
		animation-duration: 200s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	.selected .path {
		display: none;
	}

	.path-hover-box:hover ~ .path-strong,
	.path-strong:hover {
		opacity: 1;
	}

	.irrelevant {
		opacity: 0.2;
	}

	/* 
		There is an weird jump when the animation restart
		to make sure it stays smooth we just run the animation long
		This is a workaround because a real solution does not really worth it
	*/
	@keyframes -global-ied-connection-animation {
		from {
			stroke-dashoffset: 5000px;
		}
		to {
			stroke-dashoffset: 0px;
		}
	}
</style>
