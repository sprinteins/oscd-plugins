<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IED } from "../../diagram/networking"
	import { IED as IEDComponent } from "../../../../components/ied"
	import { Select } from "../../../../components/select"
	import { getNetworkingWithOpenPort } from "../../diagram/ied-helper"

	interface PortOption {
		label: string;
		port: string;
	}

	// 
	// INPUT
	// 
	export let ied: IED

	//
	// Internal
	//
	const dispatch = createEventDispatcher();
	let openPorts: PortOption[] = []
	let selectedIndex: number

	$: onIed(ied)

	function onIed(ied: IED): void {
		openPorts = getOpenPorts(ied)
		selectedIndex = 0
	}

	function getOpenPorts(ied: IED): PortOption[] {
		return getNetworkingWithOpenPort(ied)
			.map(n => (
				{
					label: `Port ${n.port}, ${n.cable}`,
					port: n.port,
				}
			))
	}

	function handleSelectionChange(event: CustomEvent<{ index: number }>): void {
		const selectedPort = openPorts[event.detail.index]

		dispatch("select", selectedPort.port)
	}
</script>


<div>
	<IEDComponent label={ied.name} isSelected={true} isSelectable={false} />

	<Select
		on:select={handleSelectionChange}
		linkTargetIndex={selectedIndex}
		items={openPorts}
	>
	</Select>
</div>
