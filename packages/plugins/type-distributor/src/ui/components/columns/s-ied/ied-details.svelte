<script lang="ts">
import AccessPoint from './access-point.svelte'
import {
	queryLNodesFromAccessPoint,
	filterByIED,
	filterByAccessPoint,
	filterByLDevice,
	filterByLNode,
	type SearchType,
	type IEDData
} from '@/headless/scl'
import { Card } from '@oscd-plugins/core-ui-svelte'

const {
	sIedItems,
	searchTerm = '',
	searchType = 'IED'
}: {
	sIedItems: Element[]
	searchTerm?: string
	searchType?: SearchType
} = $props()

const normalizedSearchTerm = $derived(searchTerm.toLowerCase().trim())

const sIedData = $derived.by(() => {
	const data: IEDData[] = sIedItems.map((sIedItem) => {
		const name = sIedItem.getAttribute('name') ?? 'Unnamed SIed'
		const accessPoints = Array.from(sIedItem.querySelectorAll(':scope > AccessPoint'))
			.map((ap) => {
				const lNodes = queryLNodesFromAccessPoint(ap)
				return {
					element: ap,
					name: ap.getAttribute('name'),
					lNodes
				}
			})
		return { name, accessPoints, element: sIedItem }
	})

	if (!normalizedSearchTerm) return data

	switch (searchType) {
		case 'IED':
			return filterByIED(data, normalizedSearchTerm)
		case 'AccessPoint':
			return filterByAccessPoint(data, normalizedSearchTerm)
		case 'LDevice':
			return filterByLDevice(data, normalizedSearchTerm)
		case 'LNode':
			return filterByLNode(data, normalizedSearchTerm)
		default:
			return data
	}
})
</script>
{#if sIedData && sIedData.length > 0}
  <div class="space-y-2 mb-2">
    {#each sIedData as { name: sIedName, accessPoints }}
      {#if accessPoints.length === 0}
        <Card.Root class="border border-dashed text-gray-500">
          <Card.Content class="p-2">
            <span class="text-sm">{sIedName} - no Access Points found</span>
          </Card.Content>
        </Card.Root>
      {:else}
        {#each accessPoints as { element: accessPoint, lNodes }}
          <AccessPoint
            {accessPoint}
            {lNodes}
            {sIedName}
          />
        {/each}
      {/if}
    {/each}
  </div>
{/if}
