<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'
import { changeMessageConnectionFilterDirection } from '../../../../stores/_store-view-filter'

interface Props {
	disabled?: boolean
	isFilterIncomingActive?: boolean
	isFilterOutgoingActive?: boolean
}

let {
	disabled = false,
	isFilterIncomingActive = false,
	isFilterOutgoingActive = false
}: Props = $props()

function handleClickOnPublisher() {
	changeMessageConnectionFilterDirection(
		!isFilterIncomingActive,
		isFilterOutgoingActive
	)
}

function handleClickOnSubscriber() {
	changeMessageConnectionFilterDirection(
		isFilterIncomingActive,
		!isFilterOutgoingActive
	)
}
</script>

<div class="flex flex-wrap gap-2">
	<Button.Root
		variant={isFilterIncomingActive ? 'secondary' : 'outline'}
		{disabled}
		aria-pressed={isFilterIncomingActive}
		onclick={handleClickOnPublisher}
	>
		Published
	</Button.Root>
	<Button.Root
		variant={isFilterOutgoingActive ? 'secondary' : 'outline'}
		{disabled}
		aria-pressed={isFilterOutgoingActive}
		onclick={handleClickOnSubscriber}
	>
		Subscribed
	</Button.Root>
</div>
