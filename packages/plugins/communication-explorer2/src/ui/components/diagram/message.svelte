<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
import { path as d3Path } from 'd3-path'
// CONSTANTS
import { MESSAGE_TYPE } from '@oscd-plugins/core'
// TYPES
import type { ElkEdgeSection } from 'elkjs'
import type { IEDConnection } from './nodes'

//
// Input

	interface Props {
		//
		edge: IEDConnection;
		isSelected?: boolean;
		isIEDSelected?: boolean;
		testid?: string;
		playAnimation?: boolean;
		showConnectionArrows?: boolean;
	}

	let {
		edge,
		isSelected = false,
		isIEDSelected = false,
		testid = '',
		playAnimation = true,
		showConnectionArrows = true
	}: Props = $props();

//
// Internal - Synchronized path and arrow calculation
//
interface PathAndArrows {
	path: string
	arrowData: {
		arrowRightHeight: number
		arrowRightWidth: number
		arrowTopHeight: number
		arrowTopWidth: number
		arrowBottomHeight: number
		arrowBottomWidth: number
	}
}

const pathAndArrows = $derived.by((): PathAndArrows => {
	const arrowSize = 7
	const sections = edge?.sections ?? []
	
	// Default return for invalid data
	const defaultArrowData = {
		arrowRightHeight: 0,
		arrowRightWidth: 0,
		arrowTopHeight: 0,
		arrowTopWidth: 0,
		arrowBottomHeight: 0,
		arrowBottomWidth: 0
	}

	if (sections.length === 0) {
		return { path: '', arrowData: defaultArrowData }
	}

	const section = sections[0]
	if (!section) {
		return { path: '', arrowData: defaultArrowData }
	}

	const reverseDirection = section.endPoint.x < section.startPoint.x

	// Draw the path
	const path = d3Path()
	path.moveTo(section.startPoint.x, section.startPoint.y)

	if (section.bendPoints) {
		section.bendPoints.forEach((b) => {
			path.lineTo(b.x, b.y)
		})
	}

	let endpointX = section.endPoint.x
	if (showConnectionArrows) {
		endpointX = section.endPoint.x - arrowSize
		if (reverseDirection) {
			endpointX = section.endPoint.x + arrowSize
		}
	}

	path.lineTo(endpointX, section.endPoint.y)

	// Calculate arrows IMMEDIATELY after path (like original)
	let arrowData = defaultArrowData
	if (showConnectionArrows) {
		arrowData = {
			arrowRightHeight: section.endPoint.y,
			arrowRightWidth: section.endPoint.x,
			arrowTopHeight: section.endPoint.y + arrowSize / 2,
			arrowBottomHeight: section.endPoint.y - arrowSize / 2,
			arrowTopWidth: reverseDirection 
				? section.endPoint.x + arrowSize 
				: section.endPoint.x - arrowSize,
			arrowBottomWidth: reverseDirection 
				? section.endPoint.x + arrowSize 
				: section.endPoint.x - arrowSize
		}
	}

	return { 
		path: path.toString(), 
		arrowData 
	}
})

const defaultColor = 'var(--color-black)'
const messageTypeToColorMap: { [key in keyof typeof MESSAGE_TYPE]: string } = {
	[MESSAGE_TYPE.GOOSE]: 'var(--color-message-goose)',
	[MESSAGE_TYPE.SampledValues]: 'var(--color-message-sampledvalues)',
	[MESSAGE_TYPE.MMS]: 'var(--color-message-mms)',
	[MESSAGE_TYPE.Unknown]: 'var(--color-message-unknown)'
}

const defaultHighlightColor = 'var(--color-grey-3)'
const messageTypeToHighlightColorMap: {
	[key in keyof typeof MESSAGE_TYPE]: string
} = {
	[MESSAGE_TYPE.GOOSE]: 'var(--color-message-highlight-goose)',
	[MESSAGE_TYPE.SampledValues]:
		'var(--color-message-highlight-sampledvalues)',
	[MESSAGE_TYPE.MMS]: 'var(--color-message-highlight-mms)',
	[MESSAGE_TYPE.Unknown]: 'var(--color-message-unknown)'
}

const defaultPattern = '4, 32'
const messageTypeToDashArray: { [key in keyof typeof MESSAGE_TYPE]: string } = {
	// [MessageType.GOOSE]:         "4, 8",
	// [MessageType.MMS]:           "16, 8, 16, 32",
	// [MessageType.SampledValues]: "16, 32",
	[MESSAGE_TYPE.GOOSE]: '16,8, 16,8, 4,8, 4,8 4,8 ',
	[MESSAGE_TYPE.SampledValues]: '4, 8',
	[MESSAGE_TYPE.MMS]: '16, 40',
	[MESSAGE_TYPE.Unknown]: '16,40'
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

// Derived values from synchronized calculation
const path = $derived(pathAndArrows.path)
const arrowData = $derived(pathAndArrows.arrowData)
const shouldPlayAnimation = $derived(playAnimation && edge.isRelevant && (isSelected || isIEDSelected))
const pathColor = $derived(calcPathColor(edge))
const pathHighlightColor = $derived(calcPathHighlightColor(edge))
const dashArray = $derived(calcDashArray(edge))
</script>

<g
	onclick={bubble('click')}
	onkeypress={bubble('keypress')}
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
				d="M{arrowData.arrowRightWidth} {arrowData.arrowRightHeight} L{arrowData.arrowBottomWidth} {arrowData.arrowBottomHeight} L{arrowData.arrowTopWidth} {arrowData.arrowTopHeight} Z"
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
