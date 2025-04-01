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

    let selectedLabels = $state<string[]>([]);

    function toggleFilter(label: string, values: any) {
        if (selectedLabels.includes(label)) {
            selectedLabels = selectedLabels.filter(l => l !== label);
            if (label === "Linked") showLinked = false;
            if (label === "Unlinked") showUnlinked = false;
        } else {
            selectedLabels = [...selectedLabels, label];
            if (label === "Linked") showLinked = true;
            if (label === "Unlinked") showUnlinked = true;
        }

        if (label !== "Linked" && label !== "Unlinked") {
            setFilters({ ...values, linked: showLinked, unlinked: showUnlinked });
        }
    }

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
            onclick={() => toggleFilter(label, values)}
            class={{
                "selected": selectedLabels.includes(label),
                "active": (label === "All LPs" && showLinked && showUnlinked) ||
                         (label === "Unlinked" && showUnlinked) ||
                         (label === "Linked" && showLinked),
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
