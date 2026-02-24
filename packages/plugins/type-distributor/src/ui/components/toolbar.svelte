<script lang="ts">
import {
	Button,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import {
	assignedLNodesStore,
	bayStore,
	equipmentMatchingStore,
	getBayTypeWithTemplates,
	ssdImportStore
} from '@/headless/stores'
import { loadFromLocal } from '@/headless/import'

const bays = $derived(
	pluginGlobalStore.xmlDocument?.querySelectorAll(
		'Substation > VoltageLevel > Bay'
	)
)

const bayOptions = $derived(
	Array.from(bays ?? []).map((bay) => ({
		value: bay.getAttribute('name') ?? '',
		label: bay.getAttribute('name') ?? ''
	}))
)

function handleBayChange() {
	equipmentMatchingStore.reset()
	assignedLNodesStore.rebuild()
	ssdImportStore.selectedBayType = null
}

const assignedBayTypeWithTemplates = $derived(
	bayStore.assignedBayTypeUuid
		? getBayTypeWithTemplates(bayStore.assignedBayTypeUuid)
		: null
)

const isBaySwitchLocked = $derived(
	assignedBayTypeWithTemplates
		? !assignedLNodesStore.areAllLNodesAssigned(
				assignedBayTypeWithTemplates
			)
		: false
)
</script>

<div class="flex items-center justify-end space-x-5 px-4 pt-4 h-fit">
    {#if bayOptions.length > 0}
        <div
            class="ml-4"
            title={isBaySwitchLocked
                ? "Finish assigning all LNodes to IEDs before switching bays."
                : ""}
        >
            <SelectWorkaround
                bind:value={bayStore.selectedBay}
                handleChange={handleBayChange}
                options={bayOptions}
                placeholder="Select a bay"
                class="w-64"
                disabled={isBaySwitchLocked}
            />
        </div>
    {/if}
    <Button.Root onclick={() => ssdImportStore.fileInput?.click()}>
        Import SSD File
    </Button.Root>
</div>

<input
    type="file"
    accept=".ssd"
    bind:this={ssdImportStore.fileInput}
    onchange={() => loadFromLocal()}
    class="hidden"
/>
