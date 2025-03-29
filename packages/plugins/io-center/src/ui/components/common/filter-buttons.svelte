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
                "border-4 border-indigo-600": selectedLabel === label,
                "border-4 border-red-600":
                    (label === "All LPs" && showLinked && showUnlinked) ||
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
        @apply bg-gray-100 text-sm p-2 border rounded-xl;
    }
</style>
