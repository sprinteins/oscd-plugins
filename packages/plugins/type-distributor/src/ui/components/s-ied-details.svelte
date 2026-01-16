<script lang="ts">
import { SIedItem } from '@/ui/components/items'

const {
	sIedItems
}: {
	sIedItems: Element[]
} = $props()

let accessPoints = $derived(
	sIedItems.flatMap((sIedItem) =>
		Array.from(sIedItem?.children ?? []).filter(
			(child) => child.localName === 'AccessPoint'
		)
	)
)

//TODO: Tests
function retrieveLNodesFromAccessPoint(accessPoint: Element): Element[] {
	const lNodes: Element[] = []
	const servers = Array.from(accessPoint.children).filter(
		(child) => child.localName === 'Server'
	)
	
	for (const server of servers) {
		const lDevices = Array.from(server.children).filter(
			(child) => child.localName === 'LDevice'
		)
		
		for (const lDevice of lDevices) {
			const lnElements = Array.from(lDevice.children).filter(
				(child) => child.localName === 'LN0' || child.localName === 'LN'
			)
			lNodes.push(...lnElements)
		}
	}
	
	return lNodes
}

function retrieveSIedName(sIedItem: Element): string {
	return sIedItem.getAttribute('name') ?? 'Unnamed SIed'
}

//TODO: Tests
function sIedNameForAccessPoint(accessPoint: Element): string {
	const sIedItem = accessPoint.parentElement
	return sIedItem ? retrieveSIedName(sIedItem) : 'Unnamed SIed'
}

$effect(() => {
	console.log('AccessPoints in SIedDetails:', accessPoints)
})
</script>

{#if sIedItems && sIedItems.length > 0}
  <div class="space-y-2 mb-2">
    {#if accessPoints.length === 0}
      <div class="text-sm text-gray-500 italic px-2">
        (no AccessPoints found)
      </div>
    {/if}
    {#each accessPoints as accessPoint}
      <SIedItem
        {accessPoint}
        lNodes={retrieveLNodesFromAccessPoint(accessPoint)}
        sIedName={sIedNameForAccessPoint(accessPoint)}
      />
    {/each}
  </div>
{/if}
