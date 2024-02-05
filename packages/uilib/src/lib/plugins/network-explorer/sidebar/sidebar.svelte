<script lang="ts">
    import type { Node } from "@xyflow/svelte";
	import type { DiagramStore, NewConnectionBetweenNodes } from "../store"
    import { IEDAccordion } from "./ied-accordion";
    import { derived } from "svelte/store";
    import NewConnection from "./new-connection/new-connection.svelte";

	// 
	// INPUT
	// 
	export let controller: DiagramStore

    //
    // INTERNAL
    //
    let selectedNodes$ = controller.selectedNodes
    let newConnectionBetweenNodes$ = controller.newConnectionBetweenNodes
    const showSelectedNodes$ = derived(newConnectionBetweenNodes$, $newConnectionBetweenNodes$ => !$newConnectionBetweenNodes$)
</script>

<div class="sidebar sidebar-right">
    <div class="sidebar-content">
        {#if $showSelectedNodes$}
            {#each $selectedNodes$ as node }
                <IEDAccordion selectedNode={node}/>
            {/each}
        {:else}
            <NewConnection newConnectionBetweenNodes={$newConnectionBetweenNodes$} />
        {/if}
    </div>
</div>

<style>
    hr {
        margin: 2rem 0;
    }

    .sidebar {
        width: var(--sidebar-width);
        overflow: auto;
        max-height: 100%;
    }

    .sidebar .sidebar-content {
        padding: 1rem;
        background-color: #fcf6e5;
        height: 100%;
        overflow: auto;

        display: flex;
        flex-direction: column;
        gap:2rem;
    }

</style>
