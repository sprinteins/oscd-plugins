<script lang="ts">
import TelemetryView from '@oscd-plugins/communication-explorer/src/ui/components/telemetry-view/telemetry-view.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { LegacyTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import type { ImageData } from '../image-element/types.image'
import { exportPngFromHTMLElement } from '@/utils/diagram-export'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'
import Checkbox from '@smui/checkbox'
import FormField from '@smui/form-field'
import Textfield from '@smui/textfield'
import { MESSAGE_TYPE } from '@oscd-plugins/core'

interface CommunicationElementParameters {
	selectedBays: string[]
	selectedMessageTypes: string[]
	showLegend: boolean
	showBayList: boolean
	showIEDList: boolean
	zoom: number
	diagramDimensions: { width: number; height: number } | null
}

interface Props {
	onContentChange: (newContent: string) => void
	onRenderComplete?: () => void
	content?: string
}

let { onContentChange, onRenderComplete, content = '' }: Props = $props()

// Parse stored parameters from content (only on initial mount)
let initialParams: CommunicationElementParameters | null = null
let hasInitialized = false

if (content && !hasInitialized) {
	try {
		initialParams = JSON.parse(content) as CommunicationElementParameters
		console.log('[CommunicationElement] Loaded stored parameters:', initialParams)
		hasInitialized = true
	} catch (e) {
		console.warn('[CommunicationElement] Failed to parse stored parameters:', e)
	}
}

let htmlRoot: HTMLElement | null = $state(null)
let selectedBays: Set<string> = $state(initialParams ? new Set(initialParams.selectedBays) : new Set<string>())
let calculatedZoom = $state(initialParams?.zoom ?? 1.0)
let diagramDimensions = $state<{ width: number; height: number } | null>(initialParams?.diagramDimensions ?? null)

let showLegend = $state(initialParams?.showLegend ?? false)
let showBayList = $state(initialParams?.showBayList ?? false)
let showIEDList = $state(initialParams?.showIEDList ?? false)

interface MessageTypeRow {
	id: number
	enabled: boolean
	messageType: string
	sourceIED: string
	targetIED: string
}

// placeholder rows for message type selection
let messageTypeRows: MessageTypeRow[] = $state([
	{
		id: 1,
		enabled: true,
		messageType: MESSAGE_TYPE.GOOSE,
		sourceIED: '',
		targetIED: ''
	},
	{
		id: 2,
		enabled: true,
		messageType: MESSAGE_TYPE.MMS,
		sourceIED: '',
		targetIED: ''
	},
	{
		id: 3,
		enabled: true,
		messageType: MESSAGE_TYPE.SampledValues,
		sourceIED: '',
		targetIED: ''
	},
	{
		id: 4,
		enabled: true,
		messageType: MESSAGE_TYPE.Unknown,
		sourceIED: '',
		targetIED: ''
	}
])

let selectedMessageTypes = $derived(
	messageTypeRows.filter((row) => row.enabled).map((row) => row.messageType)
)

function calculateFitToContainerZoom(): number {
	if (!htmlRoot || !diagramDimensions) return 1.0
	
	const containerWidth = htmlRoot.offsetWidth || 800
	const containerHeight = htmlRoot.offsetHeight || 600
	
	const diagramWidth = diagramDimensions.width
	const diagramHeight = diagramDimensions.height
	
	if (diagramWidth === 0 || diagramHeight === 0) return 0.5
	
	const widthRatio = containerWidth / diagramWidth
	const heightRatio = containerHeight / diagramHeight
	
	return Math.min(widthRatio, heightRatio) * 0.9
}

function handleDiagramSizeCalculated(width: number, height: number) {
	diagramDimensions = { width, height }
	calculatedZoom = calculateFitToContainerZoom()
	saveParameters()
}

function saveParameters(): void {
	console.log('[CommunicationElement] Saving parameters...')
	const params: CommunicationElementParameters = {
		selectedBays: Array.from(selectedBays),
		selectedMessageTypes,
		showLegend,
		showBayList,
		showIEDList,
		zoom: calculatedZoom,
		diagramDimensions
	}
	console.log('[CommunicationElement] Parameters:', params)
	onContentChange(JSON.stringify(params))
}

// Notify when render is complete (for offscreen rendering during PDF generation)
$effect(() => {
	if (htmlRoot && onRenderComplete) {
		console.log('[CommunicationElement] Render complete, notifying parent')
		onRenderComplete()
	}
})
</script>

{#if pluginGlobalStore.xmlDocument}
	<div class="diagram-configuration">
		<div>Bay selection</div>
		<DiagramWithBaySelector bind:selectedBays={selectedBays} onchange={saveParameters} />
		<div>Further details</div>
		<div class="further-details-options">
			<FormField>
				<Checkbox bind:checked={showLegend} onchange={saveParameters} />
				{#snippet label()}
					Show legend
				{/snippet}
			</FormField>
			<FormField>
				<Checkbox bind:checked={showBayList} onchange={saveParameters} />
				{#snippet label()}
					Show list of bays
				{/snippet}
			</FormField>
			<FormField>
				<Checkbox bind:checked={showIEDList} onchange={saveParameters} />
				{#snippet label()}
					Show list of IEDs and IED details
				{/snippet}
			</FormField>
		</div>

		<div>Communication matrix</div>
		<div class="communication-matrix">
			{#each messageTypeRows as row (row.id)}
			<div class="matrix-row">
				<FormField>
					<Checkbox bind:checked={row.enabled} onchange={saveParameters} />
				</FormField>
					<div class="row-fields">
						<Textfield
							bind:value={row.messageType}
							label="Message Type"
							variant="outlined"
							disabled={true}
						/>
						<Textfield
							bind:value={row.sourceIED}
							label="Source IED"
							variant="outlined"
							disabled={!row.enabled}
						/>
						<Textfield
							bind:value={row.targetIED}
							label="Target IED"
							variant="outlined"
							disabled={!row.enabled}
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="communication-element">
		<LegacyTheme>
			<div class="fit-middle">
			<div class="communication-preview-wrapper" bind:this={htmlRoot}>
				<TelemetryView
					root={pluginGlobalStore.xmlDocument as unknown as Element}
					showSidebar={false}
					selectedBays={selectedBays.size > 0 ? selectedBays : undefined}
					{selectedMessageTypes}
					focusMode={true}
					isOutsidePluginContext={true}
					zoom={calculatedZoom}
					onDiagramSizeCalculated={handleDiagramSizeCalculated}
				/>
			</div>
			</div>
		</LegacyTheme>
	</div>
{:else}
	<NoXmlWarning />
{/if}

<style>
	.fit-middle {
		justify-content: center;
		align-items: center;
	}

	.communication-preview-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.communication-preview-wrapper :global(*) {
		pointer-events: none !important;
	}

	.diagram-configuration {
		padding: 1rem;
	}

	.further-details-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.communication-matrix {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		margin-top: 0.5rem;
	}

	.matrix-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
