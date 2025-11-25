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
const DELAY_BEFORE_DIAGRAM = 1000 // Increased delay to reduce export frequency
let selectedBays: string[] = $state([])
let exportTimeout: ReturnType<typeof setTimeout> | null = null
let isExporting = $state(false)

async function exportNetworkDiagram(): Promise<void> {
	if (!htmlRoot || isExporting) {
		return
	}
	
	isExporting = true
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
	} finally {
		isExporting = false
	}
}

$effect(() => {
	const bays = selectedBays
	
	if (!htmlRoot) return
	
	if (exportTimeout) {
		clearTimeout(exportTimeout)
		exportTimeout = null
	}
	
	exportTimeout = setTimeout(() => {
		exportNetworkDiagram()
		exportTimeout = null
	}, DELAY_BEFORE_DIAGRAM)
})
</script>

{#if pluginGlobalStore.xmlDocument}
<DiagramWithBaySelector bind:selectedBays />
	<div class="communication-element" >
		<LegacyTheme>
			<div class="communication-preview-wrapper" bind:this={htmlRoot}>
			<TelemetryView
				root={pluginGlobalStore.xmlDocument as unknown as Element}
				showSidebar={false}
				bind:selectedBays
			/>
			</div>
		</LegacyTheme>
	</div>
{:else}
	<NoXmlWarning />
{/if}

<style>
	.communication-preview-wrapper :global(*) {
		pointer-events: none !important;
	}
</style>