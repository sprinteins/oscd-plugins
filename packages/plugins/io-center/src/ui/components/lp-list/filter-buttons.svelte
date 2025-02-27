<script lang="ts">
    import type { Nullable } from "@/types";
    import type { LpTypes } from "./types.lp-list";
    import { LP_TYPE } from "@/headless/constants";

    type Props = {
        selectedTypeToShow: Nullable<LpTypes>;
        showLinked: Boolean;
        showUnlinked: Boolean;
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

    Object.values(LP_TYPE).forEach((value) => {
        filterOptions.push({
            label: value,
            values: { selectedType: value },
        });
    });
</script>

<div class="flex flex-wrap gap-1">
    {#each filterOptions as { label, values }}
        <button
            onclick={() => {
                selectedLabel = label;
                setFilters(values);
            }}
            class={{ "border-4 border-indigo-600": selectedLabel === label }}
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
