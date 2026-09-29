// CORE
import {
	findAllCustomElementBySelector,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type { AvailableRefFamily, AvailableTypeFamily } from '@/headless/stores'
// STORES
import { typeElementsStore } from '@/headless/stores'

export type RefFamilyResult =
	| {
			refFamily: AvailableRefFamily | undefined
			corruptionReason?: undefined
	  }
	| { refFamily: undefined; corruptionReason: string }

function getRefFamilyByChildren(
	elementId: string,
	rootElement?: Element
): RefFamilyResult {
	if (!rootElement)
		return { refFamily: undefined, corruptionReason: 'No root element' }

	const match = findAllCustomElementBySelector({
		selector: '[templateUuid]',
		root: rootElement
	}).find((element) => element.getAttribute('templateUuid') === elementId)

	if (!match) return { refFamily: undefined }
	if (
		typeGuard.isPropertyOfObject(
			match.tagName,
			typeElementsStore.mapRefTagNameToRefFamily
		)
	)
		return {
			refFamily: typeElementsStore.mapRefTagNameToRefFamily[match.tagName]
		}

	return { refFamily: undefined }
}

export function getRefFamily(
	typeFamily: AvailableTypeFamily,
	elementId: string,
	rootElement?: Element
): RefFamilyResult {
	return {
		[TYPE_FAMILY.bay]: (): RefFamilyResult => ({ refFamily: undefined }),
		[TYPE_FAMILY.generalEquipment]: (): RefFamilyResult => ({
			refFamily: REF_FAMILY.generalEquipment
		}),
		[TYPE_FAMILY.conductingEquipment]: (): RefFamilyResult => ({
			refFamily: REF_FAMILY.conductingEquipment
		}),
		[TYPE_FAMILY.function]: () =>
			getRefFamilyByChildren(elementId, rootElement),
		[TYPE_FAMILY.lNodeType]: (): RefFamilyResult => ({
			refFamily: REF_FAMILY.lNode
		})
	}[typeFamily]()
}
