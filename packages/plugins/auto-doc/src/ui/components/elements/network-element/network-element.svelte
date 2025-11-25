<script lang="ts">
import NetworkExplorer from '@oscd-plugins/network-explorer/src/network-explorer.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { MaterialTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import { exportPngFromHTMLElement } from '@/utils/diagram-export'
import type { ImageData } from '../image-element/types.image'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'

const SVELTE_FLOW__PANE = '.svelte-flow__pane'
const DELAY_BEFORE_FLOW_PANE = 2000

interface Props {
	content?: string
	onContentChange: (newContent: string) => void
}

let { content = '', onContentChange }: Props = $props()

let htmlRoot: HTMLElement | null = $state(null)
let selectedBay: string = $state('')
let filteredXmlDocument: XMLDocument | null = $state(null)

function filterXmlDocumentByBay(xmlDoc: XMLDocument, selectedBay: string): XMLDocument {
	if (!xmlDoc || !selectedBay) {
		return xmlDoc
	}

	const modifiedXmlDoc = xmlDoc.cloneNode(true) as XMLDocument
	const root = modifiedXmlDoc.documentElement
  
	const allBayElements = root.querySelectorAll('Bay')
	for (const bayElement of allBayElements) {
		const bayName = bayElement.getAttribute('name')
		if (bayName && bayName !== selectedBay) {
			bayElement.remove()
		}
	}

	console.log("FILTERED ROOT", root)
	return root.ownerDocument as XMLDocument
}

async function exportNetworkDiagram(flowPane: HTMLElement) {
	if (!flowPane) {
		console.error('Flow pane is not available for export.')
		return
	}
	try {
		const pngBase64 = await exportPngFromHTMLElement({
			element: flowPane
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

async function waitForDiagramToRender(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, DELAY_BEFORE_FLOW_PANE))
}

$effect(() => {
	if (pluginGlobalStore.xmlDocument) {
		filteredXmlDocument = filterXmlDocumentByBay(pluginGlobalStore.xmlDocument, selectedBay)
	} 
})

$effect(() => {
	if (htmlRoot) {
		const pane = htmlRoot.querySelector<HTMLElement>(SVELTE_FLOW__PANE)
		if (pane) {
			waitForDiagramToRender().then(() => exportNetworkDiagram(pane))
		}
	}
})
</script>

{#if pluginGlobalStore.xmlDocument}
	<div class="communication-element" bind:this={htmlRoot}>
		<DiagramWithBaySelector bind:selectedBay />
		<MaterialTheme pluginType="editor">
			<div class="network-preview-wrapper">
				{#if filteredXmlDocument}
					<NetworkExplorer
						doc={filteredXmlDocument}
						isOutsidePluginContext={true}
					/>
				{/if}
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
