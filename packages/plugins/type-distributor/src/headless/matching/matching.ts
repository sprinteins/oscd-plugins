import type {
	BayType,
	ConductingEquipmentType,
	ConductingEquipmentTemplate
} from '../types'
import { ssdImportStore } from '../stores'

export type EquipmentMatch = {
	scdElement: Element
	bayTypeEquipment: ConductingEquipmentType
	templateEquipment: ConductingEquipmentTemplate
}

/**
 * Matches SCD equipment to BayType equipment sequentially by type.
 * For duplicate types (e.g., multiple "DIS"), matches in order: 1st->1st, 2nd->2nd, etc.
 *
 * Note: This assumes there's only ONE template per equipment type in the BayType.
 * If there are multiple templates with the same type (e.g., "Disconnector" and "Earth Switch"
 * both with type="DIS"), validation should have already caught this as requiring manual matching.
 */
export function matchEquipmentSequentially(
	scdBay: Element,
	bayType: BayType
): EquipmentMatch[] {
	const matches: EquipmentMatch[] = []

	// Get SCD equipment
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	// Build mapping of BayType equipment to templates
	const bayTypeEquipmentMap = new Map<
		string,
		{
			bayTypeEquipment: ConductingEquipmentType
			template: ConductingEquipmentTemplate
		}
	>()

	for (const bayTypeEquipment of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(
			bayTypeEquipment.templateUuid
		)
		if (template) {
			bayTypeEquipmentMap.set(bayTypeEquipment.uuid, {
				bayTypeEquipment,
				template
			})
		}
	}

	// Group SCD and BayType equipment by type for sequential matching
	const scdByType = groupByType(scdConductingEquipment)
	const bayTypeByType: Record<string, ConductingEquipmentType[]> = {}

	for (const [uuid, { bayTypeEquipment, template }] of bayTypeEquipmentMap) {
		const type = template.type
		if (!bayTypeByType[type]) {
			bayTypeByType[type] = []
		}
		bayTypeByType[type].push(bayTypeEquipment)
	}

	// Match sequentially: 1st SCD element of type X -> 1st BayType element of type X
	for (const [type, scdElements] of Object.entries(scdByType)) {
		const bayTypeElements = bayTypeByType[type] || []

		for (let i = 0; i < scdElements.length; i++) {
			const scdElement = scdElements[i]
			const bayTypeEquipment = bayTypeElements[i]

			if (bayTypeEquipment) {
				const mapping = bayTypeEquipmentMap.get(bayTypeEquipment.uuid)
				if (mapping) {
					matches.push({
						scdElement,
						bayTypeEquipment: mapping.bayTypeEquipment,
						templateEquipment: mapping.template
					})
				}
			}
		}
	}

	return matches
}

/**
 * Groups equipment elements by their type attribute
 */
function groupByType(elements: Element[]): Record<string, Element[]> {
	const grouped: Record<string, Element[]> = {}
	for (const element of elements) {
		const type = element.getAttribute('type')
		if (type) {
			if (!grouped[type]) {
				grouped[type] = []
			}
			grouped[type].push(element)
		}
	}
	return grouped
}
