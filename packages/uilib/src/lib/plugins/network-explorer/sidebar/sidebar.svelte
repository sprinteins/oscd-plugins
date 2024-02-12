<script lang="ts">
    import type { Node } from "@xyflow/svelte";
	import type { DiagramStore, ConnectionBetweenNodes } from "../store"
    import { IEDAccordion } from "./ied-accordion";
    import { writable, derived } from "svelte/store";
    import NewConnection from "./new-connection/new-connection.svelte";

	// 
	// INPUT
	// 
	export let store: DiagramStore

    //
    // INTERNAL
    //
    let selectedNodes$ = store.selectedNodes
    let connectionBetweenNodes$ = store.connectionBetweenNodes
    const showSelectedNodes$ = derived(connectionBetweenNodes$, $newConnectionBetweenNodes$ => !$newConnectionBetweenNodes$)

    $: log($connectionBetweenNodes$)

    function log(c) {
        console.log(c)
    }

    function onCancelConnection(): void {
        store.resetNewConnection()
    }
</script>

<div class="sidebar sidebar-right">
    <div class="sidebar-content">
        {#if $showSelectedNodes$}
            {#each $selectedNodes$ as node }
                <IEDAccordion
                  selectedIED={node}
                  connectedIEDs={store.findConnectedIEDs(node)}
                />
            {/each}
        {:else}
            <NewConnection connectionBetweenNodes={$connectionBetweenNodes$} on:createCable on:cancel={onCancelConnection} />
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
