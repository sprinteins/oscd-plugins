<script lang="ts">
import {
	filterByAccessPoint,
	filterByIED,
	filterByLDevice,
	filterByLNode,
	type IEDData,
	queryLDevicesFromAccessPoint,
	type SearchType
} from '@/headless/scl'
import AccessPoint from './access-point.svelte'
import IedEmptyItem from './ied-empty-item.svelte'

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
			const lDevices = queryLDevicesFromAccessPoint(ap)
			return {
				element: ap,
				name: ap.getAttribute('name'),
				lDevices
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
  <div class="space-y-2 my-2">
    {#each sIedData as { name: iedName, accessPoints }}
      {#if accessPoints.length === 0}
				<IedEmptyItem {iedName} />
      {:else}
        {#each accessPoints as { element: accessPoint, lDevices }}
          <AccessPoint
            {accessPoint}
            {lDevices}
            {iedName}
          />
        {/each}
      {/if}
    {/each}
  </div>
{/if}
