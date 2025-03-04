<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import type { Nullable } from "@/types";
    import type { LpTypes } from "./types.lp-list";

    type Props = {
        selectedTypeToShow: Nullable<LpTypes>;
        showLinked: boolean;
        showUnlinked: boolean;
    };

    let {
        selectedTypeToShow = $bindable(),
        showLinked = $bindable(),
        showUnlinked = $bindable(),
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

    const filterOptions: Array<{
        label: string;
        values: {
            selectedType?: Nullable<LpTypes>;
            linked?: boolean;
            unlinked?: boolean;
        };
    }> = [
        {
            label: "All LPs",
            values: { selectedType: null, linked: true, unlinked: true },
        },
        { label: "Unlinked", values: { linked: false, unlinked: true } },
        { label: "Linked", values: { linked: true, unlinked: false } },
    ];

    for (const value of Object.values(LP_TYPE)) {
        filterOptions.push({
            label: value,
            values: { selectedType: value },
        });
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
