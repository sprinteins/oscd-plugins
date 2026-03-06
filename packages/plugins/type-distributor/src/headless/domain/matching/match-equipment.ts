import type {
	BayType,
	ConductingEquipmentTemplate
} from '@/headless/common-types'
import { groupEquipmentByType } from './equipment-grouping'
import { getConductingEquipmentTemplate } from './template-lookup'
import type { EquipmentLookupItem, EquipmentMatch } from './types'

export function getScdEquipmentMatchKey(
	scdElement: Element,
	index: number
): string {
	const uuid = scdElement.getAttribute('uuid')?.trim()
	if (uuid) return uuid

	const name = scdElement.getAttribute('name')?.trim()
	if (name) return name

	return `index:${index}`
}

interface MatchEquipmentForInitialApplyParams {
	scdBay: Element
	bayType: BayType
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
	manualMatches?: Map<string, string>
}

export function matchEquipmentForInitialApply({
	scdBay,
	bayType,
	conductingEquipmentTemplates,
	manualMatches
}: MatchEquipmentForInitialApplyParams): EquipmentMatch[] {
	const scdEquipment = Array.from(
		scdBay.querySelectorAll(':scope > ConductingEquipment')
	)
	const equipmentList = createEquipmentLookup(
		bayType,
		conductingEquipmentTemplates
	)
	const usedUuids = new Set<string>()
	const matched = new Set<Element>()
	const matches: EquipmentMatch[] = []

	for (const scdElement of scdEquipment) {
		const templateUuid = scdElement.getAttribute('templateUuid')?.trim()
		if (!templateUuid) continue

		const mapping = equipmentList.find(
			(item) =>
				item.bayTypeEquipment.uuid === templateUuid &&
				!usedUuids.has(item.bayTypeEquipment.uuid)
		)
		if (!mapping) continue

		usedUuids.add(mapping.bayTypeEquipment.uuid)
		matched.add(scdElement)
		matches.push({
			scdElement,
			bayTypeEquipment: mapping.bayTypeEquipment,
			templateEquipment: mapping.template
		})
	}

	if (manualMatches && manualMatches.size > 0) {
		for (const [index, scdElement] of scdEquipment.entries()) {
			if (matched.has(scdElement)) continue

			const equipmentKey = getScdEquipmentMatchKey(scdElement, index)
			const manualTemplateUuid = manualMatches.get(equipmentKey)
			if (!manualTemplateUuid) continue

			const mapping = findMatchingEquipment({
				equipmentList,
				usedUuids,
				matchBy: { templateUuid: manualTemplateUuid }
			})
			if (!mapping) {
				const scdName = scdElement.getAttribute('name') ?? equipmentKey
				throw new Error(
					`No available BayType equipment found for manual match "${manualTemplateUuid}" (equipment "${scdName}", key "${equipmentKey}")`
				)
			}

			usedUuids.add(mapping.bayTypeEquipment.uuid)
			matched.add(scdElement)
			matches.push({
				scdElement,
				bayTypeEquipment: mapping.bayTypeEquipment,
				templateEquipment: mapping.template
			})
		}
	}

	const remaining = scdEquipment.filter((el) => !matched.has(el))
	for (const [type, elements] of Object.entries(
		groupEquipmentByType(remaining)
	)) {
		for (const scdElement of elements) {
			const mapping = findMatchingEquipment({
				equipmentList,
				usedUuids,
				matchBy: { type }
			})
			if (!mapping) {
				const scdName = scdElement.getAttribute('name') || 'unknown'
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

interface MatchEquipmentForApplyBayTypeParams {
	scdBay: Element
	bayType: BayType
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
}

export function matchEquipmentForPersistedBay({
	scdBay,
	bayType,
	conductingEquipmentTemplates
}: MatchEquipmentForApplyBayTypeParams): EquipmentMatch[] {
	const scdEquipment = Array.from(
		scdBay.querySelectorAll(':scope > ConductingEquipment')
	)
	const equipmentList = createEquipmentLookup(
		bayType,
		conductingEquipmentTemplates
	)
	const usedUuids = new Set<string>()
	const matches: EquipmentMatch[] = []

	for (const scdElement of scdEquipment) {
		const templateUuid = scdElement.getAttribute('templateUuid')?.trim()
		if (!templateUuid) {
			const scdName = scdElement.getAttribute('name') || 'unknown'
			throw new Error(
				`Missing templateUuid mapping for persisted SCD equipment "${scdName}"`
			)
		}

		const mapping = equipmentList.find(
			(item) =>
				item.bayTypeEquipment.uuid === templateUuid &&
				!usedUuids.has(item.bayTypeEquipment.uuid)
		)
		if (!mapping) {
			const scdName = scdElement.getAttribute('name') || 'unknown'
			throw new Error(
				`No matching BayType equipment found for SCD equipment "${scdName}" with templateUuid "${templateUuid}"`
			)
		}

		usedUuids.add(mapping.bayTypeEquipment.uuid)
		matches.push({
			scdElement,
			bayTypeEquipment: mapping.bayTypeEquipment,
			templateEquipment: mapping.template
		})
	}

	return matches
}

function createEquipmentLookup(
	bayType: BayType,
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
): EquipmentLookupItem[] {
	const equipmentList: EquipmentLookupItem[] = []

	for (const bayTypeEquipment of bayType.conductingEquipments) {
		const template = getConductingEquipmentTemplate(
			conductingEquipmentTemplates,
			bayTypeEquipment.templateUuid
		)
		if (template) {
			equipmentList.push({ bayTypeEquipment, template })
		}
	}

	return equipmentList
}

interface FindMatchingEquipmentParams {
	equipmentList: EquipmentLookupItem[]
	usedUuids: Set<string>
	matchBy: { templateUuid: string } | { type: string }
}

function findMatchingEquipment({
	equipmentList,
	usedUuids,
	matchBy
}: FindMatchingEquipmentParams): EquipmentLookupItem | undefined {
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
