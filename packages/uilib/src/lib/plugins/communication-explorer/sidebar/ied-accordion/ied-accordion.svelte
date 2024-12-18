<script lang="ts">
import PublisherSubscriberAccordion from '../../../../components/accordion/publisher-subscriber-accordion/publisher-subscriber-accordion.svelte'
import type { IEDElkNode, RootNode } from '../../../../components/diagram'
import { IED } from '../../../../components/ied'
import { getConnectedIEDsByLabel } from '../../_func-layout-calculation/get-connected-ieds'
import { getIEDDetails } from '../../_func-layout-calculation/get-ied-details'
import {
	ConnectionTypeDirection,
	groupRelationsByServiceType,
	type ServiceTypeGroup
} from '.'
import { filterState } from '../../_store-view-filter'
// TYPES
import type { MessageType } from '../../types'

export let rootNode: RootNode
export let IEDSelection: IEDElkNode

let relationsByServiceType: ServiceTypeGroup = new Map()
$: relations = getConnectedIEDsByLabel(rootNode, IEDSelection.label)
$: relationsByServiceType = groupRelationsByServiceType(relations)
$: serviceTypes = Array.from(relationsByServiceType.entries())
$: details = getIEDDetails(rootNode, IEDSelection.label)
$: bays = Array.from(IEDSelection.bays).join(", ")

const serviceTypeColor: { [key in MessageType | 'Unknown']: string } = {
	GOOSE: '--color-message-goose',
	MMS: '--color-message-mms',
	SampledValues: '--color-message-sampledvalues',
	Unknown: '--color-message-unknown'
}

let detailsCollapsed = true
</script>

<div>
    {#if bays.length > 0}
		<div class="baylabel" style="height: {IEDSelection.bayLabelHeight}px;margin-bottom: {IEDSelection.bayLabelGap}px">
			{#each bays as bay}
				{bay}
			{/each}
		</div>
	{/if}

    <IED label={IEDSelection.label} isSelected={true} isSelectable={false} />
</div>
{#if details != null}
    <div class={detailsCollapsed ? 'details_collapsed' : ''}>
    {#if details.logicalNodes.length > 0}
        <h3>Logical Nodes</h3>
        {#each details.logicalNodes as node}
            <span class="details">{node}</span>
            <br>
        {/each}
    {/if}
    {#if details.dataObjects.length > 0}
        <h3>Data Objects</h3>
        {#each details.dataObjects as node}
            <span class="details">{node}</span>
            <br>
        {/each}
    {/if}
    {#if details.dataAttributes.length > 0}
        <h3>Data Attributes</h3>
        {#each details.dataAttributes as node}
            <span class="details">{node}</span>
            <br>
        {/each}
    {/if}
    </div>
    <button class="expand_button" on:click={() => detailsCollapsed = !detailsCollapsed}>
        {detailsCollapsed ? 'Show more' : 'Show less'}
    </button>
{/if}

<div class="accordions">
    {#each serviceTypes as serviceType}
        {@const service = serviceType[1]}
        {@const type = service[0].serviceType}
        {@const typeLabel = service[0].serviceTypeLabel}
        {@const connection = service[0].connectionDirection}

        {@const shouldMessageTypeBeShown = $filterState.selectedMessageTypes.includes(type)}
        {@const shouldMessageDirectionShownIncoming = $filterState.incomingConnections && (connection === ConnectionTypeDirection.INCOMING)}
        {@const shouldMessageDirectionShownOutgoing = $filterState.outgoingConnections && (connection === ConnectionTypeDirection.OUTGOING)}

    
        {#if shouldMessageTypeBeShown && (shouldMessageDirectionShownIncoming || shouldMessageDirectionShownOutgoing)}
            <div class="accordion">
                <PublisherSubscriberAccordion
                    color={serviceTypeColor[type]}
                    serviceType={type}
                    serviceLabel={typeLabel}
                    affectedIEDObjects={service}
                    connectionDirection={connection}
                />
            </div>
        {/if}

    {/each}
</div>

<style lang="scss">
    
    /*quickly copied over from ied-element.svelte 
    TODO: make bay-label it's own Element!*/
    .baylabel {
        width: fit-content;
		font-size: 10px;
        padding-top: 0.2em;
		padding-left: 4px;
		padding-right: 4px;
        margin-bottom: 2px;

		/* TODO: extract colors */
		background: var(--color-white);
		border: 1px solid var(--color-cyan);
		border-radius: 5px;
		box-sizing: border-box;
    }
    .accordions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-left: 1rem;
    }
    .details_collapsed {
        overflow: hidden;
        max-height: 100px;
    }
    .expand_button {
        background: none;
        border: none;
        color: #305CDE;
        cursor: pointer;
        margin-bottom: 1rem;
        padding-left: 0;
    }
    .expand_button:focus {
        outline: none;
    }
    .expand_button:hover {
        text-decoration: underline;
    }
    .details:last-of-type {
        margin-bottom: 0;
    }
</style>
