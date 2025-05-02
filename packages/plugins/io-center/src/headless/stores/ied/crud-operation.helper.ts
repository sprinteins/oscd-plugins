// STORES
import { pluginLocalStore } from '@/headless/stores'
// TYPES
import type { IED } from '@/headless/stores'

//====== READ ======//

export function iedElementToIedList(): IED[] {
	return Array.from(pluginLocalStore.rootSubElements?.ied || []).map(
		(iEDElement) => {
			const iedName = iEDElement.getAttribute('name')
			if (!iedName) throw new Error('IED name not found')

			const uuid = iEDElement.getAttribute('uuid')
			if (!uuid) throw new Error('IED uuid not found')

			return {
				element: iEDElement,
				uuid,
				name: iedName
			}
		}
	)
}
