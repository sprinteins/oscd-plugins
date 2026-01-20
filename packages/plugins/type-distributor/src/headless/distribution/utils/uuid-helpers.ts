import type { EqFunctionTemplate } from '../../types'
import { ssdImportStore } from '../../stores'

/**
 * Gets the origin UUID from an SSD element
 * @param element The EqFunction template element
 * @returns The origin UUID
 */
export function getOriginUuidFromSsd(element: EqFunctionTemplate): string {
	return element.uuid
}

/**
 * Gets the template UUID from the bay type for an EqFunction
 * @param element The EqFunction template element
 * @returns The template UUID from the bay type
 * @throws Error if template UUID not found
 */
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
