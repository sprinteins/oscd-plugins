<script lang="ts">
import { IconArrowDropDown } from '@oscd-plugins/ui'
import {
	Icons,
	type OpenSCDIconNames
} from '@oscd-plugins/ui/src/components/icons'
import type { ServiceObject } from '../../sidebar/ied-accordion'
import { ConnectionTypeDirection } from '../../sidebar/ied-accordion'

interface Props {
	open?: boolean
	serviceType: string
	serviceLabel?: string | undefined
	affectedIEDObjects?: ServiceObject[]
	color: string
	connectionDirection: ConnectionTypeDirection
}

let {
	open = $bindable(false),
	serviceType,
	serviceLabel = '',
	affectedIEDObjects = [],
	color,
	connectionDirection
}: Props = $props()

// Report has no dedicated icon/label; it is displayed as MMS.
const SERVICE_TYPE_ICON_PREFIX: Record<string, string> = {
	GOOSE: 'goose',
	SampledValues: 'sv',
	MMS: 'mms',
	Report: 'mms'
}

const SERVICE_TYPE_DISPLAY_LABEL: Record<string, string> = {
	Report: 'MMS'
}

function calcServiceTypeLabel(serviceType: string): string {
	return SERVICE_TYPE_DISPLAY_LABEL[serviceType] ?? serviceType
}

function calcIconName(
	serviceType: string,
	connectionDirection: ConnectionTypeDirection
): OpenSCDIconNames {
	const serviceTypeShort =
		SERVICE_TYPE_ICON_PREFIX[serviceType] ?? 'undefined'
	const serviceTypeDirection =
		connectionDirection === ConnectionTypeDirection.INCOMING
			? 'Incoming'
			: 'Outgoing'

	const iconName = `${serviceTypeShort}${serviceTypeDirection}Icon`

	return iconName as OpenSCDIconNames
}
let affectedSubscriberIEDs = $derived(
	affectedIEDObjects
		.filter(
			(el) => el.connectionDirection === ConnectionTypeDirection.INCOMING
		)
		.map((el) => el.node)
)
let affectedPublisherIEDs = $derived(
	affectedIEDObjects
		.filter(
			(el) => el.connectionDirection === ConnectionTypeDirection.OUTGOING
		)
		.map((el) => el.node)
)
let iconName = $derived(calcIconName(serviceType, connectionDirection))
let serviceTypeLabel = $derived(calcServiceTypeLabel(serviceType))
</script>

<div class="accordion">
    <details bind:open>
        <summary style="border-color: var({color})" class="summary">
            <div class="infoblock-headline">
                <Icons size={"normal"} name={iconName} />
                <span class="label">{serviceTypeLabel} - {serviceLabel}</span>
                <div class="icon">
                    <IconArrowDropDown />
                </div>
            </div>
        </summary>
        <div class="accordion-open">
            <hr class="dashed-line" />
            <div class="infomation-block">
                <div>Label: {serviceLabel}</div>
                <div>MessageType: {serviceTypeLabel}</div>
            </div>

            <hr class="seperation-line" />
            {#if affectedSubscriberIEDs.length + affectedPublisherIEDs.length == 0}
                <p>No items found</p>
            {:else}
                {#if affectedSubscriberIEDs.length > 0}
                    <ul>
                        Subscribers
                        {#each affectedSubscriberIEDs as ied}
                            <li>
                                <div class="ied-component">
                                    {ied.label}
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}

                {#if affectedPublisherIEDs.length > 0}
                    <ul>
                        Publishers
                        {#each affectedPublisherIEDs as ied}
                            <li>
                                <div class="ied-component">
                                    {ied.label}
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            {/if}
        </div>
    </details>
</div>

<style lang="scss">
    div.accordion {
        .summary {
            padding-left: 0.5rem;
            padding-right: 1rem;
        }
        .infoblock-headline {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            .label {
                flex-grow: 1;
            }
        }

        border: 2px solid var(--color-accent);
        border-radius: 5px;
        details[open] > summary > div.icon {
            transform: rotate(-180deg);
        }
        details {
            background-color: #ede8d7;
            border-radius: 5px;
            accent-color: #ff6600;
            cursor: pointer;

            summary {
                background-color: #ede8d7;
                padding: 0.4rem 0.5rem 0.4rem 1.5rem;
                list-style-type: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 0.5rem;

                div.icon {
                    :global(svg) {
                        display: block;
                        width: 1.5rem;
                        height: 1.5rem;
                    }
                    :global(svg path) {
                        fill: #2aa198;
                    }
                }
            }
            div.accordion-open {
                padding-bottom: 0.2rem;
                // border: 2px solid var(--color-black);
                // border-top: none;
                // border-radius: 5px;
                summary {
                    border: none;
                }
                p {
                    padding: 0 2rem;
                }
                ul {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                    list-style-type: none;
                    padding: 0 1rem;
                    margin: 0.5rem 0;
                    li {
                        div.ied-component {
                            /* TODO: extract colors */
                            background-color: #fdfbf2;
                            border: 1px solid #4d5d63;
                            border-radius: 5px;
                            padding: 0.4rem 1.2rem;
                        }
                    }
                }
            }
        }
        .seperation-line {
            border: none;
            border-top: 0.1rem solid var(--color-accent);
            max-width: 95%;
        }
        .dashed-line {
            border: none;
            border-top: 0.1rem dashed var(--color-accent);
            max-width: 95%;
        }
        .infomation-block {
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
        }
    }
</style>
