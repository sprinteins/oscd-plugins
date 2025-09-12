<script lang="ts">
import { calculateLayout } from '../../headless/index.js'
import { Sidebar } from './sidebar/index.js'
import { Diagram } from './diagram/index.js'
import {
	toggleMultiSelectionOfIED,
	selectIEDNode,
	clearIEDSelection,
	selectConnection,
	filterState,
	type SelectedFilter
} from '../../headless/index.js'
import type { Config, IEDNode, IEDConnection, IEDConnectionWithCustomValues } from '../../headless/index.js'
import type { RootNode } from '@oscd-plugins/ui/src/components/diagram/index.js'
import { preferences$, type Preferences } from '../../headless/index.js'
// SERVICES
import { getIEDCommunicationInfos, getBays } from '../../headless/index.js'
// TYPES
import type { IED } from '@oscd-plugins/core'

//
// INPUT
//
export let root: Element
export let showSidebar = true

let rootNode: RootNode | undefined = undefined
$: initInfos(root, $filterState, $preferences$)
let lastUsedRoot: Element | undefined = undefined
let lastExtractedInfos: IED.CommunicationInfo[] = []
let lastExtractedBays: Set<string>

// Note: maybe have a mutex if there are too many changes
async function initInfos(
	root: Element,
	selectedFilter: SelectedFilter,
	preferences: Preferences
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
	rootNode = await calculateLayout(
		lastExtractedInfos,
		config,
		selectedFilter,
		preferences
	)
}

const config: Config = {
	iedWidth: 150,
	iedHeight: 40,
	bayLabelHeight: 15,
	bayLabelGap: 2
}

function handleIEDSelect(e: CustomEvent<IEDNode>) {
	selectIEDNode(e.detail)
}
function handleIEDAdditiveSelect(e: CustomEvent<IEDNode>) {
	toggleMultiSelectionOfIED(e.detail)
}
async function handleBaySelect(e: CustomEvent<string>) {
	clearIEDSelection()
	await initInfos(root, $filterState, $preferences$)
	if (rootNode) {
		for (const node of rootNode.children) {
			if (node.bays?.has(e.detail)) {
				// Convert IEDElkNode to IEDNode format expected by the function
				const iedNode = {
					id: node.label, // Use label as id since IEDElkNode doesn't have id
					label: node.label,
					x: node.x || 0,
					y: node.y || 0,
					width: node.width || 0,
					height: node.height || 0,
					bays: node.bays,
					details: node.details,
					isRelevant: node.isRelevant,
					isBayNode: node.isBayNode
				}
				toggleMultiSelectionOfIED(iedNode)
			}
		}
	}
}
function handleConnectionClick(e: CustomEvent<IEDConnection>) {
	// temp till fully migrated: map element to enhanced data model
	const selectedConnection = e.detail as IEDConnectionWithCustomValues
	selectConnection(selectedConnection)
}
function handleClearClick() {
	clearIEDSelection()
}
</script>

<div class="root" class:showSidebar>
	{#if rootNode}
		<Diagram
			{rootNode}
			playAnimation={$preferences$.playConnectionAnimation}
			showConnectionArrows={$preferences$.showConnectionArrows}
			showBayLabels={!$preferences$.groupByBay}
			on:iedselect={handleIEDSelect}
			on:bayselect={handleBaySelect}
			on:iedadditiveselect={handleIEDAdditiveSelect}
			on:connectionclick={handleConnectionClick}
			on:clearclick={handleClearClick}
		/>
		{#if showSidebar}
			<Sidebar {rootNode} bays={Array.from(lastExtractedBays)}/>
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