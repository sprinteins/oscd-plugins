<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import type { Nullable } from "@/types";
    import { Plus } from "lucide-svelte";
    import { store } from "../../../store.svelte";
    import SearchBar from "../common/search-bar.svelte";
    import FilterButtons from "./filter-buttons.svelte";
    import LpElement from "./lp-element.svelte";
    import type { LpTypes, LpElement as LpElementType } from "./types.lp-list";
    import CreateLpDialog from "./create-lp-dialog.svelte";

    type Props = {
        addLp: () => void;
        removeLP: (lpElement: LpElementType) => void;
        editLP: (LpElement: LpElementType, name: string, desc: string) => void;
    };

    let { addLp, removeLP, editLP }: Props = $props();

    let searchTerm = $state("");

    let selectedTypeToShow = $state<Nullable<LpTypes>>(null);
    let showLinked = $state(true);
    let showUnlinked = $state(true);

    const filteredList = $derived.by(() =>
        store.lpList
            .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .filter((item) =>
                showLinked && !showUnlinked ? item.isLinked : true,
            )
            .filter((item) =>
                showUnlinked && !showLinked ? !item.isLinked : true,
            ),
    );

    let showDialog = $state(false);
</script>

<div class="py-6 pr-6">
    <button
        onclick={() => (showDialog = true)}
        class="add-button"
        disabled={!store.selectedIED}
    >
        <Plus size={16} />
        <p>Add LP</p>
    </button>

    <CreateLpDialog bind:isOpen={showDialog} {addLp} />

    {#if store.selectedIED}
        <SearchBar bind:searchTerm placeholder="Search LP" />

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
                    <LpElement {searchTerm} {lpElement} {removeLP} {editLP} />
                {/each}
            {/if}
        {/each}
    {/if}
</div>

<style lang="scss">
    .add-button {
        @apply flex items-center justify-center rounded-lg py-2 gap-2 w-full bg-gray-200 mb-2 border border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed;
    }
</style>
