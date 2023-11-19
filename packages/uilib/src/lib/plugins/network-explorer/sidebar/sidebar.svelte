<script lang="ts">
    import type { Node } from "@xyflow/svelte";
	import type { DiagramController } from "../controller"

	// 
	// INPUT
	// 
	export let controller: DiagramController

    //
    // INTERNAL
    //
    let selectedNode = controller.selectedNode

</script>

<div class="sidebar sidebar-right">
    <div class="sidebar-content">
        <pre>
        { JSON.stringify($selectedNode, undefined, 2) }
        </pre>
    </div>
</div>

<style>
    hr {
        margin: 2rem 0;
    }

    .sidebar {
        width: var(--sidebar-width);
        overflow: hidden;
    }

    .sidebar .sidebar-content {
        padding: 1rem;
        background-color: #fcf6e5;
        height: 100%;
        overflow: auto;
        min-width: 330px;
    }

    .ied-nodes {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .ied-nodes img {
        margin-top: 0.9rem;
        height: 1.3rem;
        width: 1.3rem;
    }

    .ied-nodes label {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-grow: 1;
        max-width: 80%;
    }

    .ied-nodes select {
        width: 100%;
        padding: 0.5rem 1rem;
    }

    .actions {
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 1rem;
    }

    .actions .clear-all {
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0);
        border-radius: 5px;
        padding: 6px 8px;
        transition: border-color 200ms ease-in-out;
    }

    .actions .clear-all:hover {
        border-color: var(--color-text-disabled-1);
    }

    .centered {
        display: flex;
        justify-content: flex-start;
    }

    .ied-detail-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .ied-search {
        display: inline-grid;
    }

    .ied-search-headline {
        margin-bottom: 0.5rem;
    }
    .input {
        margin-bottom: 1rem;
    }
    .dashed-line {
        border: 0.1rem dashed var(--color-cyan-30-pc-opacity);
    }
    .seperation-line {
        border: none;
        border-top: 0.1rem solid var(--color-accent);
    }
</style>
