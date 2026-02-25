<script lang="ts">
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
import AccessPoint from './access-point.svelte'

const {
	iedItems,
	searchTerm = '',
	searchType = 'IED'
}: {
	iedItems: Element[]
	searchTerm?: string
	searchType?: SearchType
} = $props()

const sIedData = $derived.by(() => {
	const data: IEDData[] = iedItems.map((iedItem) => {
		const name = iedItem.getAttribute('name') ?? 'Unnamed IED'
		const accessPoints = Array.from(
			iedItem.querySelectorAll(':scope > AccessPoint')
		).map((ap) => {
			const lNodes = queryLNodesFromAccessPoint(ap)
			return {
				element: ap,
				name: ap.getAttribute('name'),
				lNodes
			}
		})
		return { name, accessPoints, element: iedItem }
	})

	if (!searchTerm) return data

	switch (searchType) {
		case 'IED':
			return filterByIED(data, searchTerm)
		case 'AccessPoint':
			return filterByAccessPoint(data, searchTerm)
		case 'LDevice':
			return filterByLDevice(data, searchTerm)
		case 'LNode':
			return filterByLNode(data, searchTerm)
		default:
			return data
	}
})
</script>
{#if sIedData && sIedData.length > 0}
  <div class="space-y-2 mb-2">
    {#each sIedData as { name: iedName, accessPoints }}
      {#if accessPoints.length === 0}
        <Card.Root class="border border-dashed text-gray-500">
          <Card.Content class="p-2">
            <span class="text-sm">{iedName} - no Access Points found</span>
          </Card.Content>
        </Card.Root>
      {:else}
        {#each accessPoints as { element: accessPoint, lNodes }}
          <AccessPoint
            {accessPoint}
            {lNodes}
            {iedName}
          />
        {/each}
      {/if}
    {/each}
  </div>
{/if}
