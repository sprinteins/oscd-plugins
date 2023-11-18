<script lang="ts">
	import type { IEDCommInfo } from "@oscd-plugins/core"
	import { Diagram, type IEDConnection, type IEDConnectionWithCustomValues, type IEDNode, type RootNode } from "."
	import { Example } from "../internal"
	import { calculateLayout } from "../../plugins/communication-explorer/_func-layout-calculation"
	import { clearIEDSelection, selectConnection, selectIEDNode, filterState, toggleMultiSelectionOfIED } from "../../plugins/communication-explorer/_store-view-filter"
	import type { Config } from "../../plugins/communication-explorer/_func-layout-calculation/config"
	import { preferences$ } from "../../plugins/communication-explorer/_store-preferences"

	const _config: Config = {
		height:              40,
		width:               100,
		spacingBase:         10,
		spacingBetweenNodes: 100,
	}
	
	const iedInfos: IEDCommInfo[] = [
		{iedName: "IED_1-1", published: [], received: []},
		{iedName: "IED_1-2", published: [], received: []},
		
		{iedName: "IED_2-1", published: [], received: []},
		{iedName: "IED_2-2", published: [], received: []},

		{iedName: "IED_3-1", published: [], received: []},
		{iedName: "IED_3-2", published: [], received: []},
	]

	iedInfos[0].received.push({
		iedName:     iedInfos[1].iedName,
		serviceType: "GOOSE",
		srcCBName:   "Dataset_1",
		data:        [],
		datSet:      ""
})
	iedInfos[2].received.push({
		iedName:     iedInfos[3].iedName,
		serviceType: "SMV",
		srcCBName:   "Dataset_1",
		data:        [],
		datSet:      ""
})
	iedInfos[4].published.push({
		id:            "1",
		name:          "name",
		targetIEDName: iedInfos[5].iedName,
		serviceType:   "MMS",
		serviceDatSet: "",
		serviceCbName: ""
})

	let rootNode: RootNode	
	$: {
		(async function (){
			rootNode = await calculateLayout(iedInfos, _config, $filterState, $preferences$)
		})()
	}

	function handleIEDSelect(e: CustomEvent<IEDNode>) {
		selectIEDNode(e.detail)
	}
	function handleIEDAdditiveSelect(e: CustomEvent<IEDNode>) {
		toggleMultiSelectionOfIED(e.detail)
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

<Example name="Diagram: Different Connection Types">
	<label>Spacing Between Layers<input type="range" min="10" max="100" bind:value={_config.spacingBase} /> {_config.spacingBase}</label>
	<label>Spacing In Layers<input type="range" min="10" max="200" bind:value={_config.spacingBetweenNodes} /> {_config.spacingBetweenNodes}</label>
	<hr />

	<div class="container" >
		{#if rootNode}
			<Diagram 
				rootNode={rootNode} 
				on:iedselect={handleIEDSelect}
				on:iedadditiveselect={handleIEDAdditiveSelect} 
				on:connectionclick={handleConnectionClick}
				on:clearclick={handleClearClick}
			/>
		{/if}
	</div>
</Example>

<style>
	.container {
		width: 500px;
		height: 200px;
		border: grey solid thin;
	}

	label{
		display: flex;
		align-items: center;
		justify-content: left;
		gap: 1rem;
	}
</style>
