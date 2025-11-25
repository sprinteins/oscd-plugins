<script lang="ts">
import NetworkExplorer from '@oscd-plugins/network-explorer/src/network-explorer.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { MaterialTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import { exportPngFromHTMLElement } from '@/utils/diagram-export'
import type { ImageData } from '../image-element/types.image'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'
import { SCDQueries } from '@oscd-plugins/core'

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
	console.log("filtering with", xmlDoc, "selectedBay:", selectedBay)

	if (!xmlDoc) {
		return xmlDoc
	}

	if (!selectedBay) {
		// does not work RN
		console.log("should return original doc")
		return pluginGlobalStore.xmlDocument as XMLDocument
	}

	const modifiedXmlDoc = xmlDoc.cloneNode(true) as XMLDocument
	const root = modifiedXmlDoc.documentElement
	
	const scdQueries = new SCDQueries(root)
	const allIEDs = scdQueries.searchIEDs()
	
	const iedsToRemove: string[] = []
	
	for (const ied of allIEDs) {
		const iedBays = scdQueries.getBaysByIEDName(ied.name)
		const hasMatchingBay = iedBays.has(selectedBay)		
		if (!hasMatchingBay) {
			iedsToRemove.push(ied.name)
		}
	}

	for (const iedName of iedsToRemove) {
		const iedElement = root.querySelector(`IED[name="${iedName}"]`)
		if (iedElement) {
			iedElement.remove()
		}
		
		// Also remove related communication elements
		// const connectedAPElements = root.querySelectorAll(`Communication SubNetwork ConnectedAP[iedName="${iedName}"]`)
		// for (const element of connectedAPElements) {
		// 	element.remove()
		// }
	}

	const allBayElements = root.querySelectorAll('Bay')
	for (const bayElement of allBayElements) {
		const bayName = bayElement.getAttribute('name')
		if (bayName && bayName !== selectedBay) {
			const lnodes = bayElement.querySelectorAll('LNode')
			for (const lnode of lnodes) {
				lnode.remove()
			}
		}
	}

	return modifiedXmlDoc
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
