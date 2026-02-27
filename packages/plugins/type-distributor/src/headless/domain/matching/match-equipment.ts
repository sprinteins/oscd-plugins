import type {
	BayType,
	ConductingEquipmentTemplate,
	EquipmentMatch
} from '@/headless/common-types'
import { groupEquipmentByType } from './equipment-grouping'
import type { EquipmentLookupItem } from './types'

export function matchEquipment(
	scdBay: Element,
	bayType: BayType,
	conductingEquipmentTemplates: ConductingEquipmentTemplate[],
	manualMatches?: Map<string, string>
): EquipmentMatch[] {
	const matches: EquipmentMatch[] = []

	const scdConductingEquipment = Array.from(
		scdBay.querySelectorAll('ConductingEquipment')
	)

	const equipmentList = createEquipmentLookup(
		bayType,
		conductingEquipmentTemplates
	)
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
	const remainingByType = groupEquipmentByType(remainingEquipment)

	for (const [type, scdElements] of Object.entries(remainingByType)) {
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

function createEquipmentLookup(
	bayType: BayType,
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
): EquipmentLookupItem[] {
	const equipmentList: EquipmentLookupItem[] = []

	for (const bayTypeEquipment of bayType.conductingEquipments) {
		const template = conductingEquipmentTemplates.find(
			(t) => t.uuid === bayTypeEquipment.templateUuid
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
