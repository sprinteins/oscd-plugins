import { v4 as uuidv4 } from 'uuid'
import type { SetAttributes } from '@openscd/oscd-api'
import type { EquipmentMatch } from './matching'

export function createEquipmentUpdateEdits(
	matches: EquipmentMatch[],
): SetAttributes[] {
	const updates: SetAttributes[] = []

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
	}
	return updates
}
