<script lang="ts">
import AccessPoint from './access-point.svelte'
import { queryLNodesFromAccessPoint } from '@/headless/ied'
import { Card } from '@oscd-plugins/core-ui-svelte'

const {
	iedItems
}: {
	iedItems: Element[]
} = $props()

const iedData = $derived(
	iedItems.map((iedItem) => ({
		name: iedItem.getAttribute('name') ?? 'Unnamed S-IED',
		accessPoints: Array.from(
			iedItem.querySelectorAll(':scope > AccessPoint')
		).map((ap) => ({
			element: ap,
			lNodes: queryLNodesFromAccessPoint(ap)
		})),
		element: iedItem
	}))
)
</script>

{#if iedData && iedData.length > 0}
  <div class="space-y-2 mb-2">
    {#each iedData as { name: iedName, accessPoints }}
      {#if accessPoints.length === 0}
        <Card.Root class="border border-dashed text-gray-500">
          <Card.Content class="p-2">
            <span class="text-sm">{iedName} - no Access Points found</span>
          </Card.Content>
        </Card.Root>
      {:else}
        {#each accessPoints as { element: accessPoint, lNodes }}
          <AccessPoint {accessPoint} {lNodes} {iedName} />
        {/each}
      {/if}
    {/each}
  </div>
{/if}
