// CORE
import {
	findAllStandardElementsByTagNameNS,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
import { v4 as uuidv4 } from 'uuid'
// CONSTANTS
import {
	REF_FAMILY_TO_TYPE_FAMILY_MAP,
	TYPE_FAMILY,
	TYPE_ID_ATTRIBUTE
} from '@/headless/constants'
// TYPES
import type { RefElementsByFamily, RefRawElement } from '@/headless/stores'
// STORES
import { pluginLocalStore, typeElementsStore } from '@/headless/stores'

export function getEmptyRefs(): RefElementsByFamily {
	return {
		generalEquipment: {},
		conductingEquipment: {},
		function: {},
		eqFunction: {},
		lNode: {}
	}
}

export type RefsResult =
	| { refs: RefElementsByFamily; corruptionReason?: undefined }
	| { refs: RefElementsByFamily; corruptionReason: string }

/**
 * Builds the reference map for a type element. Reports a malformed or
 * dangling reference via `corruptionReason` rather than throwing.
 */
export function buildRefs(element: Element, rootElement?: Element): RefsResult {
	const refs = getEmptyRefs()

	for (const childElement of Array.from(element.children)) {
		if (
			!typeGuard.isPropertyOfObject(
				childElement.tagName,
				typeElementsStore.mapRefTagNameToRefFamily
			)
		)
			continue

		const refFamily =
			typeElementsStore.mapRefTagNameToRefFamily[childElement.tagName]

		//get LNodeType ids
		const lnTypeAttribute = childElement.getAttribute('lnType')
		//get other Types uuids
		const templateUuidAttribute = childElement.getAttribute('templateUuid')
		const typeId = lnTypeAttribute || templateUuidAttribute || ''

		if (!typeId)
			return {
				refs: getEmptyRefs(),
				corruptionReason: 'No id found for ref element'
			}

		const typeFamily = REF_FAMILY_TO_TYPE_FAMILY_MAP[refFamily]

		if (rootElement) {
			const targetDefinition =
				pluginLocalStore.currentDefinition[TYPE_FAMILY[typeFamily]]
			const targetIdAttribute = TYPE_ID_ATTRIBUTE[typeFamily]
			const targetExists = findAllStandardElementsByTagNameNS<
				typeof typeFamily,
				typeof pluginLocalStore.currentEdition,
				typeof pluginLocalStore.currentUnstableRevision
			>({
				namespace: '*',
				tagName: targetDefinition.tag,
				root: rootElement
			}).some(
				(targetElement) =>
					targetElement.getAttribute(targetIdAttribute) === typeId
			)

			if (!targetExists)
				return {
					refs: getEmptyRefs(),
					corruptionReason: `No ${targetDefinition.tag} found with ${targetIdAttribute} "${typeId}"`
				}
		}

		const refOccurrence =
			Object.values(refs[refFamily]).filter(
				(ref) => ref.source.id === typeId
			).length + 1

		refs[refFamily][uuidv4()] = {
			element: childElement as RefRawElement<typeof refFamily>,
			source: {
				id: typeId,
				family: typeFamily
			},
			occurrence: refOccurrence
		} as RefElementsByFamily[typeof refFamily][string]
	}

	return { refs }
}
