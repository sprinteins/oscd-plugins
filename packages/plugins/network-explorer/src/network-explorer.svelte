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

export type Environment = 'NETWORK_EXPLORER' | 'AUTO_DOC'

interface BaseProps {
	doc: XMLDocument
	// biome-ignore lint/suspicious/noExplicitAny: Has been here before, should be investigated properly
	store?: any
}

interface AutoDocProps extends BaseProps {
	environment: 'AUTO_DOC'
	editCount?: undefined
}

interface NetworkExplorerProps extends BaseProps {
	environment?: Exclude<Environment, 'AUTO_DOC'>
	editCount: number
}

type Props = AutoDocProps | NetworkExplorerProps

let {
	doc,
	environment = 'NETWORK_EXPLORER',
	store = new DiagramStore(),
	editCount
}: Props & { editCount?: number } = $props()
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
		<DiagramContainer store={store} doc={doc.documentElement} editCount={editCount} environment={environment} onDelete={onDelete}/>
		{#if environment === "NETWORK_EXPLORER"}
			<Sidebar {store} createCable={onCreateCable} updateCable={onUpdateCable} />
		{/if}
	</network-explorer>
</SvelteFlowProvider>

<style>
	network-explorer {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
	}
</style>
