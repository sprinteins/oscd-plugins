<script lang="ts">
import { SvelteFlowProvider } from '@xyflow/svelte'
import type { Networking } from '@oscd-plugins/core'
import { DiagramContainer } from './diagram'
import { DiagramStore } from './store'
import { Sidebar } from './sidebar'
import type {
	CreateCableEvent,
	UpdateCableEvent
} from './editor-events/network-events'
import { EditorEventHandler } from './editor-events/editor-event-handler'

interface BaseProps {
	doc: XMLDocument
	// biome-ignore lint/suspicious/noExplicitAny: Has been here before, should be investigated properly
	store?: any
	filterBay?: string | null
}

type isOutsidePluginContextProps = BaseProps & {
	isOutsidePluginContext: true
	editCount?: undefined
}

type StandaloneProps = BaseProps & {
	isOutsidePluginContext?: false | undefined
	editCount: number
}

type Props = isOutsidePluginContextProps | StandaloneProps

let {
	doc,
	isOutsidePluginContext = false,
	store = new DiagramStore(),
	editCount,
	filterBay = null
}: Props = $props()
let htmlRoot: HTMLElement | null = $state(null)
let editEventHandler: EditorEventHandler | null = $derived(
	htmlRoot ? new EditorEventHandler(htmlRoot) : null
)

function onCreateCable(event: CreateCableEvent) {
	editEventHandler?.dispatchCreateCable(event)
	store.resetNewConnection()
}

function onUpdateCable(event: UpdateCableEvent) {
	editEventHandler?.dispatchUpdateCable(event)
	store.resetNewConnection()
}

function onDelete(networkings: Networking[]): void {
	editEventHandler?.dispatchDeleteCable(networkings)
}
</script>

<SvelteFlowProvider>
	<network-explorer bind:this={htmlRoot}>
		<DiagramContainer
			{store}
			doc={doc.documentElement}
			editCount={isOutsidePluginContext ? undefined : editCount}
			{isOutsidePluginContext}
			{onDelete}
			{filterBay}
		/>
		{#if !isOutsidePluginContext}
			<Sidebar
				{store}
				createCable={onCreateCable}
				updateCable={onUpdateCable}
			/>
		{/if}
	</network-explorer>
</SvelteFlowProvider>

<style>
	network-explorer {
		height: calc(100vh - var(--header-height));
		display: flex;
		align-items: stretch;
		position: relative;
	}
</style>
