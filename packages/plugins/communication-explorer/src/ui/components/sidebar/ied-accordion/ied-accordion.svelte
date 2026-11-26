<script lang="ts">
import { Badge, Button } from '@oscd-plugins/core-ui-svelte'
import { getConnectedIEDsByLabel } from '../../../../headless/services/_func-layout-calculation/get-connected-ieds'
import { getIEDDetails } from '../../../../headless/services/_func-layout-calculation/get-ied-details'
import {
	createServiceItems,
	filterVisibleServiceItems
} from '../../../../headless/services/ied-detail-view'
import type { MessageType } from '../../../../headless/types'
import { filterState } from '../../../../stores/_store-view-filter'
import PublisherSubscriberAccordion from '../../accordion/publisher-subscriber-accordion/publisher-subscriber-accordion.svelte'
import type { IEDElkNode, RootNode } from '../../diagram'

interface Props {
	rootNode: RootNode
	IEDSelection: IEDElkNode
}

let { rootNode, IEDSelection }: Props = $props()

const serviceTypeColor: Record<MessageType, string> = {
	GOOSE: '--color-message-goose',
	MMS: '--color-message-mms',
	SampledValues: '--color-message-sampledvalues',
	Unknown: '--color-message-unknown'
}

const relations = $derived(
	getConnectedIEDsByLabel(rootNode, IEDSelection.label)
)
const serviceItems = $derived(createServiceItems(relations))
const visibleServiceItems = $derived(
	filterVisibleServiceItems(serviceItems, $filterState)
)
const details = $derived(getIEDDetails(rootNode, IEDSelection.label))
const bays = $derived(Array.from(IEDSelection.bays))

let detailsCollapsed = $state(true)
</script>

{#if bays.length > 0}
	<div class="mb-1 flex w-fit flex-wrap gap-1">
		{#each bays as bay}
			<Badge.Root variant="outline" class="rounded-md border-cyan-600">
				{bay}
			</Badge.Root>
		{/each}
	</div>
{/if}

<div class={bays.length > 0 ? 'ml-4' : ''}>
	<Badge.Root class="rounded-md px-4 py-3 text-xs">
		{IEDSelection.label}
	</Badge.Root>

	{#if details !== null}
		<div class:details-collapsed={detailsCollapsed} class="mt-2">
			{#if details.logicalNodes.length > 0}
				<h3>Logical Nodes</h3>
				{#each details.logicalNodes as node}
					<div>{node}</div>
				{/each}
			{/if}
			{#if details.dataObjects.length > 0}
				<h3>Data Objects</h3>
				{#each details.dataObjects as node}
					<div>{node}</div>
				{/each}
			{/if}
			{#if details.dataAttributes.length > 0}
				<h3>Data Attributes</h3>
				{#each details.dataAttributes as node}
					<div>{node}</div>
				{/each}
			{/if}
		</div>
		<Button.Root
			variant="link"
			size="sm"
			class="mb-3 h-auto p-0"
			aria-expanded={!detailsCollapsed}
			onclick={() => (detailsCollapsed = !detailsCollapsed)}
		>
			{detailsCollapsed ? 'Show more' : 'Show less'}
		</Button.Root>
	{/if}

	<div class="ml-4 flex flex-col gap-4">
		{#each visibleServiceItems as service}
			<PublisherSubscriberAccordion
				color={serviceTypeColor[service.serviceType]}
				serviceType={service.serviceType}
				serviceLabel={service.serviceTypeLabel}
				affectedIEDObjects={[service]}
				connectionDirection={service.connectionDirection}
			/>
		{/each}
	</div>
</div>

<style>
	h3 {
		margin: 0.75rem 0 0.25rem;
		font-weight: 600;
	}

	.details-collapsed {
		max-height: 6.25rem;
		overflow: hidden;
	}
</style>
