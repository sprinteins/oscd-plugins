<script lang="ts">
import { MESSAGE_TYPE } from '@oscd-plugins/core'
import { Checkbox, Label } from '@oscd-plugins/core-ui-svelte'
import type { MessageType } from '../../../../headless/types'
import MessageTypeIcon from '../../message-type-icon/message-type-icon.svelte'
import { isSelected, setTargetMessageType } from '.'

interface Props {
	filterDisabled: boolean
	selectedMessageTypes: string[]
}

let { filterDisabled, selectedMessageTypes }: Props = $props()

type MessageTypeOption = {
	type: MessageType
	label: string
}

const messageTypeOptions: MessageTypeOption[] = [
	{ type: MESSAGE_TYPE.MMS, label: 'MMS' },
	{ type: MESSAGE_TYPE.GOOSE, label: 'GOOSE' },
	{
		type: MESSAGE_TYPE.SampledValues,
		label: 'Sampled Values'
	},
	{ type: MESSAGE_TYPE.Unknown, label: 'Unknown' }
]
</script>

<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
	{#each messageTypeOptions as option (option.type)}
		<div class="flex items-center gap-2">
			<Checkbox.Root
				id={`message-type-${option.type}`}
				checked={isSelected(option.type, selectedMessageTypes)}
				disabled={filterDisabled}
				aria-label={option.label}
				onCheckedChange={(checked) =>
					setTargetMessageType(option.type, checked === true)}
			/>
			<MessageTypeIcon type={option.type} />
			<Label.Root
				for={`message-type-${option.type}`}
				class={isSelected(option.type, selectedMessageTypes) && !filterDisabled
					? ''
					: 'opacity-40'}
			>
				{option.label}
			</Label.Root>
		</div>
	{/each}
</div>
