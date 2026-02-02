<script lang="ts">
import {
	Button,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import {
	bayStore,
	bayTypesStore,
	equipmentMatchingStore,
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
	bayTypesStore.selectedBayType = null
}
</script>

<div class="flex items-center justify-end space-x-5 px-4 pt-4 h-fit">
    {#if bayOptions.length > 0}
        <div class="ml-4">
            <SelectWorkaround
                bind:value={bayStore.selectedBay}
                handleChange={handleBayChange}
                options={bayOptions}
                placeholder="Select a bay"
                class="w-64"
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
