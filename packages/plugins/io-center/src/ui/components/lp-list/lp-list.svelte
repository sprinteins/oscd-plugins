<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import type { LpElement as LpElementType } from "./types.lp-list";
    import LpElement from "./lp-element.svelte";
    import SearchBar from "../common/search-bar.svelte";
    import FilterButtons from "./filter-buttons.svelte";
    import { Plus } from "lucide-svelte";
    import CreateLpDialog from "./create-lp-dialog.svelte";
    import store from "../../../store.svelte";

    const lpList: LpElementType[] = [];

    type Props = {
        addLp: () => void;
    };

    let { addLp }: Props = $props();

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
        filteredList.filter((item) => item.type === LP_TYPE.LPDI),
    );

    const lpdoList = $derived(
        filteredList.filter((item) => item.type === LP_TYPE.LPDO),
    );

    let showDialogue = $state(false);
</script>

<div class="p-6">
    <button
        onclick={() => (showDialogue = true)}
        class="add-button"
        disabled={!store.iedSelected}
    >
        <Plus size={16} />
        <p>Add LP</p>
    </button>
    <CreateLpDialog bind:isOpen={showDialogue} {addLp} />
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

<style lang="scss">
    .add-button {
        @apply flex items-center justify-center rounded-lg py-2 gap-2 w-full bg-gray-200 mb-2 border border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed;
    }
</style>
