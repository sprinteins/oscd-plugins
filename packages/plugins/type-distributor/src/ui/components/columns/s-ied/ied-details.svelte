<script lang="ts">
import {
	filterAccessPointGroupsByAccessPoint,
	filterIedDataBySearch,
	groupAccessPointsByServer,
	queryIedDisplayData,
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
	const data = queryIedDisplayData(iedItems)
	const filteredIeds = filterIedDataBySearch(data, searchType, searchTerm)
	const accessPointsByIed = new Map(
		data.map((ied) => [ied.element, ied.accessPoints])
	)

	return filteredIeds.map((ied) => {
		const accessPointGroups = filterAccessPointGroupsByAccessPoint(
			groupAccessPointsByServer(
				accessPointsByIed.get(ied.element) ?? ied.accessPoints
			),
			ied.accessPoints
		)
		return { ...ied, accessPointGroups }
	})
})
</script>
{#if sIedData && sIedData.length > 0}
  <div class="space-y-2 my-2">
    {#each sIedData as ied (ied.element)}
      {#if ied.accessPoints.length === 0}
        <IedEmptyItem iedName={ied.name} iedElement={ied.element} />
      {:else}
        <section class="space-y-2">
          <h2 class="px-1 text-sm font-semibold">{ied.name}</h2>
          {#each ied.accessPointGroups as group (group.type === 'host' ? group.host.element : group.accessPoint.element)}
            {#if group.type === 'host'}
              <AccessPoint
                accessPoint={group.host.element}
                apName={group.host.name}
                lDevices={group.host.lDevices}
                serverAtAccessPoints={group.serverAtAccessPoints}
                iedName={ied.name}
                iedElement={ied.element}
              />
            {:else}
              <ServerAtAccessPoint
                accessPoint={group.accessPoint.element}
                apName={group.accessPoint.name}
                serverAtApName={group.accessPoint.serverAt?.apName ?? ''}
                hostAvailable={false}
                iedName={ied.name}
                iedElement={ied.element}
              />
            {/if}
          {/each}
        </section>
      {/if}
    {/each}
  </div>
{/if}
