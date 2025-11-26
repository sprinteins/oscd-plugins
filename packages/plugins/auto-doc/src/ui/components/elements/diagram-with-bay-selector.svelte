<script lang="ts">
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { IEDService } from '@oscd-plugins/core'
import { onMount } from 'svelte'

interface Props {
	selectedBay: string
}

let { selectedBay = $bindable('') }: Props = $props()

let availableBays: string[] = $state([])

function loadAvailableBays() {
	if (!pluginGlobalStore.xmlDocument) {
		availableBays = []
		return
	}
	try {
		const svc = new IEDService(
			pluginGlobalStore.xmlDocument.documentElement
		)
		availableBays = Array.from(svc.Bays())
	} catch (e) {
		console.error('Failed to load bays from IEDService', e)
		availableBays = []
	}
}

onMount(() => {
	loadAvailableBays()
})
</script>

<div class="diagram-bay-selector">
    <label for="bay-select">Select Bay:</label>
    <select id="bay-select" bind:value={selectedBay}>
        <option value="">All Bays</option>
        {#each availableBays as bay}
            <option value={bay}>{bay}</option>
        {/each}
    </select>
</div>
