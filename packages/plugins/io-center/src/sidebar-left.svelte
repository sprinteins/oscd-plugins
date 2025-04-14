<script lang="ts">
// STORES
import { store } from './store.svelte'
import { iedTreeStore } from '@/headless/stores'
// COMPONENTS
import { SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import IedTree from '@/ui/components/left-sidebar/ied-tree.svelte'
import SearchBar from '@/ui/components/common/search-bar.svelte'

//====== DERIVED ======//

const iedOptions = $derived(
	iedTreeStore.iEDList.map((ied) => ({
		value: ied,
		label: ied.name
	}))
)

//====== FUNCTIONS ======//

function resetAllSelectionOnChange() {
	iedTreeStore.selectedDataObject = undefined
	store._selectedLogicalConditioners = []
	store._selectedLogicalPhysicals = []
}
</script>

<aside class="flex flex-col bg-sidebar h-full overflow-hidden p-4 space-y-5">
	<section class="flex flex-col space-y-3">
		<h1 class="font-black text-xl mb-3">Data Object selector</h1>
		<SelectWorkaround
			bind:value={iedTreeStore.selectedIED}
			placeholder="Select an IED"
			options={iedOptions}
			handleChange={resetAllSelectionOnChange}
		/>
		<SearchBar bind:searchTerm={iedTreeStore.searchInputValue} placeholder="Search DO" />
	</section>

	{#if iedTreeStore.treeItems.length > 0}
		<section class="overflow-y-auto">
			<IedTree />
		</section>
	{/if}
</aside>

