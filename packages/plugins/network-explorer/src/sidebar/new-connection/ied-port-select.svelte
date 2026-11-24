<script lang="ts">
import { Label, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import { getNetworkingWithOpenPort } from '../../diagram/ied-helper'
import type { IED } from '../../diagram/networking'

interface Props {
	ied: IED
	existingCableName?: string | null
	selectedPort: string
}

let {
	ied,
	existingCableName = null,
	selectedPort = $bindable()
}: Props = $props()

const options = $derived(
	getNetworkingWithOpenPort(ied, existingCableName).map((networking) => ({
		label: `Port ${networking.port}, ${networking.cable}`,
		value: networking.port
	}))
)
</script>

<div class="port-selector">
	<p class="ied-name">{ied.name}</p>
	<Label.Root for={`port-${ied.name}`}>Port</Label.Root>
	<SelectWorkaround
		id={`port-${ied.name}`}
		bind:value={selectedPort}
		options={options}
	/>
</div>

<style>
	.port-selector {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.ied-name {
		margin: 0;
		font-weight: 500;
	}
</style>
