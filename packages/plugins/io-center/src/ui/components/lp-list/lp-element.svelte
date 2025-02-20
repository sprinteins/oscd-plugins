<script lang="ts">
    import { CheckCircle2, Link } from "lucide-svelte";
    import type { LpElement } from "./types.lp-list";

    type Props = {
        lpElement: LpElement;
    };

    let { lpElement }: Props = $props();

    const { name, isLinked } = lpElement;

    let isSelected = $state(false);

    const baseClass =
        "font-mono cursor-pointer hover:no-underline rounded-md hover:bg-gray-100 transition-colors duration-300";

    function getSelectedClass() {
        return isSelected ? "bg-beige hover:bg-beige" : "";
    }

    //function getSearchedClass() {
    //    return isSearched ? "bg-gray-200 hover:bg-gray-200" : "";
    //}
</script>

<button
    class={`flex items-center gap-2 text-lg p-1 w-full mb-1 ${baseClass} ${getSelectedClass()}`}
    onclick={() => (isSelected = !isSelected)}
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
