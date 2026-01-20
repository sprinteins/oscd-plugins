<script lang="ts">
  import { AccessPointItem } from "@/ui/components/items";
  import { getLNodesFromAccessPoint } from "@/headless/ied";
  import { Card } from "@oscd-plugins/core-ui-svelte";

  const {
    sIedItems,
  }: {
    sIedItems: Element[];
  } = $props();
</script>

{#if sIedItems && sIedItems.length > 0}
  <div class="space-y-2 mb-2">
    {#each sIedItems as sIedItem}
      {@const accessPoints = Array.from(sIedItem.children).filter(
        (child) => child.localName === "AccessPoint",
      )}
      {@const sIedName = sIedItem.getAttribute("name") ?? "Unnamed SIed"}

      {#if accessPoints.length === 0}
        <Card.Root class="border border-dashed text-gray-500">
          <Card.Content class="p-2">
            
              <span class="text-sm">{sIedName}: no Access Points found</span>
          </Card.Content>
        </Card.Root>
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
