<script lang="ts">
import TelemetryView from '@oscd-plugins/communication-explorer/src/ui/components/telemetry-view/telemetry-view.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { LegacyTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import type { ImageData } from '../image-element/types.image'
import { exportPngFromHTMLElement } from '@/utils/diagram-export'

interface Props {
	onContentChange: (newContent: string) => void
	content?: string
}

let { onContentChange, content = '' }: Props = $props()

let htmlRoot: HTMLElement | null = $state(null)
const DELAY_BEFORE_DIAGRAM = 2000

async function exportNetworkDiagram(): Promise<void> {
    console.log('Starting export of communication diagram as PNG...')
	if (!htmlRoot) {
		console.error('HTML root is not available for export.')
		return
	}
	try {
		const pngBase64 = await exportPngFromHTMLElement({ element: htmlRoot })
		const fullDataUri = `data:image/png;base64,${pngBase64}`

		console.log('Generated full data URI for PNG:', fullDataUri)

		const data: ImageData = {
			scale: 'Large',
			base64Data: fullDataUri
		}

		onContentChange(JSON.stringify(data))
	} catch (error) {
		console.error('Error exporting diagram as PNG:', error)
	}
}

async function waitForDiagramToRender(): Promise<void> {
    console.log('Waiting for diagram to render...');
	await new Promise((resolve) => setTimeout(resolve, DELAY_BEFORE_DIAGRAM))
}

$effect(() => {
	if (htmlRoot) {
		;(async () => {
            console.log('HTML root is set, proceeding to export diagram...');
			await waitForDiagramToRender()
			console.log('Diagram has rendered, starting export...');
			await exportNetworkDiagram()
            console.log('Export process completed.');
		})()
	}
})
</script>

{#if pluginGlobalStore.xmlDocument}
    <div class="communication-element" bind:this={htmlRoot}>
        <LegacyTheme>
            <TelemetryView root={pluginGlobalStore.xmlDocument} showSidebar={false} />
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