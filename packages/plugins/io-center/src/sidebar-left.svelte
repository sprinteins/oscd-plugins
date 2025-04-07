<script lang="ts">
// STORES
import { store } from './store.svelte'
// COMPONENTS
import { SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import SearchBar from '@/ui/components/common/search-bar.svelte'
import ObjectTree from './ui/components/object-tree/object-tree.svelte'

//====== DERIVED ======//

const iedOptions = $derived(
	store.iedList.map((ied) => ({ value: { name: ied.name }, label: ied.name }))
)

//====== FUNCTIONS ======//

function resetAllSelectionOnChange() {
	store.selectedDataObject = null
	store._selectedLogicalConditioners = []
	store._selectedLogicalPhysicals = []
}
</script>

<aside class="flex flex-col bg-sidebar h-full overflow-hidden p-4 space-y-5">
	<section class="flex flex-col space-y-3">
		<h1 class="font-black text-xl mb-3">Data Object selector</h1>
		<SelectWorkaround
			bind:value={store.selectedIED}
			placeholder="Select an IED"
			options={iedOptions}
			handleChange={resetAllSelectionOnChange}
		/>
		<SearchBar bind:searchTerm={store.objectTreeSearchInputValue} placeholder="Search DO" />
	</section>

	{#if store.objectTree.ied.children.length > 0}
	<section class="overflow-y-auto">
		<ObjectTree />
	</section>
	{/if}
</aside>
