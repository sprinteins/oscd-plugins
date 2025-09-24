<!-- @migration-task Error while migrating Svelte code: `$:` is not allowed in runes mode, use `$derived` or `$effect` instead
https://svelte.dev/e/legacy_reactive_statement_invalid -->
<script lang="ts">
import { calculateLayout } from '../../../headless/services/_func-layout-calculation/node-layout'
import {
// 	Diagram,
// 	type IEDConnection,
// 	type IEDConnectionWithCustomValues,
// 	type IEDNode,
	type RootNode
} from '../diagram'
import { Sidebar } from '../sidebar'
import {
	filterState,
	type SelectedFilter,
	selectConnection,
	selectIEDNode,
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
	}

	let { root, showSidebar = true }: Props = $props();

let rootNode: RootNode | undefined = undefined
let lastUsedRoot: Element | undefined = undefined
let lastExtractedInfos: IED.CommunicationInfo[] = []
let lastExtractedBays: Set<string>

const config: Config = {
	iedWidth: 150,
	iedHeight: 40,
	bayLabelHeight: 15,
	bayLabelGap: 2
}

$effect(() => {
	initInfos(root, $filterState, $preferences$)
})

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

// function handleIEDSelect(e: CustomEvent<IEDNode>) {
// 	selectIEDNode(e.detail)
// }
// function handleIEDAdditiveSelect(e: CustomEvent<IEDNode>) {
// 	toggleMultiSelectionOfIED(e.detail)
// }
// async function handleBaySelect(e: CustomEvent<string>) {
// 	clearIEDSelection()
// 	await initInfos(root, $filterState, $preferences$)
// 	for (const node of rootNode.children) {
// 		if (node.bays?.has(e.detail)) {
// 			toggleMultiSelectionOfIED(node)
// 		}
// 	}
// }
// function handleConnectionClick(e: CustomEvent<IEDConnection>) {
// 	// temp till fully migrated: map element to enhanced data model
// 	const selectedConnection = e.detail as IEDConnectionWithCustomValues
// 	selectConnection(selectedConnection)
// }
// function handleClearClick() {
// 	clearIEDSelection()
// }
</script>

<div class="root" class:showSidebar>
	<!-- {#if rootNode} -->
		<!-- <Diagram
			{rootNode}
			playAnimation={$preferences$.playConnectionAnimation}
			showConnectionArrows={$preferences$.showConnectionArrows}
			showBayLabels={!$preferences$.groupByBay}
			on:iedselect={handleIEDSelect}
			on:bayselect={handleBaySelect}
			on:iedadditiveselect={handleIEDAdditiveSelect}
			on:connectionclick={handleConnectionClick}
			on:clearclick={handleClearClick}
		/> -->
		{#if showSidebar}
			<Sidebar {rootNode} bays={Array.from(new Set())} />
		{/if}
	<!-- {/if} -->
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
