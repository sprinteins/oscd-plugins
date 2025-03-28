<script lang="ts">
    import { LC_LIST_FILTER_OPTIONS, LC_TYPE } from "@/headless/constants";
    import type { Nullable } from "@/types";
    import { Plus } from "lucide-svelte";
    import { store } from "@/store.svelte";
    import SearchBar from "../../common/search-bar.svelte";
    import type { LcTypes } from "../../canvas/types.canvas";
    import LcElement from "./lc-element.svelte";
    import FilterButtons from "../../common/filter-buttons.svelte";
    import CreateLpDialog from "../lp-list/create-lp-dialog.svelte";
    import AddLcDialog from "../../canvas/add-lc-dialog.svelte";
    import Tooltip from "../../common/tooltip.svelte";

    type Props = {
        addLC: (
            type: LcTypes,
            number?: number,
            numberOfLCIVPorts?: number,
        ) => void;
        hasLNodeType: (type: LcTypes) => boolean;
    };

    let { addLC, hasLNodeType }: Props = $props();

    let searchTerm = $state("");

    let selectedTypeToShow = $state<Nullable<LcTypes>>(null);
    let showLinked = $state(true);
    let showUnlinked = $state(true);

    const filteredList = $derived.by(() =>
        store.logicalConditioners
            .filter((item) =>
                item.type.toLowerCase().includes(searchTerm.toLowerCase()),
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

<div class="py-6 pr-6" data-name="lp-list">
    <button
        onclick={() => (showDialog = true)}
        class="add-button w-full"
        disabled={!store.selectedIED || !store.selectedDataObject}
    >
        <Plus size={16} />
        {#if !store.selectedIED || !store.selectedDataObject}
            <Tooltip position="left" text="Select an IED and a Data Object first.">
                <p>Add LC</p>
            </Tooltip>
        {:else}
            <p>Add LC</p>
        {/if}
    </button>

    <AddLcDialog bind:isOpen={showDialog} {addLC} {hasLNodeType} />

    {#if store.selectedIED}
        <SearchBar bind:searchTerm placeholder="Search LC" />

        <div class="mt-2">
            <FilterButtons
                filterOptions={LC_LIST_FILTER_OPTIONS}
                bind:selectedTypeToShow
                bind:showLinked
                bind:showUnlinked
            />
        </div>

        {#each Object.values(LC_TYPE) as lcType}
            {#if (selectedTypeToShow === null || selectedTypeToShow === lcType) && filteredList.length > 0}
                <p class="text-xl font-semibold pl-2 pt-3">{lcType}</p>
                {#each filteredList.filter((item) => item.type === lcType) as lc (lc.id)}
                    <LcElement {searchTerm} {lc} />
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
