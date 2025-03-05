<script lang="ts">
import { LP_TYPE } from '@/headless/constants'
import type { Nullable } from '@/types'
import { Plus } from 'lucide-svelte'
import store from '../../../store.svelte'
import SearchBar from '../common/search-bar.svelte'
import CreateLpDialog from './create-lp-dialog.svelte'
import FilterButtons from './filter-buttons.svelte'
import LpElement from './lp-element.svelte'
import type { LpElement as LpElementType, LpTypes } from './types.lp-list'

type Props = {
	addLp: () => void
}

let { addLp }: Props = $props()

let searchTerm = $state('')

let selectedTypeToShow = $state<Nullable<LpTypes>>(null)
let showLinked = $state(true)
let showUnlinked = $state(true)

const filteredList = $derived.by(() =>
	store.lpList
		.filter((item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.filter((item) => (showLinked && !showUnlinked ? item.isLinked : true))
		.filter((item) => (showUnlinked && !showLinked ? !item.isLinked : true))
)

let showDialogue = $state(false)
</script>

<div class="p-6">
    <button
        onclick={() => (showDialogue = true)}
        class="add-button"
        disabled={!store.iedSelected}
    >
        <Plus size={16} />
        <p>Add LP</p>
    </button>

    <CreateLpDialog bind:isOpen={showDialogue} {addLp} />

    <SearchBar bind:searchTerm placeholder="Search LP"/>

    <div class="mt-2">
        <FilterButtons
            bind:selectedTypeToShow
            bind:showLinked
            bind:showUnlinked
        />
    </div>

    {#each Object.values(LP_TYPE) as lpType}
        {#if (selectedTypeToShow === null || selectedTypeToShow === lpType) && filteredList.length > 0}
            <p class="text-xl font-semibold pl-2 pt-3">{lpType}</p>
            {#each filteredList.filter((item) => item.type === lpType) as lpElement (lpElement.id)}
                <LpElement {searchTerm} {lpElement} />
            {/each}
        {/if}
    {/each}
</div>

<style lang="scss">
    .add-button {
        @apply flex items-center justify-center rounded-lg py-2 gap-2 w-full bg-gray-200 mb-2 border border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed;
    }
</style>
