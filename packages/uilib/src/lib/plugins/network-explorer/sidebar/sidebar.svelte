<script lang="ts">
    import type { Node } from "@xyflow/svelte";
	import type { DiagramStore } from "../store"

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
        <h4>{node.iedName}</h4>
        <ul class="network-information">
            <li> <span class="label">IP Address </span> <span class="value"> {node?.networkInfo.ip}        </span> </li>
            <li> <span class="label">IP Gateway </span> <span class="value"> {node?.networkInfo.ipGateway} </span></li>
            <li> <span class="label">IP Subnet  </span> <span class="value"> {node?.networkInfo.ipSubnet}  </span></li>
            <li class="cables">
                Cables
                <ul>
                   {#each node?.networkInfo.cables??[] as cable}
                        <li> {cable} </li>
                   {/each}
                </ul>
            </li>
            
        </ul>
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
    }

    ul{
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .network-information{
        font-family: monospace;
        display: flex;
        flex-direction: column;
        gap:0.5rem;
    }

    .network-information > li{
        display: grid;
        grid-template-columns: 1fr 2fr;
    }

    .cables{
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
    }

    

</style>
