<script lang="ts">
import type { iconType } from '@omicronenergy/oscd-ui/scl-icon/OscdSclIcon.js'
import { ConnectionTypeDirection } from '../../../headless/services/ied-detail-view'
import type { MessageType } from '../../../headless/types'
import '../scl-icon'

interface Props {
	type: MessageType
	direction?: ConnectionTypeDirection
}

let { type, direction }: Props = $props()

const iconNames: Record<MessageType, iconType> = {
	GOOSE: 'gooseIcon',
	MMS: 'reportIcon',
	SampledValues: 'smvIcon',
	Unknown: 'info'
}
</script>

<span
	class="relative inline-flex size-6 shrink-0 items-center justify-center"
	aria-hidden="true"
>
	<oscd-icon
		class="scl-icon"
		class:goose={type === 'GOOSE'}
		class:mms={type === 'MMS'}
		class:sampled-values={type === 'SampledValues'}
		class:unknown={type === 'Unknown'}
	>
		{iconNames[type]}
	</oscd-icon>

	{#if direction === ConnectionTypeDirection.INCOMING}
		<oscd-icon class="direction">arrow_downward</oscd-icon>
	{:else if direction === ConnectionTypeDirection.OUTGOING}
		<oscd-icon class="direction">arrow_upward</oscd-icon>
	{/if}
</span>

<style>
	oscd-icon {
		--md-icon-size: 1.5rem;
	}

	.goose {
		color: var(--color-message-goose);
	}

	.mms {
		color: var(--color-message-mms);
	}

	.sampled-values {
		color: var(--color-message-sampledvalues);
	}

	.unknown {
		color: var(--color-message-unknown);
	}

	.direction {
		--md-icon-size: 0.75rem;
		position: absolute;
		right: -0.25rem;
		bottom: -0.25rem;
		background: var(--background);
	}
</style>
