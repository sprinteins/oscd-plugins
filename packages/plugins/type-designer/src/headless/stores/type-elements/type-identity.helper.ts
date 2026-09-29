// CONSTANTS
import { TYPE_FAMILY, TYPE_ID_ATTRIBUTE } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, TypeElementByIds } from '@/headless/stores'
// STORES
import { pluginLocalStore } from '@/headless/stores'

function getMissingRequiredAttributes(
	family: AvailableTypeFamily,
	element: Element
) {
	const definition = pluginLocalStore.currentDefinition[TYPE_FAMILY[family]]
	const requiredAttributes = new Set([
		...Object.entries(definition.attributes)
			.filter(([, attribute]) => attribute.required)
			.map(([attributeName]) => attributeName),
		TYPE_ID_ATTRIBUTE[family]
	])

	return Array.from(requiredAttributes).filter(
		(attributeName) => !element.getAttribute(attributeName)?.trim()
	)
}

/**
 * Detects the identifier of a type element and any structural corruption.
 * When a duplicate identifier is found, the earlier entry in
 * `existingElements` is retroactively marked as corrupted too, since neither
 * occurrence can be trusted to be "the" element for that identifier.
 */
export function resolveElementIdentity<
	GenericFamily extends AvailableTypeFamily
>(params: {
	family: GenericFamily
	element: Element
	index: number
	existingElements: TypeElementByIds<GenericFamily>
}) {
	const identifierAttribute = TYPE_ID_ATTRIBUTE[params.family]
	const originalId = params.element.getAttribute(identifierAttribute)
	const fallbackId = `invalid-${params.family}-${params.index}`
	let elementId = originalId || fallbackId
	let corruptionReason: string | undefined

	if (!originalId)
		corruptionReason = `Missing required SCL attribute "${identifierAttribute}"`

	const missingRequiredAttributes = getMissingRequiredAttributes(
		params.family,
		params.element
	)
	if (missingRequiredAttributes.length)
		corruptionReason ??= `Missing or empty required SCL attributes: ${missingRequiredAttributes.join(', ')}`

	if (Object.hasOwn(params.existingElements, elementId)) {
		const duplicateId = elementId
		elementId = fallbackId
		while (Object.hasOwn(params.existingElements, elementId))
			elementId = `${elementId}-duplicate`

		const duplicateReason = `Duplicate ${identifierAttribute} "${duplicateId}"`
		params.existingElements[duplicateId].corruptionReason ??=
			duplicateReason
		corruptionReason ??= duplicateReason
	}

	return { elementId, originalId, corruptionReason }
}
