<script lang="ts">
    import type { ServiceObject } from "../../../plugins/communication-explorer/sidebar/ied-accordion"
    import { ConnectionTypeDirection } from "../../../plugins/communication-explorer/sidebar/ied-accordion"
    import IconArrowDropDown from "../../icons/icon-arrow-drop-down.svelte"
    import {Icons, type OpenSCDIconNames} from "../../icons"

    export let open = false
    export let serviceType: string
    export let serviceLabel: string | undefined = ""
    export let affectedIEDObjects: ServiceObject[] = []
    export let color: string
    export let connectionDirection: ConnectionTypeDirection

    $: affectedIEDs = affectedIEDObjects.map((el) => {
    	return el.node
    })

    $: iconName = calcIconName(serviceType, connectionDirection)

    function calcIconName(serviceType: string, connectionDirection: ConnectionTypeDirection): OpenSCDIconNames {
    	let serviceTypeShort = ""
    	let serviceTypeDirection = ""
        
    	if (serviceType === "GOOSE") 
    		serviceTypeShort = "goose"
    	else if (serviceType === "SampledValues")
    		serviceTypeShort = "sv"
    	else if (serviceType === "MMS")
    		serviceTypeShort = "mms"
    	else
    		serviceTypeShort = "undefined"

    	if (connectionDirection === ConnectionTypeDirection.INCOMING) 
    		serviceTypeDirection = "Incoming"
    	else 
    		serviceTypeDirection = "Outgoing"

    	const iconName = `${serviceTypeShort}${serviceTypeDirection}Icon`

    	return iconName as OpenSCDIconNames
    }
</script>

<div class="accordion">
    <details bind:open>
        <summary style="border-color: var({color})" class="summary">
            <div class="infoblock-headline">
                <Icons size={"normal"} name={iconName} />
                <span class="label">{serviceType} - {serviceLabel}</span>
                <div class="icon">
                    <IconArrowDropDown />
                </div>
            </div>
        </summary>
        <div class="accordion-open">
            <hr class="dashed-line" />
            <div class="infomation-block">
                <div>Label: {serviceLabel}</div>
                <div>MessageType: {serviceType}</div>
            </div>

            <hr class="seperation-line" />
            {#if affectedIEDs.length > 0}
                <ul>
                    Subscribers
                    {#each affectedIEDs as ied}
                        <li>
                            <div class="ied-component">
                                {ied.label}
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No items found</p>
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
