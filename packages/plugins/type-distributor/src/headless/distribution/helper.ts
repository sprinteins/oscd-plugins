import type { EqFunctionTemplate } from '../types'
import { ssdImportStore } from '../stores'

export function getOriginUuidFromSsd(element: EqFunctionTemplate): string {
	return element.uuid
}

// like this or maybe just query?
export function getTemplateUuidFromBayTypeForEqFunction(
	element: EqFunctionTemplate
): string {
	const originUuid = getOriginUuidFromSsd(element)

	const bayTypes = ssdImportStore.bayTypes
	for (const bayType of bayTypes) {
		for (const eqfunc of bayType.conductingEquipments) {
			if (originUuid === eqfunc.templateUuid) {
				return eqfunc.uuid
			}
		}
	}
    throw new Error(`Template UUID for EqFunction with origin UUID ${originUuid} not found in any BayType`)
}

export function getConductingEquipmentTemplateFromSCD(): Element | null {