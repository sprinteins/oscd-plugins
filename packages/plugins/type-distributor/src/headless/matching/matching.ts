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

/**
 * Matches SCD equipment to BayType equipment based on manual user selection.
 * Uses the manualMatches map which maps scdEquipmentName -> templateEquipmentUuid
 */
export function matchEquipmentManually(
	scdBay: Element,
	bayType: BayType,
	manualMatches: Map<string, string>
): EquipmentMatch[] {
	const matches: EquipmentMatch[] = []

	// Get SCD equipment
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	// Build mapping of template UUIDs to BayType equipment and templates
	const templateMap = new Map<
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
			// Store by template UUID (originUuid) not bayType equipment UUID
			templateMap.set(template.uuid, {
				bayTypeEquipment,
				template
			})
		}
	}

	// Match based on manual selections
	for (const scdElement of scdConductingEquipment) {
		const scdName = scdElement.getAttribute('name')
		if (!scdName) continue

		const selectedTemplateUuid = manualMatches.get(scdName)
		if (!selectedTemplateUuid) {
			throw new Error(`No manual match found for equipment "${scdName}"`)
		}

		const mapping = templateMap.get(selectedTemplateUuid)
		if (!mapping) {
			throw new Error(`Template not found for UUID "${selectedTemplateUuid}"`)
		}

		matches.push({
			scdElement,
			bayTypeEquipment: mapping.bayTypeEquipment,
			templateEquipment: mapping.template
		})
	}

	return matches
}

import type { AmbiguousTypeInfo } from './validation'

/**
 * Hybrid matching: Uses manual matches for ambiguous types, automatic sequential for the rest
 * @param scdBay The SCD Bay element
 * @param bayType The BayType to match against
 * @param manualMatches Map of equipment name to template UUID for ambiguous equipment
 * @param ambiguousTypes Array of ambiguous type information
 */
export function matchEquipmentHybrid(
	scdBay: Element,
	bayType: BayType,
	manualMatches: Map<string, string>,
	ambiguousTypes: AmbiguousTypeInfo[]
): EquipmentMatch[] {
	const matches: EquipmentMatch[] = []

	// Get SCD equipment
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	// Extract type codes from ambiguous types
	const ambiguousTypeCodes = ambiguousTypes.map(info => info.typeCode)

	// Build list of all bayType equipment with their templates
	const bayTypeEquipmentList: {
		bayTypeEquipment: ConductingEquipmentType
		template: ConductingEquipmentTemplate
	}[] = []

	for (const bayTypeEquipment of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(
			bayTypeEquipment.templateUuid
		)
		if (template) {
			bayTypeEquipmentList.push({
				bayTypeEquipment,
				template
			})
		}
	}

	// Track which bayType equipment instances have been used
	const usedBayTypeUuids = new Set<string>()

	// Process each SCD equipment
	for (const scdElement of scdConductingEquipment) {
		const scdName = scdElement.getAttribute('name')
		const scdType = scdElement.getAttribute('type')
		
		if (!scdName || !scdType) continue

		// Check if this type is ambiguous
		if (ambiguousTypeCodes.includes(scdType)) {
			// Use manual match
			const selectedTemplateUuid = manualMatches.get(scdName)
			if (!selectedTemplateUuid) {
				throw new Error(`No manual match found for ambiguous equipment "${scdName}" (type: ${scdType})`)
			}

			// Find an unused bayType equipment with the selected template
			const availableMatch = bayTypeEquipmentList.find(
				item => item.template.uuid === selectedTemplateUuid && 
				        !usedBayTypeUuids.has(item.bayTypeEquipment.uuid)
			)

			if (!availableMatch) {
				throw new Error(`No available BayType equipment found for template "${selectedTemplateUuid}"`)
			}

			usedBayTypeUuids.add(availableMatch.bayTypeEquipment.uuid)
			matches.push({
				scdElement,
				bayTypeEquipment: availableMatch.bayTypeEquipment,
				templateEquipment: availableMatch.template
			})
		} else {
			// Use automatic sequential matching for non-ambiguous types
			// Find the next unused bayType equipment of this type
			const availableMatch = bayTypeEquipmentList.find(
				item => item.template.type === scdType && 
				        !usedBayTypeUuids.has(item.bayTypeEquipment.uuid)
			)
			
			if (availableMatch) {
				usedBayTypeUuids.add(availableMatch.bayTypeEquipment.uuid)
				matches.push({
					scdElement,
					bayTypeEquipment: availableMatch.bayTypeEquipment,
					templateEquipment: availableMatch.template
				})
			}
		}
	}

	return matches
}
