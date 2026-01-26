import type { BayType, ConductingEquipmentTemplate, ConductingEquipmentType } from '../types'
import { ssdImportStore } from '../stores'

export type ValidationResult = {
	isValid: boolean
	errors: string[]
	requiresManualMatching?: boolean
	ambiguousTypes?: string[]
	canAutoMatch?: boolean
}

export type EquipmentMatchingInfo = {
	scdEquipment: Element[]
	templateEquipment: {
		bayTypeEquipment: ConductingEquipmentType
		template: ConductingEquipmentTemplate
	}[]
	type: string
}

/**
 * Validates that SCD Bay and BayType have matching equipment counts and types.
 * Detects cases where manual matching is required (e.g., multiple templates with same type).
 * 
 * Auto-matching rules:
 * 1. If there's only one equipment of each type (e.g., one "CTR")
 * 2. If there's only one template variant for a type with multiple equipments (e.g., one "DIS" template type with 3 "DIS" equipments)
 * 
 * Manual matching required when:
 * - Multiple templates with same type but different names (e.g., "Disconnector" and "Earth Switch" both with type="DIS")
 */
export function validateEquipmentMatch(
	scdBay: Element,
	bayType: BayType
): ValidationResult {
	const errors: string[] = []

	// Extract equipment from SCD Bay
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	// Group SCD equipment by type
	const scdCEByType = groupByType(scdConductingEquipment)

	// Get BayType equipment templates with their bayType references
	const bayTypeCEWithTemplates = bayType.conductingEquipments
		.map((ce) => {
			const template = ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid)
			return template ? { bayTypeEquipment: ce, template } : null
		})
		.filter((item): item is { bayTypeEquipment: ConductingEquipmentType, template: ConductingEquipmentTemplate } => item !== null)

	const bayTypeCETemplates = bayTypeCEWithTemplates.map(item => item.template)

	// Group BayType equipment by type
	const bayTypeCEByType = groupTemplatesByType(bayTypeCETemplates)

	// Detect ambiguous types (multiple templates with same type but different names/purposes)
	const ambiguousTypes = detectAmbiguousTypes(bayTypeCETemplates)
	if (ambiguousTypes.length > 0) {
		// Count mismatches - still validate counts
		for (const [type, scdElements] of Object.entries(scdCEByType)) {
			const bayTypeElements = bayTypeCEByType[type] || []
			if (scdElements.length !== bayTypeElements.length) {
				errors.push(
					`ConductingEquipment type "${type}": SCD has ${scdElements.length}, BayType has ${bayTypeElements.length}`
				)
			}
		}

		// Check for missing types in SCD
		for (const [type, bayTypeElements] of Object.entries(bayTypeCEByType)) {
			if (!scdCEByType[type]) {
				errors.push(
					`ConductingEquipment type "${type}": Missing in SCD (BayType has ${bayTypeElements.length})`
				)
			}
		}

		if (errors.length > 0) {
			return {
				isValid: false,
				errors,
				requiresManualMatching: true,
				ambiguousTypes,
				canAutoMatch: false
			}
		}

		// Counts match, but manual matching required due to ambiguity
		return {
			isValid: true,
			errors: [],
			requiresManualMatching: true,
			ambiguousTypes,
			canAutoMatch: false
		}
	}

	// Validate ConductingEquipment counts
	for (const [type, scdElements] of Object.entries(scdCEByType)) {
		const bayTypeElements = bayTypeCEByType[type] || []
		if (scdElements.length !== bayTypeElements.length) {
			errors.push(
				`ConductingEquipment type "${type}": SCD has ${scdElements.length}, BayType has ${bayTypeElements.length}`
			)
		}
	}

	// Check for missing types in SCD
	for (const [type, bayTypeElements] of Object.entries(bayTypeCEByType)) {
		if (!scdCEByType[type]) {
			errors.push(
				`ConductingEquipment type "${type}": Missing in SCD (BayType has ${bayTypeElements.length})`
			)
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		canAutoMatch: errors.length === 0
	}
}

/**
 * Detects if there are multiple equipment templates with the same type.
 * This indicates ambiguity that requires manual user matching.
 *
 * For example, if BayType has:
 * - "Disconnector" with type="DIS"
 * - "Earth Switch" with type="DIS"
 *
 * We cannot automatically determine which SCD equipment should match which template.
 */
function detectAmbiguousTypes(
	templates: ConductingEquipmentTemplate[]
): string[] {
	const typeGroups = new Map<string, ConductingEquipmentTemplate[]>()

	// Group templates by type
	for (const template of templates) {
		const existing = typeGroups.get(template.type) || []
		existing.push(template)
		typeGroups.set(template.type, existing)
	}

	// Find types with multiple templates
	const ambiguous: string[] = []
	for (const [type, group] of typeGroups.entries()) {
		if (group.length > 1) {
			// Check if they have different names (not just duplicates)
			const uniqueNames = new Set(group.map((t) => t.name))
			if (uniqueNames.size > 1) {
				ambiguous.push(
					`${type} (${Array.from(uniqueNames).join(', ')})`
				)
			}
		}
	}

	return ambiguous
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
 * Groups equipment templates by their type
 */
function groupTemplatesByType(
	templates: ConductingEquipmentTemplate[]
): Record<string, ConductingEquipmentTemplate[]> {
	const grouped: Record<string, ConductingEquipmentTemplate[]> = {}
	for (const template of templates) {
		if (!grouped[template.type]) {
			grouped[template.type] = []
		}
		grouped[template.type].push(template)
	}
	return grouped
}
