import type {
	BayType,
	ConductingEquipmentTemplate,
	ConductingEquipmentType
} from '@/headless/types'
import { ssdImportStore } from '@/headless/stores'
//TODO: move types

export type AmbiguousTypeInfo = {
	typeCode: string
	templateNames: string[]
}

export type ValidationResult = {
	isValid: boolean
	errors: string[]
	requiresManualMatching?: boolean
	ambiguousTypes?: AmbiguousTypeInfo[]
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

export function validateEquipmentMatch(
	scdBay: Element,
	bayType: BayType
): ValidationResult {
	const errors: string[] = []

	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	const scdCEByType = groupByType(scdConductingEquipment)

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
	if (ambiguousTypes.length > 0) {
		errors.push(
			'Manual matching required: Multiple equipment templates with the same type but different names found.'
		)

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

		return {
			isValid: false,
			errors,
			requiresManualMatching: true,
			ambiguousTypes,
			canAutoMatch: false
		}
	}

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

	return {
		isValid: errors.length === 0,
		errors,
		canAutoMatch: errors.length === 0
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
