<script lang="ts">
    import { IED as IEDElement } from "../../../../components/ied"
    import type { SelectedNode } from "../../store/index"
    import { buildCablePortId } from "../../store"
    import { type ConnectedIed, CableIEDAccordion } from "../../../../components/accordion/cable-ied-accordion"
    import type { IED } from "../../diagram/networking";
    
    // 
    // Inputs
    // 
    export let selectedIED: SelectedNode
    export let connectedIEDs: IED[]

    $: conntedIeds = buildConnectedIeds(selectedIED, connectedIEDs)

    function buildConnectedIeds(selectedIED: SelectedNode, connectedIEDs: IED[]): ConnectedIed[] {
        let ieds: ConnectedIed[] = []

        for(const networking of selectedIED.networking){
            const cable = networking.cable
            const conntectedIED = connectedIEDs.find(
                    ied => ied.networking && ied.networking.some(
                        connectedNetworking => connectedNetworking.cable === cable
                    )
                )
            ieds.push({
                cable: networking.cable,
                port: networking.port,
                iedName: conntectedIED?.name ?? "-", //
            })
        }

        return ieds
    }
</script>

<div>
    <div class="ied">
        <div>
            <IEDElement label={selectedIED.name} isSelected={true} isSelectable={false} />
        </div>

        <ul class="network-information">
<!--                 
            <li> <span class="label">IP Address </span> <span class="value"> {selectedIED?.networkInfo.ip}        </span> </li>
            <li> <span class="label">IP Gateway </span> <span class="value"> {selectedIED?.networkInfo.ipGateway} </span></li>
            <li> <span class="label">IP Subnet  </span> <span class="value"> {selectedIED?.networkInfo.ipSubnet}  </span></li>
            -->
        </ul>
    </div>
    <div class="accordions">
        
        {#each conntedIeds as connectedIed}
            <div class="accordion">
                <CableIEDAccordion
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
