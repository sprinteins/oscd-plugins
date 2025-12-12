<script lang="ts">
import { TelemetryView } from '@oscd-plugins/communication-explorer/lib'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { LegacyTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte'
import DiagramWithBaySelector from '../diagram-with-bay-selector.svelte'
import IedPatternHelpDialog from '../../dialog/ied-pattern-help-dialog.svelte'
import Tooltip from '../../tooltip/tooltip.svelte'
import Checkbox from '@smui/checkbox'
import FormField from '@smui/form-field'
import Textfield from '@smui/textfield'
import Select, { Option } from '@smui/select'
import { CustomIconButton } from '@oscd-plugins/ui/src/components'
import { MESSAGE_TYPE } from '@oscd-plugins/core'
import type {
	CommunicationElementParameters,
	ConnectionFilter,
	MessageTypeRow
} from './types.communication'
import { tick } from 'svelte'

interface Props {
	onContentChange: (newContent: string) => void
	triggerDiagramReady?: () => void
	content?: string
}

let { onContentChange, triggerDiagramReady, content = '' }: Props = $props()

const DEFAULT_ZOOM = 1.0
const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600
const ZOOM_PADDING_FACTOR = 0.9

let initialParams: CommunicationElementParameters | null = null

if (content) {
	try {
		initialParams = JSON.parse(content) as CommunicationElementParameters
	} catch (e) {
		console.warn(
			'[CommunicationElement] Failed to parse stored parameters:',
			e
		)
	}
}

let htmlRoot: HTMLElement | null = $state(null)
let selectedBays: Set<string> = $state(
	initialParams ? new Set(initialParams.selectedBays) : new Set<string>()
)
let calculatedZoom = $state(initialParams?.zoom ?? 1.0)
let diagramDimensions = $state<{ width: number; height: number } | null>(
	initialParams?.diagramDimensions ?? null
)

let showLegend = $state(initialParams?.showLegend ?? false)
let showBayList = $state(initialParams?.showBayList ?? false)
let showIEDList = $state(initialParams?.showIEDList ?? false)

let isPatternHelpDialogOpen = $state(false)

let nextRowId = $state(1)

function initializeMessageTypeRows(): MessageTypeRow[] {
	if (
		initialParams?.messageTypeRows &&
		initialParams.messageTypeRows.length > 0
	) {
		const maxId = Math.max(
			...initialParams.messageTypeRows.map((row) => row.id)
		)
		nextRowId = maxId + 1
		return initialParams.messageTypeRows
	}

	const defaultMessageTypes = [
		MESSAGE_TYPE.GOOSE,
		MESSAGE_TYPE.MMS,
		MESSAGE_TYPE.SampledValues,
		MESSAGE_TYPE.Unknown
	]

	const rows = defaultMessageTypes.map((messageType, index) => ({
		id: index + 1,
		enabled: true,
		messageType,
		sourceIEDPattern: '',
		targetIEDPattern: ''
	}))

	nextRowId = rows.length + 1
	return rows
}

let messageTypeRows: MessageTypeRow[] = $state(initializeMessageTypeRows())

function addMessageTypeRow() {
	messageTypeRows = [
		...messageTypeRows,
		{
			id: nextRowId++,
			enabled: true,
			messageType: MESSAGE_TYPE.GOOSE,
			sourceIEDPattern: '',
			targetIEDPattern: ''
		}
	]
	saveParameters()
}

function removeMessageTypeRow(id: number) {
	messageTypeRows = messageTypeRows.filter((row) => row.id !== id)
	saveParameters()
}

function buildConnectionFilters(
	messageTypeRows: MessageTypeRow[]
): ConnectionFilter[] {
	return messageTypeRows
		.filter((row) => row.enabled)
		.map((row) => ({
			sourceIEDPattern: row.sourceIEDPattern,
			targetIEDPattern: row.targetIEDPattern,
			messageType: row.messageType
		}))
}

let connectionFilters = $derived.by(() => {
	return buildConnectionFilters(messageTypeRows)
})

function calculateFitToContainerZoom(): number {
	if (!htmlRoot || !diagramDimensions) return DEFAULT_ZOOM

	const containerWidth = htmlRoot.offsetWidth || DEFAULT_WIDTH
	const containerHeight = htmlRoot.offsetHeight || DEFAULT_HEIGHT

	const diagramWidth = diagramDimensions.width
	const diagramHeight = diagramDimensions.height

	if (diagramWidth === 0 || diagramHeight === 0) return DEFAULT_ZOOM

	const widthRatio = containerWidth / diagramWidth
	const heightRatio = containerHeight / diagramHeight

	return Math.min(widthRatio, heightRatio) * ZOOM_PADDING_FACTOR
}

function handleDiagramSizeCalculated(width: number, height: number) {
	diagramDimensions = { width, height }
	calculatedZoom = calculateFitToContainerZoom()
	saveParameters()
}

function saveParameters(): void {
	const params: CommunicationElementParameters = {
		selectedBays: Array.from(selectedBays),
		messageTypeRows,
		showLegend,
		showBayList,
		showIEDList,
		zoom: calculatedZoom,
		diagramDimensions
	}
	onContentChange(JSON.stringify(params))
}

$effect(() => {
	if (!htmlRoot) return
	tick().then(() => triggerDiagramReady?.())
})
</script>

{#if pluginGlobalStore.xmlDocument}
	<IedPatternHelpDialog bind:isOpen={isPatternHelpDialogOpen} />

	<div class="diagram-configuration">
		<div>Bay selection</div>
		<DiagramWithBaySelector bind:selectedBays onchange={saveParameters} />
		<div>Further details</div>
		<div class="further-details-options">
			<FormField>
				<Checkbox bind:checked={showLegend} onchange={saveParameters} />
				{#snippet label()}
					Show legend
				{/snippet}
			</FormField>
			<FormField>
				<Checkbox
					bind:checked={showBayList}
					onchange={saveParameters}
				/>
				{#snippet label()}
					Show list of bays
				{/snippet}
			</FormField>
			<FormField>
				<Checkbox
					bind:checked={showIEDList}
					onchange={saveParameters}
				/>
				{#snippet label()}
					Show list of IEDs and IED details
				{/snippet}
			</FormField>
		</div>

		<div class="communication-matrix-header">
			<div>Communication matrix</div>
			<Tooltip text="Pattern Help">
				<CustomIconButton
					icon="help"
					size="small"
					onclick={() => (isPatternHelpDialogOpen = true)}
				/>
			</Tooltip>
		</div>
		<div class="communication-matrix">
			{#each messageTypeRows as row (row.id)}
				<div class="matrix-row">
					<FormField>
						<Checkbox
							bind:checked={row.enabled}
							onchange={saveParameters}
						/>
					</FormField>
					<div class="row-fields">
						<Select
							bind:value={row.messageType}
							label="Message Type"
							variant="outlined"
							disabled={!row.enabled}
							onchange={saveParameters}
						>
							<Option value={MESSAGE_TYPE.GOOSE}>GOOSE</Option>
							<Option value={MESSAGE_TYPE.MMS}>MMS</Option>
							<Option value={MESSAGE_TYPE.SampledValues}
								>SampledValues</Option
							>
							<Option value={MESSAGE_TYPE.Unknown}>Unknown</Option
							>
						</Select>
						<Textfield
							bind:value={row.sourceIEDPattern}
							label="Source IED"
							variant="outlined"
							disabled={!row.enabled}
							onchange={saveParameters}
							placeholder="e.g., *PROT*"
						/>
						<Textfield
							bind:value={row.targetIEDPattern}
							label="Target IED"
							variant="outlined"
							disabled={!row.enabled}
							onchange={saveParameters}
							placeholder="e.g., *BAY*"
						/>
					</div>
					{#if messageTypeRows.length > 1}
						<span title="Remove row">
							<CustomIconButton
								icon="delete"
								size="small"
								onclick={() => removeMessageTypeRow(row.id)}
							/>
						</span>
					{/if}
				</div>
			{/each}
			<div class="add-row-button">
				<span title="Add filter row">
					<CustomIconButton
						icon="add"
						size="small"
						onclick={addMessageTypeRow}
					/>
				</span>
			</div>
		</div>
	</div>

	<div class="communication-element">
		<LegacyTheme>
			<div class="communication-preview-wrapper" bind:this={htmlRoot}>
				<TelemetryView
					root={pluginGlobalStore.xmlDocument as unknown as Element}
					showSidebar={false}
					selectedBays={selectedBays.size > 0
						? selectedBays
						: undefined}
					{connectionFilters}
					focusMode={true}
					isOutsidePluginContext={true}
					zoom={calculatedZoom}
					onDiagramSizeCalculated={handleDiagramSizeCalculated}
				/>
			</div>
		</LegacyTheme>
	</div>
{:else}
	<NoXmlWarning />
{/if}

<style>
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

	.communication-matrix-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
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
		gap: 0.5rem;
	}

	.row-fields {
		display: flex;
		gap: 0.5rem;
		flex: 1;
		align-items: center;
	}

	.row-fields :global(.mdc-text-field) {
		min-width: 0;
		flex: 1;
	}

	.row-fields :global(.mdc-select) {
		min-width: 180px;
		max-width: 180px;
	}

	.add-row-button {
		display: flex;
		justify-content: center;
		padding: 0.5rem;
	}
</style>
