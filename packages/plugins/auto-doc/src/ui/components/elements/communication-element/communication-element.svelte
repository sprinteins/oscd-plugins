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

let showLegend = $state(false)
let showBayList = $state(false)
let showIEDList = $state(false)

interface MessageTypeRow {
	id: number
	enabled: boolean
	messageType: string
	sourceIED: string
	targetIED: string
}

let messageTypeRows: MessageTypeRow[] = $state([
	{
		id: 1,
		enabled: true,
		messageType: MESSAGE_TYPE.GOOSE,
		sourceIED: 'SMU01',
		targetIED: 'BCU01'
	},
	{
		id: 2,
		enabled: true,
		messageType: MESSAGE_TYPE.MMS,
		sourceIED: 'BCU01',
		targetIED: 'SMU01'
	},
	{
		id: 3,
		enabled: true,
		messageType: MESSAGE_TYPE.SampledValues,
		sourceIED: 'BPU01',
		targetIED: 'RTU01'
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
	const messageTypes = selectedMessageTypes

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
	<div class="diagram-configuration">
		<div>Bay selection</div>
		<DiagramWithBaySelector bind:selectedBays />
		<div>Further details</div>
		<div class="further-details-options">
			<FormField>
				<Checkbox bind:checked={showLegend} />
				{#snippet label()}
					Show legend
				{/snippet}
			</FormField>
			<FormField>
				<Checkbox bind:checked={showBayList} />
				{#snippet label()}
					Show list of bays
				{/snippet}
			</FormField>
			<FormField>
				<Checkbox bind:checked={showIEDList} />
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
						<Checkbox bind:checked={row.enabled} />
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
			<div class="communication-preview-wrapper" bind:this={htmlRoot}>
				<TelemetryView
					root={pluginGlobalStore.xmlDocument as unknown as Element}
					showSidebar={false}
					{selectedBays}
					{selectedMessageTypes}
					focusMode={true}
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
