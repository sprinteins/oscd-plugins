<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IED } from "../../diagram/networking"
	import { IED as IEDComponent } from "../../../../components/ied"
	import { Select } from "../../../../components/select"
	import { getNetworkingWithOpenPort } from "../../diagram/ied-helper"

	interface PortOption {
		label: string;
		port: string;
		cable: string;
	}

	// 
	// INPUT
	// 
	export let ied: IED
	export let existingCableName: string | null = null

	//
	// Internal
	//
	const dispatch = createEventDispatcher();
	let openPorts: PortOption[] = []
	let selectedIndex: number

	$: onIed(ied)

	function onIed(ied: IED): void {
		openPorts = getOpenPorts(ied)
		selectedIndex = getSelectedIndex()
	}

	function getSelectedIndex(): number {
		if (!existingCableName) {
			return 0
		}

		return openPorts.findIndex(p => p.cable === existingCableName)
	}

	function getOpenPorts(ied: IED): PortOption[] {
		return getNetworkingWithOpenPort(ied, existingCableName)
			.map(n => (
				{
					label: `Port ${n.port}, ${n.cable}`,
					port: n.port,
					cable: n.cable
				}
			))
	}

	function handleSelectionChange(event: CustomEvent<{ index: number }>): void {
		const selectedPort = openPorts[event.detail.index]

		dispatch("select", selectedPort.port)
	}
</script>


<div class="container">
	<IEDComponent label={ied.name} isSelected={true} isSelectable={false} />

	<div class="select-container">
		<Select
			on:select={handleSelectionChange}
			linkTargetIndex={selectedIndex}
			items={openPorts}
		>
		</Select>
	</div>
</div>

<style>
	.container {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 8px;
	}

	.select-container {
		width: 100%;
        padding: 0.5rem 0rem;
	}
</style>
