<script lang="ts">
// CONSTANTS
import { PORT_KIND } from '@/headless/constants'
// STORES
import { canvasStore } from '@/headless/stores'
// TYPES
import type { PortConfig } from '@/headless/stores'

//====== INITIALIZATION ======//

// props

let {
	port
}: {
	port: PortConfig
} = $props()

//====== STATES ======//

let isMouseHover = $state(false)

//====== DERIVED ======//

const isTargetPort = $derived(
	canvasStore.currentPortSource &&
		canvasStore.currentPortSource.payload.uuid !== port.payload.uuid
)

const isConnectionAllowed = $derived(canvasStore.isConnectionAllowed())
const isPortOnlyAcceptingOneConnectionAndIsAlreadyConnected = $derived(
	canvasStore.isPortDisabled(port)
)

const portBgColor = $derived.by(() => {
	if (isTargetPort && isMouseHover)
		return isConnectionAllowed ? 'bg-primary' : 'bg-destructive'

	return canvasStore.currentConnectedDataObjectAndLogicalUuids &&
		canvasStore.isPortConnected(port)
		? 'bg-primary'
		: 'bg-black'
})

const portLabel = $derived.by(() => {
	if (port.kind === PORT_KIND.dataObject) return port.name
	return `${port.name}-${port.index}`
})
</script>

{#if port.side === 'right'}
	<span>{portLabel}</span>
{/if}

<button
	bind:this={canvasStore.portHTMLElementByUuids[port.payload.uuid]}
	disabled={isPortOnlyAcceptingOneConnectionAndIsAlreadyConnected}
	tabindex="-1"
	class={`relative border-card  border-4 size-[1.25rem] rounded-full ${portBgColor}`}
	onmousedown={(event) => {
			canvasStore.startDrawing({event, source: port});
	}}
	onmouseup={async () => {
			await canvasStore.stopDrawing(
					port
			);
			isMouseHover = false
	}}
	onmouseenter={() => {
			if (isTargetPort) {
					canvasStore.currentPortTarget = port;
					isMouseHover = true
			}
	}}
	onmouseleave={() => {
			if (isTargetPort) {
					canvasStore.currentPortTarget = null;
					isMouseHover = false
			}
	}}
>
	<span class="sr-only">{portLabel}</span>
</button>

{#if port.side === 'left'}
	<span>{portLabel}</span>
{/if}