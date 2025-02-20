<script lang="ts">
    import { CheckCircle2, Link } from "lucide-svelte";
    import type { LpElement } from "./types.lp-list";
    import { addLpElementToCanvas } from "@/headless/stores/canvas-operations.svelte";
    import { canvasStore } from "../canvas/canvas-store.svelte";

    type Props = {
        lpElement: LpElement;
        searchTerm: string;
    };

    let { lpElement, searchTerm }: Props = $props();

    const { name, isLinked } = lpElement;

    let isSearched = $derived(
        searchTerm !== "" &&
            lpElement.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    let isSelected = $derived(
        canvasStore.logicalPhysicals.some((item) => item.id === lpElement.id),
    );

    const baseClass =
        "flex items-center gap-2 text-lg p-1 w-full mb-1 font-mono cursor-pointer hover:no-underline rounded-md hover:bg-gray-100 transition-colors duration-300";

    function getSelectedClass() {
        return isSelected ? "bg-beige hover:bg-beige" : "";
    }

    function getSearchedClass() {
        return isSearched ? "bg-gray-200 hover:bg-gray-200" : "";
    }
</script>

<button
    class={`${baseClass} ${getSelectedClass()} ${getSearchedClass()}`}
    onclick={() => addLpElementToCanvas(lpElement)}
>
    {#if isSelected}
        <CheckCircle2 size={16} />
    {:else if isLinked}
        <Link size={16} />
    {:else}
        <div class="ml-4"></div>
    {/if}
    <p>{name}</p>
</button>
