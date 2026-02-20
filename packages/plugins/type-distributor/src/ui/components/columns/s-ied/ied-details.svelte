<script lang="ts">
import AccessPoint from './access-point.svelte'
import { queryLNodesFromAccessPoint } from '@/headless/scl'
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'

type SearchType = 'IED' | 'AccessPoint' | 'LDevice' | 'LNode'

const {
	sIedItems,
	searchTerm = '',
	searchType = 'IED'
}: {
	sIedItems: Element[]
	searchTerm?: string
	searchType?: SearchType
} = $props()

const normalizedSearchTerm = $derived(searchTerm.toLowerCase().trim())

function matchesLNode(lNode: LNodeTemplate, term: string): boolean {
	return (
		lNode.lnClass.toLowerCase().includes(term) ||
		lNode.lnType.toLowerCase().includes(term) ||
		lNode.lnInst.toLowerCase().includes(term)
	)
}

function matchesLDevice(lDeviceName: string | undefined, term: string): boolean {
	return lDeviceName?.toLowerCase().includes(term) ?? false
}

function matchesAccessPoint(apName: string | null, term: string): boolean {
	return apName?.toLowerCase().includes(term) ?? false
}

function matchesIED(iedName: string, term: string): boolean {
	return iedName.toLowerCase().includes(term)
}

const sIedData = $derived.by(() => {
	const data = sIedItems.map((sIedItem) => {
		const name = sIedItem.getAttribute('name') ?? 'Unnamed SIed'
		const accessPoints = Array.from(sIedItem.querySelectorAll(':scope > AccessPoint'))
			.map((ap) => {
				const lNodes = queryLNodesFromAccessPoint(ap)
				return {
					element: ap,
					name: ap.getAttribute('name'),
					lNodes
				}
			})
		return { name, accessPoints, element: sIedItem }
	})

	if (!normalizedSearchTerm) return data

	return data
		.map((ied) => {
			if (searchType === 'IED') {
				if (matchesIED(ied.name, normalizedSearchTerm)) {
					return ied
				}
				return null
			}

			if (searchType === 'AccessPoint') {
				const filteredAPs = ied.accessPoints.filter((ap) =>
					matchesAccessPoint(ap.name, normalizedSearchTerm)
				)
				if (filteredAPs.length > 0) {
					return { ...ied, accessPoints: filteredAPs }
				}
				return null
			}

			if (searchType === 'LDevice') {
				const filteredAPs = ied.accessPoints
					.map((ap) => {
						const filteredLNodes = ap.lNodes.filter((ln) =>
							matchesLDevice(ln.lDeviceName, normalizedSearchTerm)
						)
						if (filteredLNodes.length > 0) {
							return { ...ap, lNodes: filteredLNodes }
						}
						return null
					})
					.filter(Boolean) as typeof ied.accessPoints
				if (filteredAPs.length > 0) {
					return { ...ied, accessPoints: filteredAPs }
				}
				return null
			}

			if (searchType === 'LNode') {
				const filteredAPs = ied.accessPoints
					.map((ap) => {
						const filteredLNodes = ap.lNodes.filter((ln) =>
							matchesLNode(ln, normalizedSearchTerm)
						)
						if (filteredLNodes.length > 0) {
							return { ...ap, lNodes: filteredLNodes }
						}
						return null
					})
					.filter(Boolean) as typeof ied.accessPoints
				if (filteredAPs.length > 0) {
					return { ...ied, accessPoints: filteredAPs }
				}
				return null
			}

			return ied
		})
		.filter(Boolean) as typeof data
})
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
