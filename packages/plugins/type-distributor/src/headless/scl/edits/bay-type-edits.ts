import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { v4 as uuidv4 } from 'uuid'
import type { BayType } from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'

export function buildUpdateForBay(
	scdBay: Element,
	bayType: BayType
): SetAttributes {
	return {
		element: scdBay,
		attributes: {
			uuid: scdBay.getAttribute('uuid') || uuidv4(),
			templateUuid: bayType.uuid
		},
		attributesNS: {}
	}
}

export function buildEditsForEquipmentUpdates(
	matches: EquipmentMatch[]
): (SetAttributes | Insert)[] {
	const updates: (SetAttributes | Insert)[] = []

	for (const match of matches) {
		const existingUuid = match.scdElement.getAttribute('uuid')?.trim()

		updates.push({
			element: match.scdElement,
			attributes: {
				uuid: existingUuid || uuidv4(),
				templateUuid: match.bayTypeEquipment.uuid,
				originUuid: match.templateEquipment.uuid
			},
			attributesNS: {}
		})

		const existingTerminals = match.scdElement.querySelectorAll('Terminal')
		if (existingTerminals.length > 0) {
			for (const terminal of Array.from(existingTerminals)) {
				if (!terminal.getAttribute('uuid')) {
					updates.push({
						element: terminal,
						attributes: {
							uuid: uuidv4()
						},
						attributesNS: {}
					})
				}
			}
		}
	}
	return updates
}
