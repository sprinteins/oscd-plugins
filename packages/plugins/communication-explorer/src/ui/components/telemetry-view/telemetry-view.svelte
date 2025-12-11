<script lang="ts">
import { calculateLayout } from '../../../headless/services/_func-layout-calculation/node-layout'
import {
	Diagram,
	type IEDConnection,
	type IEDConnectionWithCustomValues,
	type RootNode
} from '../diagram'
import { Sidebar } from '../sidebar'
import {
	filterState,
	type SelectedFilter,
	selectConnection,
	selectIEDElkNode,
	clearIEDSelection,
	toggleMultiSelectionOfIED
} from '../../../stores/_store-view-filter'
import type { Config } from '../../../headless/services/_func-layout-calculation/config'
import {
	preferences$,
	type Preferences
} from '../../../stores/_store-preferences'
import {
	getIEDCommunicationInfos,
	getBays
} from '../../../headless/services/ied/ied'
import type { IED } from '@oscd-plugins/core'

export interface ConnectionFilter {
	sourceIEDs: string[]
	targetIEDs: string[]
	messageType: string
}

interface Props {
	root: Element
	showSidebar?: boolean
	isOutsidePluginContext?: boolean
	selectedBays?: Set<string>
	selectedMessageTypes?: string[]
	connectionFilters?: ConnectionFilter[]
	focusMode?: boolean
	zoom?: number
	onDiagramSizeCalculated?: (width: number, height: number) => void
}

let {
	root,
	showSidebar = true,
	isOutsidePluginContext = false,
	selectedBays,
	selectedMessageTypes,
	connectionFilters,
	focusMode,
	zoom,
	onDiagramSizeCalculated
}: Props = $props()

let rootNode: RootNode | undefined = $state(undefined)
let lastUsedRoot: Element | undefined = undefined
let lastExtractedInfos: IED.CommunicationInfo[] = []
let lastExtractedBays: Set<string> = $state(new Set())

const config: Config = {
	iedWidth: 150,
	iedHeight: 40,
	bayLabelHeight: 15,
	bayLabelGap: 2
}

$effect(() => {
	initInfos(
		root,
		$filterState,
		$preferences$,
		selectedBays,
		selectedMessageTypes,
		connectionFilters,
		focusMode
	)
})

// Note: maybe have a mutex if there are too many changes
async function initInfos(
	root: Element,
	selectedFilter: SelectedFilter,
	preferences: Preferences,
	selectedBays?: Set<string>,
	selectedMessageTypes?: string[],
	connectionFilters?: ConnectionFilter[],
	focusMode?: boolean
) {
	if (!root) {
		console.info({ level: 'info', msg: 'initInfos: no root' })
		return []
	}

	if (root !== lastUsedRoot) {
		const iedInfos = getIEDCommunicationInfos(root)
		lastExtractedInfos = iedInfos
		lastExtractedBays = getBays(root)
		lastUsedRoot = root
	}

	let filteredInfos = lastExtractedInfos

	if (connectionFilters && connectionFilters.length > 0) {
		const visibleIEDs = new Set<string>()
		for (const filter of connectionFilters) {
			for (const ied of filter.sourceIEDs) {
				visibleIEDs.add(ied)
			}
			for (const ied of filter.targetIEDs) {
				visibleIEDs.add(ied)
			}
		}

		filteredInfos = lastExtractedInfos
			.filter((ied) => visibleIEDs.has(ied.iedName))
			.map((ied) => {
				const filteredPublished = ied.published.filter((pub) => {
					return connectionFilters.some((filter) => {
						const sourceMatch =
							filter.sourceIEDs.length === 0 ||
							filter.sourceIEDs.includes(ied.iedName)
						const targetMatch =
							filter.targetIEDs.length === 0 ||
							filter.targetIEDs.includes(pub.targetIEDName)
						const typeMatch = pub.serviceType === filter.messageType
						const matches = sourceMatch && targetMatch && typeMatch
						return matches
					})
				})

				const filteredReceived = ied.received.filter((rec) => {
					return connectionFilters.some((filter) => {
						const sourceMatch =
							filter.sourceIEDs.length === 0 ||
							filter.sourceIEDs.includes(rec.iedName)
						const targetMatch =
							filter.targetIEDs.length === 0 ||
							filter.targetIEDs.includes(ied.iedName)
						const typeMatch = rec.serviceType === filter.messageType
						const matches = sourceMatch && targetMatch && typeMatch
						return matches
					})
				})

				return {
					...ied,
					published: filteredPublished,
					received: filteredReceived
				}
			})
	} else if (selectedBays && selectedBays.size > 0) {
		filteredInfos = lastExtractedInfos.filter((ied) => {
			if (!ied.bays || ied.bays.size === 0) return false
			return Array.from(ied.bays).some((bay: string) =>
				selectedBays.has(bay)
			)
		})
	}

	const filterWithOverrides =
		selectedMessageTypes !== undefined
			? { ...selectedFilter, selectedMessageTypes }
			: selectedFilter

	const preferencesWithOverrides =
		focusMode !== undefined
			? { ...preferences, isFocusModeOn: focusMode }
			: preferences

	rootNode = await calculateLayout(
		filteredInfos,
		config,
		filterWithOverrides,
		preferencesWithOverrides
	)

	if (rootNode && onDiagramSizeCalculated) {
		onDiagramSizeCalculated(rootNode.width || 0, rootNode.height || 0)
	}
}

async function handleBaySelect(bay: string) {
	clearIEDSelection()
	await initInfos(root, $filterState, $preferences$, selectedBays)
	if (rootNode?.children) {
		for (const node of rootNode.children) {
			if (node.bays?.has(bay)) {
				toggleMultiSelectionOfIED(node)
			}
		}
	}
}

function handleConnectionClick(connection: IEDConnection) {
	// temp till fully migrated: map element to enhanced data model
	const selectedConnection = connection as IEDConnectionWithCustomValues
	selectConnection(selectedConnection)
}
</script>

<div
	class="root"
	class:showSidebar
	class:outsidePluginContext={isOutsidePluginContext}
>
	{#if rootNode}
		<Diagram
			{rootNode}
			playAnimation={$preferences$.playConnectionAnimation}
			showConnectionArrows={$preferences$.showConnectionArrows}
			showBayLabels={!$preferences$.groupByBay}
			{zoom}
			{isOutsidePluginContext}
			handleIEDSelect={selectIEDElkNode}
			{handleBaySelect}
			handleIEDAdditiveSelect={toggleMultiSelectionOfIED}
			{handleConnectionClick}
			handleClearClick={clearIEDSelection}
		/>
		{#if showSidebar}
			{console.log('Rendering Sidebar with bays:', Array.from(lastExtractedBays))}
			<Sidebar {rootNode} bays={Array.from(lastExtractedBays)} />
		{/if}
	{/if}
</div>

<style>
	.root {
		--header-height: 128px;
		display: grid;
		grid-template-columns: auto 0;
		width: 100%;
		overflow-x: hidden;
		height: calc(100vh - var(--header-height));
	}

	.root.showSidebar {
		grid-template-columns: auto var(--sidebar-width);
	}

	.root.outsidePluginContext {
		height: 100%;
	}
</style>
