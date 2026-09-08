<script lang="ts">
// CONSTANTS
import { MESSAGE_TYPE } from '@oscd-plugins/core'
import {
	Icons,
	type OpenSCDIconNames
} from '@oscd-plugins/ui/src/components/icons'
// TYPES
import type { MessageType } from '../../../../headless/types'
import { isSelected, setTargetMessageType } from '.'

interface Props {
	filterDisabled: boolean
	selectedMessageTypes: string[]
}

let { filterDisabled, selectedMessageTypes }: Props = $props()

let checkboxIsClicked = true

type MessageTypeOption = {
	type: MessageType
	label: string
	icon: OpenSCDIconNames
	testId?: string
}

// Adding a new message type only requires a new entry here -
// markup and styling below are generic and apply to all entries.
const messageTypeOptions: MessageTypeOption[] = [
	{
		type: MESSAGE_TYPE.MMS,
		label: 'MMS',
		icon: 'tscdMmsIcon',
		testId: 'exampleFilterToBeChecked'
	},
	{ type: MESSAGE_TYPE.GOOSE, label: 'GOOSE', icon: 'tscdGooseIcon' },
	{
		type: MESSAGE_TYPE.SampledValues,
		label: 'Sampled Values',
		icon: 'tscdSvIcon'
	},
	{ type: MESSAGE_TYPE.Report, label: 'Report', icon: 'reportIcon' },
	{ type: MESSAGE_TYPE.Unknown, label: 'Unknown', icon: 'unknownIcon' }
]
</script>

<div class="message-type">
    {#each messageTypeOptions as option (option.type)}
        <label>
            <input
                type="checkbox"
                onchange={setTargetMessageType}
                checked={isSelected(
                    option.type,
                    selectedMessageTypes,
                    checkboxIsClicked
                )}
                disabled={filterDisabled}
                name={option.type}
                data-testid={option.testId}
            />
            <div class="message-label">
                <div class="icon">
                    <Icons size={"normal"} name={option.icon} />
                </div>
                <span class="text">{option.label}</span>
            </div>
        </label>
    {/each}
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

    // rule applies, when a checkbox is checked AND not disabled
    // affects the sibling div.message-label, regardless of message type
    input[type="checkbox"]:checked:not([disabled]) + div.message-label {
        opacity: 1;
    }

    .message-type label input[disabled] + div.message-label {
        .text {
            color: var(--color-text-disabled-1);
        }
    }
</style>

