<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import type { LpElement as LpElementType } from "./types.lp-list";
    import LpElement from "./lp-element.svelte";
    import SearchBar from "../search-bar.svelte";
    import FilterButtons from "./filter-buttons.svelte";
    import { Plus } from "lucide-svelte";

    const lpList: LpElementType[] = [
        { id: "1", type: LP_TYPE.input, name: "LPDI 1", isLinked: false },
        { id: "2", type: LP_TYPE.input, name: "LPDI 2", isLinked: false },
        { id: "3", type: LP_TYPE.input, name: "LPDI 3", isLinked: false },
        { id: "4", type: LP_TYPE.input, name: "LPDI 4", isLinked: true },
        { id: "5", type: LP_TYPE.output, name: "LPDO 1", isLinked: false },
        { id: "6", type: LP_TYPE.output, name: "LPDO 2", isLinked: true },
        { id: "7", type: LP_TYPE.output, name: "LPDO 3", isLinked: true },
        { id: "8", type: LP_TYPE.output, name: "LPDO 4", isLinked: true },
    ];

    let searchTerm = $state("");

    let showLpdi = $state(true);
    let showLpdo = $state(true);
    let showLinked = $state(true);
    let showUnlinked = $state(true);

    const filteredList = $derived.by(() =>
        lpList
            .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .filter((item) =>
                showLinked && !showUnlinked ? item.isLinked : true,
            )
            .filter((item) =>
                showUnlinked && !showLinked ? !item.isLinked : true,
            ),
    );

    const lpdiList = $derived(
        filteredList.filter((item) => item.type === LP_TYPE.input),
    );

    const lpdoList = $derived(
        filteredList.filter((item) => item.type === LP_TYPE.output),
    );
</script>

<div class="p-6">
    <button
        class="flex items-center justify-center rounded-lg py-2 gap-2 w-full bg-gray-200 mb-2 border border-gray-400"
    >
        <Plus size={16} />
        <p>Add LP</p>
    </button>

    <SearchBar bind:searchTerm />

    <div class="mt-2">
        <FilterButtons
            bind:showLpdi
            bind:showLpdo
            bind:showLinked
            bind:showUnlinked
        />
    </div>

    {#if showLpdi}
        <p class="text-xl font-semibold pl-2 pt-3">LPDI</p>
        {#each lpdiList as lpElement (lpElement.id)}
            <LpElement {searchTerm} {lpElement} />
        {/each}
    {/if}

    {#if showLpdo}
        <p class="text-xl font-semibold pl-2 pt-3">LPDO</p>
        {#each lpdoList as lpElement (lpElement.id)}
            <LpElement {searchTerm} {lpElement} />
        {/each}
    {/if}
</div>
