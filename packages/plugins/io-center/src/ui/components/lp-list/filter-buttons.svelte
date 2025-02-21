<script lang="ts">
    type Props = {
        showLpdi: Boolean;
        showLpdo: Boolean;
        showLinked: Boolean;
        showUnlinked: Boolean;
    };

    let {
        showLpdi = $bindable(),
        showLpdo = $bindable(),
        showLinked = $bindable(),
        showUnlinked = $bindable(),
    }: Props = $props();

    let selectedLabel = $state("");

    function setFilters({
        lpdi = showLpdi,
        lpdo = showLpdo,
        linked = showLinked,
        unlinked = showUnlinked,
    }) {
        showLpdi = lpdi;
        showLpdo = lpdo;
        showLinked = linked;
        showUnlinked = unlinked;
    }

    const filterOptions = [
        {
            label: "All LPs",
            values: { lpdi: true, lpdo: true, linked: true, unlinked: true },
        },
        { label: "Unlinked", values: { linked: false, unlinked: true } },
        { label: "Linked", values: { linked: true, unlinked: false } },
        { label: "Input", values: { lpdi: true, lpdo: false } },
        { label: "Output", values: { lpdi: false, lpdo: true } },
    ];
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
