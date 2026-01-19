<script lang="ts">
import {
	Button,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import { ssdImportStore } from '@/headless/stores'
import { loadFromLocal } from '@/headless/import'
import { bayStore } from '@/headless/stores/bay.store.svelte'

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
</script>

<div class="flex items-center justify-end space-x-5 px-4 pt-4 h-fit">
    {#if bayOptions.length > 0}
        <div class="ml-4">
            <SelectWorkaround
                bind:value={bayStore.selectedBay}
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
