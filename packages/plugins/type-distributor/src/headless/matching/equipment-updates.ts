import { v4 as uuidv4 } from 'uuid'
import type { SetAttributes } from '@openscd/oscd-api'
import type { BayType } from '../types'
import type { EquipmentMatch } from './matching'
import { ssdImportStore } from '../stores'

/**
 * Creates SetAttributes edits to add UUID attributes to equipment and Bay
 */
export function createEquipmentUpdateEdits(
	matches: EquipmentMatch[],
	scdBay: Element,
	bayType: BayType
): SetAttributes[] {
	const updates: SetAttributes[] = []

	// Update each matched equipment
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

	//TODO: This should happen differently Update Bay element with templateUuid
	const bayTypeTemplateBay = ssdImportStore.bayTypes.find(
		(bay) => bay.name === 'TEMPLATE'
	)

	updates.push({
		element: scdBay,
		attributes: {
			uuid: scdBay.getAttribute('uuid') || uuidv4(),
			templateUuid: bayType.uuid
		},
		attributesNS: {}
	})

	return updates
}
