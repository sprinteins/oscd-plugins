<script lang="ts">
	import type { IED } from "../../diagram/networking"
	import { IED as IEDComponent } from "@oscd-plugins/ui"
	import { Select } from "@oscd-plugins/ui"
	import { getNetworkingWithOpenPort } from "../../diagram/ied-helper"

	interface PortOption {
		label: string;
		port: string;
		cable: string;
	}

	// 
	// INPUT
	
	interface Props {
		// 
		ied: IED;
		existingCableName?: string | null;
		select: (port: string) => void;
	}

	let { ied, existingCableName = null, select }: Props = $props();

	//
	// Internal
	//
	let openPorts: PortOption[] = $derived(getOpenPorts(ied))
	let selectedIndex: number = $derived(getSelectedIndex())

	function getSelectedIndex(): number {
		if (!existingCableName) {
			return 0
		}

		const portIndex = openPorts.findIndex(p => p.cable === existingCableName)

		return portIndex
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

	function handleSelectionChange(index: number): void {
		const selectedPort = openPorts[index]
		if(!selectedPort){ return }

		select(selectedPort.port);
	}
</script>


<div class="container">
	<IEDComponent label={ied.name} isSelected={true} isSelectable={false} />

	<div class="select-container">
		<Select
			handleSelect={handleSelectionChange}
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
