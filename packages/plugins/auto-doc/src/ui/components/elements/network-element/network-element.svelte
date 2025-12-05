<script lang="ts">
import NetworkExplorer from '@oscd-plugins/network-explorer/src/network-explorer.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { LegacyTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'
import type { NetworkElementParameters } from './types.network'

interface Props {
	onContentChange: (newContent: string) => void
	triggerDiagramReady?: () => void
	content?: string
}

let { onContentChange, triggerDiagramReady, content = '' }: Props = $props()

let initialParams: NetworkElementParameters | null = null

if (content) {
	try {
		initialParams = JSON.parse(content) as NetworkElementParameters
	} catch (e) {
		console.warn('[NetworkElement] Failed to parse stored parameters:', e)
	}
}

let htmlRoot: HTMLElement | null = $state(null)
let selectedBays: Set<string> = $state(
	initialParams ? new Set(initialParams.selectedBays) : new Set<string>()
)

function saveParameters(): void {
	const params: NetworkElementParameters = {
		selectedBays: Array.from(selectedBays)
	}
	onContentChange(JSON.stringify(params))
}

$effect(() => {
	if (htmlRoot && triggerDiagramReady) {
		triggerDiagramReady()
	}
})
</script>

{#if pluginGlobalStore.xmlDocument}
	<div class="communication-element" bind:this={htmlRoot}>
		<DiagramWithBaySelector bind:selectedBays onchange={saveParameters} />
		<LegacyTheme>
			<div class="network-preview-wrapper">
				<NetworkExplorer
					doc={pluginGlobalStore.xmlDocument}
					isOutsidePluginContext={true}
					selectedBays={selectedBays.size > 0
						? selectedBays
						: undefined}
				/>
			</div>
		</LegacyTheme>
	</div>
{:else}
	<NoXmlWarning />
{/if}

<style>
	.network-preview-wrapper :global(*) {
		pointer-events: none !important;
	}
</style>
