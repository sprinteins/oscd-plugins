<script lang="ts">
    import type { IEDCommInfo } from "@oscd-plugins/core"
    import { convertIEDNameToID } from "../_shared-functions"

    export let iedByBus: Map<string, IEDCommInfo[]>
    $: busNames = Array.from(iedByBus.keys())
</script>

<div class="bay-list">
    <h2>List with all Buses</h2>
    <ul>
        {#each busNames as bayName}
            {@const busIeds = iedByBus.get(bayName)}
            <li>
                <h3>{bayName}</h3>
                <ul>
                    {#if busIeds != undefined}
                        {#each busIeds as ied}
                            {@const iedLink = convertIEDNameToID(
                                ied.iedName,
                                true
                            )}
                            <li>
                                <a href={iedLink}>{ied.iedName}</a>
                            </li>
                        {/each}
                    {/if}
                </ul>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    :global(li) {
        font-size: 1rem;
    }
</style>
