<script lang="ts">
    import { IED } from "../../../../components/ied"
    import type { SelectedNode } from "../../store/index"
    import type { ConnectedIed } from "../../../../components/accordion/cable-ied-accordion"
    import CableIedAccordion from "../../../../components/accordion/cable-ied-accordion/cable-ied-accordion.svelte";
    export let selectedNode: SelectedNode

    $: conntedIeds = buildConnectedIeds(selectedNode)

    function buildConnectedIeds(selectedNode: SelectedNode): ConnectedIed[] {
        let ieds: ConnectedIed[] = []

        for (let i = 0; i < selectedNode.networkInfo.connections.length; i++) {
            const iedName = selectedNode.connectedIEDs[i]
            const connection = selectedNode.networkInfo.connections[i]

            ieds.push({
                cable: connection.cable,
                port: connection.port,
                iedName
            })
        }

        return ieds
    }
</script>

<div>
    <div class="ied">
        <div>
            <IED label={selectedNode.iedName} isSelected={true} isSelectable={false} />
        </div>

        <ul class="network-information">
            <li> <span class="label">IP Address </span> <span class="value"> {selectedNode?.networkInfo.ip}        </span> </li>
            <li> <span class="label">IP Gateway </span> <span class="value"> {selectedNode?.networkInfo.ipGateway} </span></li>
            <li> <span class="label">IP Subnet  </span> <span class="value"> {selectedNode?.networkInfo.ipSubnet}  </span></li>
        </ul>
    </div>
    <div class="accordions">
        {#each conntedIeds as connectedIed}
            <div class="accordion">
                <CableIedAccordion
                        color={'blue'}
                        {connectedIed}
                    />
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .ied {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .accordions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-left: 1rem;
    }

    ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .network-information {
        font-family: monospace;
        display: flex;
        flex-direction: column;
        gap:0.5rem;
    }

    .network-information > li {
        display: grid;
        grid-template-columns: 1fr 2fr;
    }
</style>
