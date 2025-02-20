<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import type { LpElement as LpElementType } from "./types.lp-list";
    import LpElement from "./lp-element.svelte";
    import SearchBar from "../search-bar.svelte";

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

    const filteredList = $derived.by(() =>
        lpList.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
    <SearchBar bind:searchTerm />
    <p class="text-xl font-semibold pl-2 pt-3">LPDI</p>
    {#each lpdiList as lpElement (lpElement.id)}
        <LpElement {lpElement} />
    {/each}
    <p class="text-xl font-semibold pl-2 pt-3">LPDO</p>
    {#each lpdoList as lpElement (lpElement.id)}
        <LpElement {lpElement} />
    {/each}
</div>
