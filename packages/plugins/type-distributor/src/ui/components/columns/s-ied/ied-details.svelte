<script lang="ts">
import {
	type AccessPointGroup,
	type FilteredAccessPoint,
	type FilteredIED,
	filterByAccessPoint,
	filterByIED,
	filterByLDevice,
	filterByLNode,
	groupAccessPointsByServer,
	type IEDData,
	queryLDevicesFromAccessPoint,
	type SearchType
} from '@/headless/scl'
import AccessPoint from './access-point.svelte'
import IedEmptyItem from './ied-empty-item.svelte'
import ServerAtAccessPoint from './server-at-access-point.svelte'

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
		).map((ap): FilteredAccessPoint => {
			const serverAt = Array.from(ap.children).find(
				(child) => child.localName === 'ServerAt'
			)
			return {
				element: ap,
				name: ap.getAttribute('name'),
				lDevices: queryLDevicesFromAccessPoint(ap),
				...(serverAt
					? { serverAtApName: serverAt.getAttribute('apName') ?? '' }
					: {})
			}
		})
		return { name, accessPoints, element: iedItem }
	})

	let filteredIeds: FilteredIED[]
	if (!searchTerm) {
		filteredIeds = data
	} else {
		switch (searchType) {
			case 'IED':
				filteredIeds = filterByIED(data, searchTerm)
				break
			case 'AccessPoint':
				filteredIeds = filterByAccessPoint(data, searchTerm)
				break
			case 'LDevice':
				filteredIeds = filterByLDevice(data, searchTerm)
				break
			case 'LNode':
				filteredIeds = filterByLNode(data, searchTerm)
				break
			default:
				filteredIeds = data
		}
	}

	return filteredIeds.map((ied) => {
		const allIedAccessPoints =
			data.find((item) => item.element === ied.element)?.accessPoints ??
			[]
		const matchingAccessPoints = new Map(
			ied.accessPoints.map((accessPoint) => [
				accessPoint.element,
				accessPoint
			])
		)
		const accessPointGroups = groupAccessPointsByServer(allIedAccessPoints)
			.filter((group) => {
				const groupAccessPoints =
					group.type === 'host'
						? [group.host, ...group.serverAtAccessPoints]
						: [group.accessPoint]
				return groupAccessPoints.some((accessPoint) =>
					matchingAccessPoints.has(accessPoint.element)
				)
			})
			.map((group): AccessPointGroup => {
				if (group.type === 'unresolved-server-at') {
					return {
						...group,
						accessPoint:
							matchingAccessPoints.get(
								group.accessPoint.element
							) ?? group.accessPoint
					}
				}
				return {
					...group,
					host:
						matchingAccessPoints.get(group.host.element) ??
						group.host
				}
			})
		return { ...ied, accessPointGroups }
	})
})
</script>
{#if sIedData && sIedData.length > 0}
  <div class="space-y-2 my-2">
    {#each sIedData as { name: iedName, accessPoints, accessPointGroups, element: iedElement }}
      {#if accessPoints.length === 0}
        <IedEmptyItem {iedName} {iedElement} />
      {:else}
        <section class="space-y-2">
          <h2 class="px-1 text-sm font-semibold">{iedName}</h2>
          {#each accessPointGroups as group}
            {#if group.type === 'host'}
              <AccessPoint
                accessPoint={group.host.element}
                apName={group.host.name}
                lDevices={group.host.lDevices}
                serverAtAccessPoints={group.serverAtAccessPoints}
                {iedName}
                iedElement={iedElement}
              />
            {:else}
              <ServerAtAccessPoint
                accessPoint={group.accessPoint.element}
                apName={group.accessPoint.name}
                serverAtApName={group.accessPoint.serverAtApName ?? ''}
                hostAvailable={false}
                {iedName}
                iedElement={iedElement}
              />
            {/if}
          {/each}
        </section>
      {/if}
    {/each}
  </div>
{/if}
