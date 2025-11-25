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
import { preferences$, type Preferences } from '../../../stores/_store-preferences'
// SERVICES
import { getIEDCommunicationInfos, getBays } from '../../../headless/services/ied/ied'
//TYPES
import type { IED } from '@oscd-plugins/core'

//
// INPUT
//

interface Props {
	root: Element;
	showSidebar?: boolean;
	selectedBays?: string[];
	selectedMessageTypes?: string[];
	focusMode?: boolean;
}

let { root, showSidebar = true, selectedBays, selectedMessageTypes, focusMode }: Props = $props();

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
	initInfos(root, $filterState, $preferences$, selectedBays, selectedMessageTypes, focusMode)
})

// Note: maybe have a mutex if there are too many changes
async function initInfos(
	root: Element,
	selectedFilter: SelectedFilter,
	preferences: Preferences,
	selectedBays?: string[],
	selectedMessageTypes?: string[],
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

	// Filter IEDs by selected bays if provided
	let filteredInfos = lastExtractedInfos
	if (selectedBays && selectedBays.length > 0) {
		filteredInfos = lastExtractedInfos.filter((ied) => {
			// Check if the IED belongs to any of the selected bays
			if (!ied.bays || ied.bays.size === 0) return false
			return Array.from(ied.bays).some((bay: string) => selectedBays.includes(bay))
		})
	}

	// Override filter and preferences if props provided
	const filterWithOverrides = selectedMessageTypes !== undefined
		? { ...selectedFilter, selectedMessageTypes }
		: selectedFilter

	const preferencesWithOverrides = focusMode !== undefined
		? { ...preferences, isFocusModeOn: focusMode }
		: preferences

	rootNode = await calculateLayout(
		filteredInfos,
		config,
		filterWithOverrides,
		preferencesWithOverrides
	)
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

<div class="root" class:showSidebar>
	{#if rootNode}
		<Diagram
			{rootNode}
			playAnimation={$preferences$.playConnectionAnimation}
			showConnectionArrows={$preferences$.showConnectionArrows}
			showBayLabels={!$preferences$.groupByBay}
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
		height: calc(100vh - var(--header-height));
		width: 100%;
		overflow-x: hidden;
	}
	
	.root.showSidebar {
		grid-template-columns: auto var(--sidebar-width);
	}
</style>
