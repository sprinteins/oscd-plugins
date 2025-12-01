<script lang="ts">
import NetworkExplorer from '@oscd-plugins/network-explorer/src/network-explorer.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { MaterialTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'
import type { NetworkElementParameters } from './types.network'

interface Props {
	onContentChange: (newContent: string) => void
	onRenderComplete?: () => void
	content?: string
}

let { onContentChange, onRenderComplete, content = '' }: Props = $props()

// Parse stored parameters from content (only on initial mount)
let initialParams: NetworkElementParameters | null = null
let hasInitialized = false

if (content && !hasInitialized) {
	try {
		initialParams = JSON.parse(content) as NetworkElementParameters
		console.log('[NetworkElement] Loaded stored parameters:', initialParams)
		hasInitialized = true
	} catch (e) {
		console.warn('[NetworkElement] Failed to parse stored parameters:', e)
	}
}

let htmlRoot: HTMLElement | null = $state(null)
let selectedBays: Set<string> = $state(
	initialParams ? new Set(initialParams.selectedBays) : new Set<string>()
)

function saveParameters(): void {
	console.log('[NetworkElement] Saving parameters...')
	const params: NetworkElementParameters = {
		selectedBays: Array.from(selectedBays)
	}
	console.log('[NetworkElement] Parameters:', params)
	onContentChange(JSON.stringify(params))
}

// Notify when render is complete (for offscreen rendering during PDF generation)
$effect(() => {
	if (htmlRoot && onRenderComplete) {
		console.log('[NetworkElement] Render complete, notifying parent')
		onRenderComplete()
	}
})
</script>

{#if pluginGlobalStore.xmlDocument}
	<div class="communication-element" bind:this={htmlRoot}>
		<DiagramWithBaySelector bind:selectedBays={selectedBays} onchange={saveParameters} />
		<MaterialTheme pluginType="editor">
			<div class="network-preview-wrapper">
				<NetworkExplorer
					doc={pluginGlobalStore.xmlDocument}
					isOutsidePluginContext={true}
					selectedBays={selectedBays.size > 0 ? selectedBays : undefined}
				/>
			</div>
		</MaterialTheme>
	</div>
{:else}
	<NoXmlWarning />
{/if}

<style>
	.network-preview-wrapper :global(*) {
		pointer-events: none !important;
	}
</style>
