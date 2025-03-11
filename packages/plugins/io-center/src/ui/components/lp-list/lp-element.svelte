<script lang="ts">
    import type { LpElement } from "./types.lp-list";
    import { canvasStore } from "../canvas/canvas-store.svelte";
    import { Edit, Square, SquareCheck } from "lucide-svelte";
    import EditLpDialog from "./edit-lp-dialog.svelte";
    import { store } from "../../../store.svelte";

    type Props = {
        lpElement: LpElement;
        searchTerm: string;
        removeLP: (lpElement: LpElement) => void;
        editLP: (LpElement: LpElement, name: string, desc: string) => void;
    };

    let { lpElement, searchTerm, removeLP, editLP }: Props = $props();

    const { name, instance } = lpElement;

    let isSearched = $derived(
        searchTerm !== "" &&
            lpElement.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    let isSelected = $derived(
        store.selectedLogicalPhysicals.some((item) => item.id === lpElement.id),
    );

    let showDialog = $state(false);

    function addLpElementToCanvas(element: LpElement) {
        if (
            store.selectedLogicalPhysicals.some(
                (item) => item.id === element.id,
            )
        ) {
            store.selectedLogicalPhysicals =
                store.selectedLogicalPhysicals.filter(
                    (item) => item.id !== element.id,
                );
            return;
        }

        store.selectedLogicalPhysicals.push(lpElement);
    }
</script>

<div
    class={{
        "lp-element": true,
        selected: isSelected,
        searched: isSearched,
    }}
>
    <button onclick={() => addLpElementToCanvas(lpElement)}>
        {#if isSelected}
            <SquareCheck size={16} />
        {:else}
            <span class="show-on-hover">
                <Square size={16} />
            </span>
        {/if}
    </button>
    <p>{name}-{instance}</p>
    <button
        class="ml-auto mr-2 show-on-hover"
        onclick={() => (showDialog = true)}
    >
        <Edit size={16} />
    </button>
</div>

<EditLpDialog bind:isOpen={showDialog} {lpElement} {removeLP} {editLP} />

<style lang="scss">
    .lp-element {
        @apply flex items-center gap-1 text-lg py-1 pl-2 w-full mb-1 font-mono cursor-pointer rounded-md hover:bg-gray-100 transition-colors duration-300;
    }

    .lp-element.selected {
        @apply bg-beige hover:bg-beige;
    }

    .lp-element.searched {
        @apply bg-gray-200 hover:bg-gray-200;
    }

    .show-on-hover {
        opacity: 0;
    }

    .lp-element:hover .show-on-hover {
        opacity: 1;
    }
</style>
