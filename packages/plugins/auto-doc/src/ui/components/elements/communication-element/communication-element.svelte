<script lang="ts">
import TelemetryView from '@oscd-plugins/communication-explorer/src/ui/components/telemetry-view/telemetry-view.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { LegacyTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import type { ImageData } from '../image-element/types.image'
import { exportPngFromHTMLElement } from '@/utils/diagram-export'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'

interface Props {
	onContentChange: (newContent: string) => void
	content?: string
}

let { onContentChange, content = '' }: Props = $props()

let htmlRoot: HTMLElement | null = $state(null)
const DELAY_BEFORE_DIAGRAM = 2000
let selectedBays: string[] = $state([])

async function exportNetworkDiagram(): Promise<void> {
	if (!htmlRoot) {
		console.error('HTML root is not available for export.')
		return
	}
	try {
		const pngBase64 = await exportPngFromHTMLElement({
			element: htmlRoot
		})
		const fullDataUri = `data:image/png;base64,${pngBase64}`

		const data: ImageData = {
			scale: 'Large',
			base64Data: fullDataUri
		}

		onContentChange(JSON.stringify(data))
	} catch (error) {
		console.error('Error exporting diagram as PNG:', error)
	}
}

async function waitForDiagramToRender(): Promise<void> {s
	await new Promise((resolve) => setTimeout(resolve, DELAY_BEFORE_DIAGRAM))
}

$effect(() => {
	if (htmlRoot) {
		waitForDiagramToRender().then(() => exportNetworkDiagram())
	}
})
</script>

{#if pluginGlobalStore.xmlDocument}
<DiagramWithBaySelector bind:selectedBays />
	<div class="communication-element" bind:this={htmlRoot}>
		<LegacyTheme>
			<TelemetryView
				root={pluginGlobalStore.xmlDocument as unknown as Element}
				showSidebar={false}
			/>
		</LegacyTheme>
	</div>
{:else}
	<NoXmlWarning />
{/if}

<style>
	.communication-element {
		border: 1px solid #ccc;
	}
</style>