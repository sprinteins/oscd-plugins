<script lang="ts">
    import { MessageType } from "@oscd-plugins/core"
    import { isSelected, setTargetMessageType } from "."
    import Icons from "../../../../components/icons/icons.svelte"

    export let filterDisabled: boolean
    export let selectedMessageTypes: string[]

    let checkboxIsClicked = true
</script>

<div class="message-type">
    <label>
        <input
            type="checkbox"
            on:change={setTargetMessageType}
            checked={isSelected(
                MessageType.MMS,
                selectedMessageTypes,
                checkboxIsClicked
            )}
            disabled={filterDisabled}
            name={MessageType.MMS}
            data-testid="exampleFilterToBeChecked"
            class="mms-checkbox"
        />
        <div class="message-label">
            <div class="icon">
                <Icons size={"normal"} name={"tscdMmsIcon"} />
            </div>
            <span class="text">MMS</span>
        </div>
    </label>
    <label>
        <input
            type="checkbox"
            on:change={setTargetMessageType}
            checked={isSelected(
                MessageType.GOOSE,
                selectedMessageTypes,
                checkboxIsClicked
            )}
            disabled={filterDisabled}
            name={MessageType.GOOSE}
            class="goose-checkbox"
        />
        <div class="message-label">
            <div class="icon">
                <Icons size={"normal"} name={"tscdGooseIcon"} />
            </div>
            <span class="text">GOOSE</span>
        </div>
    </label>
    <label>
        <input
            type="checkbox"
            on:change={setTargetMessageType}
            checked={isSelected(
                MessageType.SampledValues,
                selectedMessageTypes,
                checkboxIsClicked
            )}
            disabled={filterDisabled}
            name={MessageType.SampledValues}
            class="sampledvalues-checkbox"
        />
        <div class="message-label">
            <div class="icon">
                <Icons size={"normal"} name={"tscdSvIcon"} />
            </div>
            <span class="text">Sampled Values</span>
        </div>
    </label>
    <label>
        <input
            type="checkbox"
            on:change={setTargetMessageType}
            checked={isSelected(
                MessageType.Unknown,
                selectedMessageTypes,
                checkboxIsClicked
            )}
            disabled={filterDisabled}
            name={MessageType.Unknown}
            class="undefined-checkbox"
        />
        <div class="message-label">
            <div class="icon">
                <Icons size={"normal"} name={"unknownIcon"} />
            </div>
            <span class="text">Unknown</span>
        </div>
    </label>
</div>

<style lang="scss">
    .message-type {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20ch, 1fr));
        gap: 0.3rem;
        color: var(--font-color);
    }

    .message-type label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    input[type="checkbox"] {
        accent-color: var(--color-accent);
        margin: 0;
    }

    .message-label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: -0.1rem;
        opacity: 0.4;
    }

    // rule applies, when checkbox is checked AND not disabled
    // affects the div.message-label class
    .mms-checkbox:checked:not([disabled]) + div.message-label {
        opacity: 1;
    }

    // rule applies, when checkbox is checked AND not disabled
    // affects the div.message-label class
    .goose-checkbox:checked:not([disabled]) + div.message-label {
        opacity: 1;
    }

    // rule applies, when checkbox is checked AND not disabled
    // affects the div.message-label class
    .sampledvalues-checkbox:checked:not([disabled]) + div.message-label {
        opacity: 1;
    }

    .undefined-checkbox:checked:not([disabled]) + div.message-label {
        opacity: 1;
    }

    .message-type label input[disabled] + div.message-label {
        .text {
            color: var(--color-text-disabled-1);
        }
    }
</style>
