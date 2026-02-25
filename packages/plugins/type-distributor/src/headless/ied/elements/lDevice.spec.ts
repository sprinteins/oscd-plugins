import { describe, expect, it } from 'vitest'
import { createLDeviceElement } from './lDevice'

describe('lDevice', () => {
	it('GIVEN equipmentUuid match with SCD name WHEN createLDeviceElement THEN uses SCD equipment name for inst', () => {
		// GIVEN a conducting equipment template with eqFunctions
		const sourceFunction = {
			uuid: 'eq-template-1',
			name: 'TemplateEquip',
			type: 'CBR',
			terminals: [],
			eqFunctions: [{ name: 'ProtFunc', lnodes: [], uuid: 'none' }]
		}
		const scdElement = document.createElement('ConductingEquipment')
		scdElement.setAttribute('name', 'BreakerX')
		const equipmentMatches = [
			{
				scdElement,
				templateEquipment: { uuid: 'eq-1' },
				bayTypeEquipment: { uuid: 'bay-type-1' }
			}
		]

		// WHEN creating the LDevice element
		const lDevice = createLDeviceElement(
			document.implementation.createDocument('', '', null),
			{
				sourceFunction,
				equipmentUuid: 'bay-type-1',
				equipmentMatches: equipmentMatches as never
			}
		)

		// THEN the inst uses the SCD equipment name and function name
		expect(lDevice.getAttribute('inst')).toBe('BreakerX_ProtFunc')
	})
})
