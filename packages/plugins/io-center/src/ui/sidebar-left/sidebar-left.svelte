<script lang="ts">
// STORES
import { canvasStore, iedStore, logicalStore } from '@/headless/stores'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// COMPONENTS
import { Select } from '@oscd-plugins/core-ui-svelte'
import IedTree from '@/ui/sidebar-left/ied-tree.svelte'
import SearchBar from '@/ui/common/search-bar.svelte'

//====== DERIVED ======//

const iedOptions = $derived(
	iedStore.iEDList.map((ied) => ({
		value: ied.uuid,
		label: ied.name
	}))
)

const triggerContent = $derived(
	iedOptions.find((f) => f.value === iedStore.selectedIEDUuid)?.label ??
		'Select an IED'
)

const portalTarget = $derived(
	pluginGlobalStore.host?.shadowRoot as HTMLElement | undefined
)

//====== FUNCTIONS ======//

function resetAllStatesOnChange() {
	iedStore.resetSidebarStates()
	logicalStore.resetStates()
	canvasStore.resetStates()
}
</script>

<aside class="flex flex-col bg-sidebar h-full overflow-hidden p-4 space-y-5">
	<section class="flex flex-col space-y-3">
		<h2 class="font-black text-xl mb-3">Data Object selector</h2>
		<Select.Root type="single" name="do-select" bind:value={iedStore.selectedIEDUuid} onValueChange={resetAllStatesOnChange}>
			<Select.Trigger class="w-full">
				{triggerContent}
			</Select.Trigger>
			<Select.Content portalProps={{ to: portalTarget }} class="h-60 overflow-y-auto">
				{#each iedOptions as option}
					<Select.Item value={option.value} label={option.label}>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<SearchBar bind:searchInputValue={iedStore.searchInputValue} placeholder="Search DO" />
	</section>

	{#if iedStore.treeItems.length > 0}
		<section class="overflow-y-auto">
			<IedTree />
		</section>
	{/if}
</aside>

