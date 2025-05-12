<script lang="ts">
// STORES
import { canvasStore, iedStore, logicalStore } from '@/headless/stores'
// COMPONENTS
import { SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import IedTree from '@/ui/sidebar-left/ied-tree.svelte'
import SearchBar from '@/ui/common/search-bar.svelte'

//====== DERIVED ======//

const iedOptions = $derived(
	iedStore.iEDList.map((ied) => ({
		value: ied.uuid,
		label: ied.name
	}))
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
		<SelectWorkaround
			bind:value={iedStore.selectedIEDUuid}
			placeholder="Select an IED"
			options={iedOptions}
			handleChange={resetAllStatesOnChange}
		/>
		<SearchBar bind:searchInputValue={iedStore.searchInputValue} placeholder="Search DO" />
	</section>

	{#if iedStore.treeItems.length > 0}
		<section class="overflow-y-auto">
			<IedTree />
		</section>
	{/if}
</aside>

