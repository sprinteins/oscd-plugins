import type {
	BayType,
	ConductingEquipmentTemplate,
	ConductingEquipmentType
} from '@/headless/common-types'
import { ssdImportStore } from '@/headless/stores'
import { groupEquipmentByType } from '../equipment-grouping'
import type { AmbiguousTypeInfo, ValidationResult } from './types'

export function validateEquipmentMatch(
	scdBay: Element,
	bayType: BayType
): ValidationResult {
	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	const scdCEByType = groupEquipmentByType(scdConductingEquipment)

	const bayTypeCEWithTemplates = bayType.conductingEquipments
		.map((ce) => {
			const template = ssdImportStore.getConductingEquipmentTemplate(
				ce.templateUuid
			)
			return template ? { bayTypeEquipment: ce, template } : null
		})
		.filter(
			(
				item
			): item is {
				bayTypeEquipment: ConductingEquipmentType
				template: ConductingEquipmentTemplate
			} => item !== null
		)

	const bayTypeCETemplates = bayTypeCEWithTemplates.map(
		(item) => item.template
	)

	const bayTypeCEByType = groupTemplatesByType(bayTypeCETemplates)

	const ambiguousTypes = detectAmbiguousTypes(bayTypeCETemplates)

	const countMismatchErrors = buildCountMismatchErrors(
		scdCEByType,
		bayTypeCEByType
	)

	if (ambiguousTypes.length > 0) {
		return {
			isValid: false,
			errors: [
				'Manual matching required: Multiple equipment templates with the same type but different names found.',
				...countMismatchErrors
			],
			countMismatchErrors,
			requiresManualMatching: true,
			ambiguousTypes,
			canAutoMatch: false
		}
	}

	return {
		isValid: countMismatchErrors.length === 0,
		errors: countMismatchErrors,
		countMismatchErrors,
		canAutoMatch: countMismatchErrors.length === 0
	}
}

function detectAmbiguousTypes(
	templates: ConductingEquipmentTemplate[]
): AmbiguousTypeInfo[] {
	const typeGroups = new Map<string, ConductingEquipmentTemplate[]>()

	for (const template of templates) {
		const existing = typeGroups.get(template.type) || []
		existing.push(template)
		typeGroups.set(template.type, existing)
	}

	const ambiguous: AmbiguousTypeInfo[] = []
	for (const [type, group] of typeGroups.entries()) {
		if (group.length > 1) {
			const uniqueNames = new Set(group.map((t) => t.name))
			if (uniqueNames.size > 1) {
				ambiguous.push({
					typeCode: type,
					templateNames: Array.from(uniqueNames)
				})
			}
		}
	}

	return ambiguous
}

function buildCountMismatchErrors(
	scdCEByType: Record<string, Element[]>,
	bayTypeCEByType: Record<string, ConductingEquipmentTemplate[]>
): string[] {
	const errors: string[] = []

	for (const [type, scdElements] of Object.entries(scdCEByType)) {
		const bayTypeElements = bayTypeCEByType[type] || []
		if (scdElements.length !== bayTypeElements.length) {
			errors.push(
				`ConductingEquipment type "${type}": SCD has ${scdElements.length}, BayType has ${bayTypeElements.length}`
			)
		}
	}

	for (const [type, bayTypeElements] of Object.entries(bayTypeCEByType)) {
		if (!scdCEByType[type]) {
			errors.push(
				`ConductingEquipment type "${type}": Missing in SCD (BayType has ${bayTypeElements.length})`
			)
		}
	}

	return errors
}

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
