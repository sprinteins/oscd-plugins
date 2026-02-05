import type { BayType } from '@/headless/common-types'
import { queryTemplateVoltageLevel, queryNonTemplateBays } from '@/headless/xml-querries/xml-querries'

export function parseBayTypes(doc: XMLDocument): BayType[] {
	const voltageLevel = queryTemplateVoltageLevel(doc)

	if (!voltageLevel) {
		console.warn('No TEMPLATE VoltageLevel found in SSD document')
		return []
	}

	return queryNonTemplateBays(voltageLevel).map((bay) => ({
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
