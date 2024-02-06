<script lang="ts">
	import type { IEDNetworkInfoV3 } from "@oscd-plugins/core"
	import { IED } from "../../../../components/ied"
	import { Select } from "../../../../components/select"
	import type { NewConnectionBetweenNodes } from "../../store/index"

	// 
	// INPUT
	// 
	export let newConnectionBetweenNodes: NewConnectionBetweenNodes

	//
	// Internal
	//
	let newConnectionSource: IEDNetworkInfoV3
    let newConnectionTarget: IEDNetworkInfoV3
    let cableName: string
	let sourceOpenPorts: {label: string}[] = []
	let targetOpenPorts: {label: string}[] = []
	let sourceSelectedPort: number
	let targetSelectedPort: number

	$: onNewConnection(newConnectionBetweenNodes)

	function onNewConnection(newConnectionBetweenNodes: NewConnectionBetweenNodes) {
		console.log(newConnectionBetweenNodes)
        if (!newConnectionBetweenNodes) {
            throw new Error('Input newConnectionBetweenNodes may not be null')
        }

        newConnectionSource = newConnectionBetweenNodes.source
        newConnectionTarget = newConnectionBetweenNodes.target

		sourceOpenPorts = getOpenPorts(newConnectionSource)
		targetOpenPorts = getOpenPorts(newConnectionTarget)

		sourceSelectedPort = 0
		targetSelectedPort = 0

        cableName = generateCableName()
    }

	function getOpenPorts(ied: IEDNetworkInfoV3): {label: string}[] {
		return ied.networkInfo.connections
			.filter(c => !c.connectedIed)
			.map(c => ({label: `Port ${c.port}, Cable ${c.cable}`}))
	}

	function generateCableName(): string {
        return crypto.randomUUID().substring(0, 6)
    }

	function handleTargetInputChange(e) {
		console.log(e)
	}
</script>

<div>
	<h3>{cableName}</h3>

	<div>
		<IED label={newConnectionSource.iedName} isSelected={true} isSelectable={false} />

		<Select
			on:select={handleTargetInputChange}
			linkTargetIndex={sourceSelectedPort}
			items={sourceOpenPorts}
		>
			<option value={-1} disabled selected />
			{#each sourceOpenPorts as port, index}
				<option value={index}>{port}</option>
			{/each}
		</Select>
	</div>
</div>