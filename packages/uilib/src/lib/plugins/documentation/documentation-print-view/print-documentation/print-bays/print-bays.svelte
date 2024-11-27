<script lang="ts">
    import type { IEDCommInfo } from "@oscd-plugins/core"
    import { PrintIEDs } from "./print-ieds"
    import { calcPublished } from "./_shared-functions"

    export let iedByBay: Map<string, IEDCommInfo[]>
    $: bayNames = Array.from(iedByBay.keys())
</script>

<div class="bay-list">
    <h2>List with all Bays</h2>
    <ul>
        {#each bayNames as bayName}
            {@const bayIeds = iedByBay.get(bayName)}
            <li>
                <h3>{bayName}</h3>
                <ul>
                    {#if bayIeds != undefined}
                        {#each bayIeds as ied}
                            {@const publishedServiceTypes = calcPublished(
                                ied.iedName,
                                iedByBay
                            )}
                            <li>
                                <PrintIEDs {ied} {publishedServiceTypes} />
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
