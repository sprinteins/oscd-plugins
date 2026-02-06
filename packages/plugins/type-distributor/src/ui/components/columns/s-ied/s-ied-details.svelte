<script lang="ts">
import AccessPoint from './access-point.svelte'
import { queryLNodesFromAccessPoint } from '@/headless/ied'
import { Card } from '@oscd-plugins/core-ui-svelte'

const {
	sIedItems
}: {
	sIedItems: Element[]
} = $props()

const sIedData = $derived(
	sIedItems.map((sIedItem) => ({
		name: sIedItem.getAttribute('name') ?? 'Unnamed SIed',
    accessPoints: Array.from(sIedItem.querySelectorAll(':scope > AccessPoint'))
      .map((ap) => ({
        element: ap,
        lNodes: queryLNodesFromAccessPoint(ap)
      })),
		element: sIedItem
	}))
)
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
