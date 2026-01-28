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

type EquipmentLookupItem = {
	bayTypeEquipment: ConductingEquipmentType
	template: ConductingEquipmentTemplate
}

export function matchEquipment(
	scdBay: Element,
	bayType: BayType,
	manualMatches?: Map<string, string>
): EquipmentMatch[] {
	const matches: EquipmentMatch[] = []

	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	const equipmentList = createEquipmentLookup(bayType)
	const usedUuids = new Set<string>()

	const manuallyMatched = new Set<Element>()

	if (manualMatches && manualMatches.size > 0) {
		for (const scdElement of scdConductingEquipment) {
			const scdName = scdElement.getAttribute('name')
			if (!scdName) continue

			const manualTemplateUuid = manualMatches.get(scdName)
			if (!manualTemplateUuid) continue

			const mapping = findMatchingEquipment(equipmentList, usedUuids, {
				templateUuid: manualTemplateUuid
			})

			if (!mapping) {
				throw new Error(
					`No available BayType equipment found for manual match "${manualTemplateUuid}" (equipment "${scdName}")`
				)
			}

			usedUuids.add(mapping.bayTypeEquipment.uuid)
			manuallyMatched.add(scdElement)
			matches.push({
				scdElement,
				bayTypeEquipment: mapping.bayTypeEquipment,
				templateEquipment: mapping.template
			})
		}
	}

	const remainingEquipment = scdConductingEquipment.filter(
		(el) => !manuallyMatched.has(el)
	)
	const equipmentByType = groupEquipmentByType(remainingEquipment)

	for (const [type, scdElements] of Object.entries(equipmentByType)) {
		for (const scdElement of scdElements) {
			const scdName = scdElement.getAttribute('name') || 'unknown'

			const mapping = findMatchingEquipment(equipmentList, usedUuids, {
				type
			})

			if (!mapping) {
				throw new Error(
					`No matching BayType equipment found for SCD equipment "${scdName}" of type "${type}"`
				)
			}

			usedUuids.add(mapping.bayTypeEquipment.uuid)
			matches.push({
				scdElement,
				bayTypeEquipment: mapping.bayTypeEquipment,
				templateEquipment: mapping.template
			})
		}
	}

	return matches
}

function createEquipmentLookup(bayType: BayType): EquipmentLookupItem[] {
	const equipmentList: EquipmentLookupItem[] = []

	for (const bayTypeEquipment of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(
			bayTypeEquipment.templateUuid
		)
		if (template) {
			equipmentList.push({ bayTypeEquipment, template })
		}
	}

	return equipmentList
}

function findMatchingEquipment(
	equipmentList: EquipmentLookupItem[],
	usedUuids: Set<string>,
	matchBy: { templateUuid: string } | { type: string }
): EquipmentLookupItem | undefined {
	const isAvailable = (item: EquipmentLookupItem) =>
		!usedUuids.has(item.bayTypeEquipment.uuid)

	if ('templateUuid' in matchBy) {
		return equipmentList.find(
			(item) =>
				item.template.uuid === matchBy.templateUuid && isAvailable(item)
		)
	}

	return equipmentList.find(
		(item) => item.template.type === matchBy.type && isAvailable(item)
	)
}

function groupEquipmentByType(elements: Element[]): Record<string, Element[]> {
	const grouped: Record<string, Element[]> = {}

	for (const element of elements) {
		const type = element.getAttribute('type')
		if (!type) continue

		if (!grouped[type]) {
			grouped[type] = []
		}
		grouped[type].push(element)
	}

	return grouped
}
