<script lang="ts">
    import { Edit, Square, SquareCheck } from "lucide-svelte";
    import { store } from "@/store.svelte";
    import type {
        LcTypes,
        LogicalConditioner,
    } from "../../canvas/types.canvas";
    import EditLcDialog from "../../canvas/edit-lc-dialog.svelte";
    import Tooltip from "../../common/tooltip.svelte";

    type Props = {
        lc: LogicalConditioner;
        searchTerm: string;
        removeLC: (lc: LogicalConditioner) => void;
        editLC: (lc: LogicalConditioner, newType: LcTypes, numberOfLCIVPorts?: number) => void;
    };

    let { lc, searchTerm, editLC, removeLC }: Props = $props();

    const { type, instance } = lc;

    let showDialog = $state(false);
    const isSelected = $derived(store.isLcSelected(lc));

    let isSearched = $derived(
        searchTerm !== "" &&
            lc.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    function addLcElementToCanvas(lc: LogicalConditioner) {
        store.toggleLcSelection(lc);
    }
</script>

<div
    data-name="lc-element"
    class={{
        "lc-element": true,
        selected: isSelected,
        searched: isSearched,
    }}
>
    <button
        disabled={store.connectionExistsFor(lc)}
        onclick={() => addLcElementToCanvas(lc)}
    >
        {#if isSelected}
            <SquareCheck size={16} />
        {:else}
            <span class="show-on-hover">
                <Square size={16} />
            </span>
        {/if}
    </button>
    <p>{type}-{instance}</p>
    <button
        class="ml-auto mr-2 show-on-hover"
        onclick={() => (showDialog = true)}
        disabled={lc.isLinked}
    >
        {#if lc.isLinked}
            <Tooltip position="left" text="Can not edit a linked LC!">
                <Edit size={16} />
            </Tooltip>
        {:else}
            <Edit size={16} />
        {/if}
    </button>
</div>

<EditLcDialog bind:isOpen={showDialog} {lc} {editLC} {removeLC} />

<style lang="scss">
    .lc-element {
        @apply flex items-center gap-1 text-lg py-1 pl-2 w-full mb-1 font-mono cursor-pointer rounded-md hover:bg-gray-100 transition-colors duration-300;
    }

    .lc-element.selected {
        @apply bg-beige hover:bg-beige;
    }

    .lc-element.searched {
        @apply bg-gray-200 hover:bg-gray-200;
    }

    .show-on-hover {
        opacity: 0;
    }

    .lc-element:hover .show-on-hover {
        opacity: 1;
    }
</style>
