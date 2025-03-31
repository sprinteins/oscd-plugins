<script lang="ts">
    import type { Nullable } from "@/types";
    import type { FilterOptions } from "./types.common";

    type Props = {
        selectedTypeToShow: Nullable<string>;
        showLinked: boolean;
        showUnlinked: boolean;
        filterOptions: FilterOptions;
    };

    let {
        selectedTypeToShow = $bindable(),
        showLinked = $bindable(),
        showUnlinked = $bindable(),
        filterOptions,
    }: Props = $props();

    let selectedLabel = $state("");

    function setFilters({
        selectedType = selectedTypeToShow,
        linked = showLinked,
        unlinked = showUnlinked,
    }) {
        selectedTypeToShow = selectedType;
        showLinked = linked;
        showUnlinked = unlinked;
    }
</script>

<div class="flex flex-wrap gap-1">
    {#each filterOptions as { label, values }}
        <button
            onclick={() => {
                selectedLabel = label;
                setFilters(values);
            }}
            class={{
                "selected": selectedLabel === label,
                "active": (label === "All LPs" && showLinked && showUnlinked) ||
                         (label === "Unlinked" && showUnlinked && !showLinked) ||
                         (label === "Linked" && showLinked && !showUnlinked),
            }}
        >
            {label}
        </button>
    {/each}
</div>

<style>
    button {
        @apply bg-gray-100 text-sm p-2 border rounded-xl font-normal transition-all;
    }

    button.selected {
        @apply border-2 border-[#2aa197] font-bold;
    }

    button.active {
        @apply border-2 border-[#2aa197];
    }
</style>
