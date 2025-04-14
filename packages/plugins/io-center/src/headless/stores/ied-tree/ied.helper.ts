// STORES
import { pluginLocalStore } from '@/headless/stores'
// TYPES
import type { IED } from '@/headless/stores/ied-tree/types'

export function iedElementToIedList(): IED[] {
	return Array.from(pluginLocalStore.rootSubElements?.ied || []).map(
		(iEDElement) => {
			const iedName = iEDElement.getAttribute('name') ?? 'unknown'

			return {
				element: iEDElement,
				id: `IED_${iedName}`,
				name: iedName
			}
		}
	)
}
