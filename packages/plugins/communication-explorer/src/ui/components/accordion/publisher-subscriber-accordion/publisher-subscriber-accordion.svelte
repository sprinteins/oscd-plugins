<script lang="ts">
import { Accordion } from '@oscd-plugins/core-ui-svelte'
import { ConnectionTypeDirection } from '../../../../headless/services/ied-detail-view'
import type { MessageType } from '../../../../headless/types'
import MessageTypeIcon from '../../message-type-icon/message-type-icon.svelte'
import type { ServiceObject } from '../../sidebar/ied-accordion'

interface Props {
	open?: boolean
	serviceType: MessageType
	serviceLabel?: string
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

let accordionValue = $state(open ? 'service' : '')

$effect(() => {
	open = accordionValue === 'service'
})

const affectedSubscriberIEDs = $derived(
	affectedIEDObjects
		.filter(
			(item) =>
				item.connectionDirection === ConnectionTypeDirection.INCOMING
		)
		.map((item) => item.node)
)
const affectedPublisherIEDs = $derived(
	affectedIEDObjects
		.filter(
			(item) =>
				item.connectionDirection === ConnectionTypeDirection.OUTGOING
		)
		.map((item) => item.node)
)
</script>

<Accordion.Root type="single" bind:value={accordionValue} class="w-full">
	<Accordion.Item
		value="service"
		class="rounded-md border-2 border-[var(--color-accent)] bg-[#ede8d7]"
		style={`border-color: var(${color})`}
	>
		<Accordion.Trigger class="px-3 py-[0.4rem] text-xs leading-normal hover:no-underline">
			<span class="flex min-w-0 items-center gap-2">
				<MessageTypeIcon type={serviceType} direction={connectionDirection} />
				<span class="truncate">{serviceType} - {serviceLabel}</span>
			</span>
		</Accordion.Trigger>
		<Accordion.Content
			class="px-3 text-xs leading-normal data-[state=closed]:hidden data-[state=open]:block"
		>
			<hr class="dashed-separator" />
			<div class="ml-4 flex flex-col">
				<div>Label: {serviceLabel}</div>
				<div>MessageType: {serviceType}</div>
			</div>

			<hr class="solid-separator" />
			<div>
				{#if affectedSubscriberIEDs.length + affectedPublisherIEDs.length === 0}
					<p class="px-2">No items found</p>
				{:else}
					{#if affectedSubscriberIEDs.length > 0}
						<ul class="space-y-2" aria-label="Subscribers">
							<li class="font-medium">Subscribers</li>
							{#each affectedSubscriberIEDs as ied}
								<li class="ied-item">{ied.label}</li>
							{/each}
						</ul>
					{/if}

					{#if affectedPublisherIEDs.length > 0}
						<ul class="mt-3 space-y-2" aria-label="Publishers">
							<li class="font-medium">Publishers</li>
							{#each affectedPublisherIEDs as ied}
								<li class="ied-item">{ied.label}</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

<style>
	.dashed-separator,
	.solid-separator {
		width: 95%;
		border: 0;
		border-top: 0.1rem solid var(--color-accent);
		margin-right: auto;
		margin-left: auto;
	}

	.dashed-separator {
		border-top-style: dashed;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.solid-separator {
		margin-top: 0.4rem;
		margin-bottom: 0.6rem;
	}

	:global(.ied-item) {
		border: 1px solid #4d5d63;
		border-radius: 0.375rem;
		background-color: #fdfbf2;
		padding: 0.4rem 1.2rem;
	}
</style>
