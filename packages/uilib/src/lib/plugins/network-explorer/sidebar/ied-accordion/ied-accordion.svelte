<script lang="ts">
    import { IED as IEDElement } from "../../../../components/ied"
    import type { SelectedNode } from "../../store/index"
    import { CableIEDAccordion } from "../../../../components/accordion/cable-ied-accordion"
    
    // 
    // Inputs
    // 
    export let selectedIED: SelectedNode
</script>

<div>
    <div class="ied">
        <div>
            <IEDElement label={selectedIED.name} isSelected={true} isSelectable={false} />
        </div>
    </div>
    <div class="accordions">
        
        {#each selectedIED.networking as networking}
            <div class="accordion">
                <CableIEDAccordion
                        color={'blue'}
                        { networking }
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
