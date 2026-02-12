import { describe, expect, it, beforeEach, vi } from 'vitest'
import { createLDeviceElement } from './lDevice'

vi.mock('../../stores/bay.store.svelte', () => ({
	bayStore: {
		equipmentMatches: [] as Array<{
			scdElement: Element
			templateEquipment: { uuid: string }
		}>
	}
}))

import { bayStore } from '../../stores/bay.store.svelte'

describe('lDevice', () => {
	beforeEach(() => {
		bayStore.equipmentMatches = []
		vi.clearAllMocks()
	})

	it('GIVEN equipmentUuid match with SCD name WHEN createLDeviceElement THEN uses SCD equipment name for inst', () => {
		// GIVEN a conducting equipment template with eqFunctions
		 const sourceFunction = {
            uuid: 'eq-template-1',
            name: 'TemplateEquip',
            type: 'CBR',
            terminals: [],
            eqFunctions: [{ name: 'ProtFunc', lnodes: [], uuid: "none" }]
        }
		const scdElement = document.createElement('ConductingEquipment')
		scdElement.setAttribute('name', 'BreakerX')
		bayStore.equipmentMatches = [
			{
				scdElement,
				templateEquipment: { uuid: 'eq-1' },
        bayTypeEquipment: { uuid: 'bay-type-1' }
			}
		]

		// WHEN creating the LDevice element
		const lDevice = createLDeviceElement(
			document.implementation.createDocument('', '', null),
			sourceFunction,
			'eq-1'
		)

		// THEN the inst uses the SCD equipment name and function name
		expect(lDevice.getAttribute('inst')).toBe('BreakerX_ProtFunc')
	})
})
