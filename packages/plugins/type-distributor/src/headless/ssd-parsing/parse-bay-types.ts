import type { BayType } from '@/headless/types'

export function parseBayTypes(doc: XMLDocument): BayType[] {
	const voltageLevel = doc.querySelector(
		'Substation[name="TEMPLATE"] > VoltageLevel[name="TEMPLATE"]'
	)

	if (!voltageLevel) {
		console.warn('No TEMPLATE VoltageLevel found in SSD document')
		return []
	}

	return Array.from(
		voltageLevel.querySelectorAll('Bay:not([name="TEMPLATE"])')
	).map((bay) => ({
		uuid: bay.getAttribute('uuid') || '',
		name: bay.getAttribute('name') || 'Unnamed Bay',
		desc: bay.getAttribute('desc') || undefined,
		conductingEquipments: Array.from(
			bay.querySelectorAll('ConductingEquipment')
		).map((ce) => ({
			uuid: ce.getAttribute('uuid') || '',
			templateUuid: ce.getAttribute('templateUuid') || '',
			virtual: ce.getAttribute('virtual') === 'true'
		})),
		functions: Array.from(bay.querySelectorAll('Function')).map((func) => ({
			uuid: func.getAttribute('uuid') || '',
			templateUuid: func.getAttribute('templateUuid') || ''
		}))
	}))
}
