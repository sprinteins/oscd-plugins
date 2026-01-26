<script lang="ts">
import { AccessPointItem } from '@/ui/components/items'
import { getLNodesFromAccessPoint } from '@/headless/ied'

const {
	sIedItems
}: {
	sIedItems: Element[]
} = $props()
</script>

{#if sIedItems && sIedItems.length > 0}
  <div class="space-y-2 mb-2">
    {#each sIedItems as sIedItem}
      {@const accessPoints = Array.from(sIedItem.children).filter(
        (child) => child.localName === "AccessPoint",
      )}
      {@const sIedName = sIedItem.getAttribute("name") ?? "Unnamed SIed"}

      {#if accessPoints.length === 0}
        <div class="text-sm text-gray-500 italic px-2">
          {sIedName}: (no AccessPoints found)
        </div>
      {:else}
        {#each accessPoints as accessPoint}
          <AccessPointItem
            {accessPoint}
            lNodes={getLNodesFromAccessPoint(accessPoint)}
            {sIedName}
          />
        {/each}
      {/if}
    {/each}
  </div>
{/if}
