<script lang="ts">
    import type { Node } from "@xyflow/svelte";
	import type { DiagramStore } from "../store"
    import { IEDAccordion } from "./ied-accordion";

	// 
	// INPUT
	// 
	export let controller: DiagramStore

    //
    // INTERNAL
    //
    let selectedNodes$ = controller.selectedNodes

</script>

<div class="sidebar sidebar-right">
    <div class="sidebar-content">
        {#each $selectedNodes$ as node }
            <IEDAccordion selectedNode={node}/>
        {/each}
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
