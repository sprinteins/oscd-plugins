<script lang="ts">
    import { IED as IEDElement } from "../../../../components/ied"
    import type { SelectedNode } from "../../store/index"
    import { type IEDDetails, CableIEDAccordion } from "../../../../components/accordion/cable-ied-accordion"
    
    // 
    // Inputs
    // 
    export let selectedIED: SelectedNode


    $: iedDetails = buildConnectedIEDDetails(selectedIED)

    function buildConnectedIEDDetails(selectedIED: SelectedNode): IEDDetails[] {
        let ieds: IEDDetails[] = []

        for(const networking of selectedIED.networking){
            ieds.push({
                cable: networking.cable,
                port: networking.port,
                iedName: networking.connectedNetworking?.iedName ?? "-", //
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
        
        {#each iedDetails as details}
            <div class="accordion">
                <CableIEDAccordion
                        color={'blue'}
                        connectedIED={details}
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
