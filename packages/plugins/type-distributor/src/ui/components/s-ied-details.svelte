<script lang="ts">
import { SIedItem } from '@/ui/components/items'

const {
  sIedItems
}: {
  sIedItems: Element[]
} = $props()

let accessPoints = $derived(sIedItems.flatMap((sIedItem) =>
  Array.from(sIedItem?.children ?? []).filter(
    (child) => child.localName === 'AccessPoint'
  )
))

function retrieveLNodesFromAccessPoint(accessPoint: Element): Element[] {
  return Array.from(accessPoint.children).filter(
    (child) => child.localName === 'LNode'
  )
}

$effect(() => {
  console.log('AccessPoints in SIedDetails:', accessPoints);
});
</script>

{#if sIedItems && sIedItems.length > 0}
  <div class="space-y-2 mb-2">
    {#if accessPoints.length === 0}
      <div class="text-sm text-gray-500 italic px-2">
        (no AccessPoints found)
      </div>
    {/if}
    {#each accessPoints as accessPoint}
      <SIedItem {accessPoint} lNodes={retrieveLNodesFromAccessPoint(accessPoint)} />
    {/each}
  </div>
{/if}
