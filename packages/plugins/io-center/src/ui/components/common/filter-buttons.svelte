<script lang="ts">
    import type { Nullable } from "@/types";
    import type { FilterOptions } from "./types.common";

    type Props = {
        selectedTypeToShow: Nullable<string[]>;
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

    const ALL_BUTTON = filterOptions[0].label;
    let selectedStatus = $state<string>(ALL_BUTTON);
    let selectedTypes = $state<string[]>([]);

    const STATUS_BUTTONS = filterOptions.slice(0, 3).map(opt => opt.label);

    function toggleType(label: string) {
        if (selectedTypes.includes(label)) {
            selectedTypes = selectedTypes.filter(t => t !== label);
        } else {
            selectedTypes = [...selectedTypes, label];
        }
        selectedTypeToShow = selectedTypes.length ? selectedTypes : null;
    }

    function handleStatusChange(label: string) {
        if (label === selectedStatus) return;

        selectedStatus = label;
        
        if (label === ALL_BUTTON) {
            showLinked = true;
            showUnlinked = true;
        } else if (label === "Linked") {
            showLinked = true;
            showUnlinked = false;
        } else if (label === "Unlinked") {
            showLinked = false;
            showUnlinked = true;
        }

        selectedTypes = [];
        selectedTypeToShow = null;
    }
</script>

<div class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-1">
        {#each filterOptions.slice(0, 3) as { label }}
            {#if label !== "All LPs" || (selectedStatus !== "Linked" && selectedStatus !== "Unlinked")}
                <label class="radio-label">
                    <input
                        type="radio"
                        name="status"
                        value={label}
                        checked={selectedStatus === label}
                        onchange={() => handleStatusChange(label)}
                    />
                    <span class="radio-text">{label}</span>
                </label>
            {/if}
        {/each}
    </div>

    <div class="flex flex-wrap gap-1">
        {#each filterOptions.slice(3) as { label }}
            <button
                onclick={() => toggleType(label)}
                class={{
                    "type-button": true,
                    "selected": selectedTypes.includes(label),
                }}
            >
                {label}
            </button>
        {/each}
    </div>
</div>

<style>
    .radio-label {
        @apply relative inline-flex cursor-pointer;
    }

    .radio-label input[type="radio"] {
        @apply absolute opacity-0 w-0 h-0;
    }

    .radio-text {
        @apply bg-white text-sm p-2 border rounded-xl font-normal transition-all;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .radio-label input[type="radio"]:checked + .radio-text {
        @apply border-2 border-[#2aa197] font-bold bg-white;
    }

    .radio-label:hover .radio-text {
        @apply bg-gray-50;
    }

    .type-button {
        @apply bg-white text-sm p-2 border rounded-xl font-normal transition-all;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .type-button.selected {
        @apply border-2 border-[#2aa197] font-bold bg-white;
    }

    .type-button:hover {
        @apply bg-gray-50;
    }
</style>