<script lang="ts">
	import { calculateLayout } from "../_func-layout-calculation/node-layout"
	import { Diagram, type IEDConnection, type IEDConnectionWithCustomValues, type IEDNode, type RootNode } from "../../../components/diagram"
	import { Sidebar } from "../sidebar"
	import { extractIEDInfos, extractIEDInfosWithBay } from "../_func-layout-calculation/get-ieds"
	import {
		filterState,
		type SelectedFilter,
		selectConnection,
		selectIEDNode,
		selectBay,
		clearIEDSelection,
		toggleMultiSelectionOfIED,
	} from "../_store-view-filter"
	import type { Config } from "../_func-layout-calculation/config"
	import { preferences$, type Preferences  } from "../_store-preferences"
	import type { IEDCommInfo } from "@oscd-plugins/core"
    import BayContainer from "../../../components/diagram/bay-container/bay-container.svelte";
	
	// 
	// INPUT
	// 
	export let root: Element
	export let showSidebar = true

	let rootNode: RootNode | undefined = undefined
	$: initInfos(root, $filterState, $preferences$)
	let lastUsedRoot: Element | undefined = undefined
	let lastExtractedInfos: IEDCommInfo[] = []
	$: iedInfosWithBays = extractIEDInfosWithBay(root)
	$: bayOptions = Array.from(iedInfosWithBays.keys());

	// Note: maybe have a mutex if there are too many changes
	async function initInfos(
		root: Element,
		selectedFilter: SelectedFilter,
		preferences: Preferences,
	) {
		if (!root) {
			console.info({ level: "info", msg: "initInfos: no root" })
			return []
		}

		if(root !== lastUsedRoot) {
			const iedInfos = extractIEDInfos(root)
						lastExtractedInfos = iedInfos
			lastUsedRoot = root
		}
		rootNode = await calculateLayout(lastExtractedInfos, config, selectedFilter, preferences)
	}
	
	const config: Config = {
		iedWidth:  		150,
		iedHeight: 		40,
		bayLabelHeight: 15,
		bayLabelGap: 	2
		// spacingBetweenNodes: 100,
		// spacingBase: 40,
		// heightPerConnection: 20,
	}
	
	function handleIEDSelect(e: CustomEvent<IEDNode>) {
		selectIEDNode(e.detail)
	}
	function handleIEDAdditiveSelect(e: CustomEvent<IEDNode>) {
		toggleMultiSelectionOfIED(e.detail)
	}
	function handleBaySelect(e: CustomEvent<string>) {
		selectBay(e.detail)
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
			on:iedselect={handleIEDSelect}
			on:bayselect={handleBaySelect}
			on:iedadditiveselect={handleIEDAdditiveSelect}
			on:connectionclick={handleConnectionClick}
			on:clearclick={handleClearClick}
		/>
		{#if showSidebar}
			<Sidebar 
				{rootNode}
				{iedInfosWithBays}
				{bayOptions}
			/>
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
