import { v4 as uuidv4 } from 'uuid'
import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type { EquipmentMatch } from '@/headless/matching/types'

export function buildEditsForEquipmentUpdates(matches: EquipmentMatch[]) {
	const updates: (SetAttributes | Insert)[] = []

	for (const match of matches) {
		updates.push({
			element: match.scdElement,
			attributes: {
				uuid: uuidv4(),
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
