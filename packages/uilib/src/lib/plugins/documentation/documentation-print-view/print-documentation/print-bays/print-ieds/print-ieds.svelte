<script lang="ts">
    import type { IEDCommInfo, ReceivedMessage } from "@oscd-plugins/core"
    import { PrintMessageServiceChip } from "../../../../../../components/print-message-service-chip"
    import { convertIEDNameToID as convertIEDNameToHrefID } from "../../_shared-functions"
    import type { IEDConnection } from "../_shared-functions"
    import { Icons, openSCDIcons } from "../../../../../../components/icons"

    export let publishedServiceTypes: IEDConnection[] | undefined = undefined
    export let ied: IEDCommInfo

    $: groupedReceiverByServiceTypeID = groupByServiceTypeIDs(ied.received)

    type GroupedServiceType = {
        serviceType: string,
        serviceTypeLabel: string,
        received: ReceivedMessage,
    }

    export function groupByServiceTypeIDs( relations: ReceivedMessage[] ) {

    	const array = new Map<string, GroupedServiceType[]>()

    	relations.forEach((element) => {
    		let serviceType: string = element.serviceType
    		let serviceTypeID: string = element.srcCBName

    		const keyName = `${serviceType}_${serviceTypeID}`
    		const content: GroupedServiceType = {
    			serviceType:      serviceType,
    			serviceTypeLabel: serviceTypeID,
    			received:         element,
    		}

    		const hasServiceTypeElement = array.has(keyName)
    		if (!hasServiceTypeElement) {
    			array.set(keyName, []) 
    		}

    		const serviceTypeElement = array.get(keyName)
    		serviceTypeElement?.push(content)
    	})
    	return array
    }

    const gotoIedNameID = convertIEDNameToHrefID(ied.iedName, false)
</script>

<div class="ied-node" id={gotoIedNameID}>
    <h4>
        {ied.iedName}
    </h4>
    {#if publishedServiceTypes != undefined && publishedServiceTypes.length > 0}
        <div>
            <h5>Publisher</h5>
            <ul class="show-publiished-service-types">
                {#each publishedServiceTypes as serviceType}
                    <li>
                        <PrintMessageServiceChip
                            type={ serviceType.serviceType }
                        />
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if ied.received.length > 0}
        <div>
            <h5>Subscriber</h5>
            <div class="services">
                {#each Array.from(groupedReceiverByServiceTypeID) as serviceTypeGroup}
                    {@const receiver = serviceTypeGroup[1]}
                    {@const serviceTyp = receiver[0]?.serviceType ?? "Unknown"}
                    {@const serviceTypLabel = receiver[0]?.serviceTypeLabel ?? "Unknown"}

                    <div class="service">
                        <div class="service-type-grouper service-{serviceTyp.toLocaleLowerCase()}">
                            <p>{`${serviceTyp} - ${serviceTypLabel}`}</p>
                            <p>Label: {serviceTypLabel}</p>
                            <p>ServiceType: {serviceTyp}</p>
                        </div>
                        <ul class="subscriber-list">
                            {#each receiver as record} 
                                {@const connectedIed = record.received.iedName}
                                <li>
                                    <div class="iedConnector service-{serviceTyp.toLocaleLowerCase()}">
                                        <span>{connectedIed}</span>
                                        <a href={convertIEDNameToHrefID(connectedIed, true)}>
                                            <Icons name={"linkIcon"} size="normal" />
                                        </a>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                    {/each}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">

    .show-publiished-service-types {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        list-style-type: none;
    }

    .services {
        display: flex; 
        flex-direction: column;
        gap: 1rem;     

        .service {
            display: flex; 
            gap: 1rem;     
    
            .service-type-grouper {
                border: 2px solid #000;
                border-radius: 5px;
                padding: .5rem;
                width: 30%;
        
                p {
                    margin: 0;
                    padding: 0;
                }

                &.service-goose {
                    border-color: var(--color-message-goose);
                }
                &.service-mms, &.service-reportcontrol {
                    border-color: var(--color-message-mms);
                }
                &.service-sampledvalues, &.service-smv {
                    border-color: var(--color-message-sampledvalues);
                }
            }

            ul.subscriber-list {
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
                padding: 0;
                li {
                    display: flex;
                    flex-direction: row;
                    gap: 0.3rem;
                }
            }

            .iedConnector {
                display: flex; 
                align-items: center; 
                gap: .5rem;
                border: 1px solid black;
                padding: .2rem 1rem;
                border-radius: 5px;
            }
        }
    }


</style>
