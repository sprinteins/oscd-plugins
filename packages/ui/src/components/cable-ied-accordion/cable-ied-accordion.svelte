<script lang="ts">
    import type { Networking } from "@oscd-plugins/core";
	import IconArrowDropDown from "../icons/icon-arrow-drop-down.svelte"
	
	export let open = false
	export let color: string
	export let networking: Networking
</script>

<div class="accordion">
    <details bind:open>
        <summary style="border-color: var({color})" class="summary">
            <div class="infoblock-headline">
                <span class="label">Port {networking.port} - {networking.cable}</span>
                <div class="icon">
                    <IconArrowDropDown />
                </div>
            </div>
        </summary>
        <div class="accordion-open">
            <hr class="dashed-line" />
            <ul>
                Connected IED
                <li>
                    <div class="ied-component">
                        {networking.connectedNetworking?.iedName || "-"}
                    </div>
                </li>
            </ul>
            <hr class="seperation-line" />
            <div class="infomation-block">
                <div>IP</div> <div>{ networking.ipAddress }</div>
                <div>Gateway</div> <div>{ networking.ipGateway }</div>
                <div>Subnet</div> <div>{ networking.ipSubnet }</div>
                <div>Connected AP</div> <div>{ networking.connectedAP }</div>
                <div>Plug</div> <div>{ networking.plug }</div>
                <div>Type</div> <div>{ networking.type }</div>
            </div>
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
            display: grid;
            grid-template-columns: repeat(2, auto);
            margin-left: 1rem;
        }
    }
</style>
