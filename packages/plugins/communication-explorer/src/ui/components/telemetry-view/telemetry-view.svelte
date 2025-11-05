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
import type { CommunicationMatrix } from '@/headless/types';

//
// INPUT
//

interface Props {
	root: Element;
	isPluginMode?: boolean;
	showSidebar?: boolean;
	bayFilter?: string;
	communicationMatrix?: CommunicationMatrix;
}

let { 
	root, 
	isPluginMode = true,
	showSidebar = true,
	bayFilter = undefined,
	communicationMatrix = undefined
}: Props = $props();

let rootNode: RootNode | undefined = $state(undefined)
let lastUsedRoot: Element | undefined = undefined
let lastExtractedInfos: IED.CommunicationInfo[] = []
let lastExtractedBays: Set<string> = $state(new Set())
let lastAppliedMatrix: CommunicationMatrix | undefined = undefined
let pendingIEDSelection: Set<string> | undefined = undefined

const config: Config = {
	iedWidth: 150,
	iedHeight: 40,
	bayLabelHeight: 15,
	bayLabelGap: 2
}

$effect(() => {
	if (communicationMatrix && communicationMatrix !== lastAppliedMatrix && communicationMatrix.filters) {
		console.log('Applying communication matrix:', communicationMatrix)
		applyCommunicationMatrixToFilterState(communicationMatrix)
		lastAppliedMatrix = communicationMatrix
	}
})

$effect(() => {
	initInfos(root, $filterState, $preferences$, bayFilter)
})

async function initInfos(
	root: Element,
	selectedFilter: SelectedFilter,
	preferences: Preferences,
	bayFilter?: string
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

	let filteredIEDs = lastExtractedInfos
	if (bayFilter) {
		filteredIEDs = filteredIEDs.filter(ied => 
			ied.bays?.has(bayFilter)
		)
	}

	rootNode = await calculateLayout(
		filteredIEDs,
		config,
		selectedFilter,
		preferences
	)
	
	if (pendingIEDSelection && rootNode?.children) {
		const iedNames = pendingIEDSelection
		const iedNodesToSelect = rootNode.children.filter(node => 
			iedNames.has(node.label)
		)
		if (iedNodesToSelect.length > 0) {
			filterState.update((state) => ({
				...state,
				selectedIEDs: iedNodesToSelect
			}))
		}
		pendingIEDSelection = undefined
	}
}

function applyCommunicationMatrixToFilterState(matrix: CommunicationMatrix) {
	const { filters } = matrix
	
	if (!filters || filters.length === 0) {
		console.log('No filters in communication matrix')
		return
	}
	
	const messageTypes = new Set<string>()
	const relevantIEDNames = new Set<string>()
	
	for (const filter of filters) {
		messageTypes.add(filter.type)
		
		if (filter.sourceIEDs) {
			for (const ied of filter.sourceIEDs) {
				relevantIEDNames.add(ied)
			}
		}
		if (filter.targetIEDs) {
			for (const ied of filter.targetIEDs) {
				relevantIEDNames.add(ied)
			}
		}
	}
	
	filterState.update((state) => {
		const newState = { ...state }
		
		if (messageTypes.size > 0) {
			newState.selectedMessageTypes = Array.from(messageTypes)
		}
		
		return newState
	})
	
	if (relevantIEDNames.size > 0) {
		pendingIEDSelection = relevantIEDNames
	}
	
	preferences$.update((prefs) => {
		return {
			...prefs,
			isFocusModeOn: true
		}
	})
}

async function handleBaySelect(bay: string) {
	clearIEDSelection()
	await initInfos(root, $filterState, $preferences$)
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

<div class="root" class:showSidebar class:pluginMode={isPluginMode}>
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
		{#if showSidebar && isPluginMode}
			{console.log('Rendering Sidebar with bays:', Array.from(lastExtractedBays))}
			<Sidebar {rootNode} bays={Array.from(lastExtractedBays)} />
		{/if}
	{/if}
</div>

<style>
	.root {
		--header-height: 0px;
		display: grid;
		grid-template-columns: auto 0;
		height: calc(100vh - var(--header-height));
		width: 100%;
		overflow-x: hidden;
	}

	.root.pluginMode {
		--header-height: 128px;
	}
	
	.root.showSidebar {
		grid-template-columns: auto var(--sidebar-width);
	}
</style>
