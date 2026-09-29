// TYPES
import type {
	AvailableTypeFamily,
	TypeElement,
	TypeElementByIds,
	TypeRawElement,
	ValidTypeElement
} from '@/headless/stores'
// HELPERS
import { getChildrenOptions } from '@/headless/stores/type-elements/children-options.helper'
import { getRefFamily } from '@/headless/stores/type-elements/ref-family.helper'
import { buildRefs } from '@/headless/stores/type-elements/ref-mapping.helper'
import {
	buildCorruptedTypeElement,
	getLabel,
	getTypeElementAttributes
} from '@/headless/stores/type-elements/type-element-builder.helper'
import { resolveElementIdentity } from '@/headless/stores/type-elements/type-identity.helper'

/**
 * Falls back to a placeholder `CorruptedTypeElement` (no consumer reads its
 * refs/parameters once `corruptionReason` is set) on any known corruption:
 * an existing structural reason short-circuits immediately; otherwise the
 * reference family or refs may report their own; only an unexpected throw
 * from reading attributes/children options (a genuine bug, not an expected
 * validation outcome) is caught.
 */
function buildTypeElement<GenericFamily extends AvailableTypeFamily>(params: {
	family: GenericFamily
	element: TypeRawElement<GenericFamily>
	elementId: string
	originalId: string | null
	structuralCorruptionReason: string | undefined
	rootElement?: Element
}): TypeElement<GenericFamily> {
	if (params.structuralCorruptionReason)
		return buildCorruptedTypeElement({
			family: params.family,
			element: params.element,
			elementId: params.elementId,
			originalId: params.originalId,
			corruptionReason: params.structuralCorruptionReason
		})

	const idForLookups = params.originalId || params.elementId

	let attributes: Record<string, string | null>
	let childrenOptions: ValidTypeElement<GenericFamily>['parameters']['childrenOptions']
	try {
		attributes = getTypeElementAttributes({
			family: params.family,
			attributes: params.element.attributes,
			elementId: idForLookups
		})
		childrenOptions = getChildrenOptions({
			family: params.family,
			element: params.element
		})
	} catch (error) {
		return buildCorruptedTypeElement({
			family: params.family,
			element: params.element,
			elementId: params.elementId,
			originalId: params.originalId,
			corruptionReason:
				error instanceof Error
					? error.message
					: `Unable to read ${params.element.tagName}`
		})
	}

	const refFamilyResult = getRefFamily(
		params.family,
		idForLookups,
		params.rootElement
	)
	const refsResult = buildRefs(params.element, params.rootElement)
	const corruptionReason =
		refFamilyResult.corruptionReason ?? refsResult.corruptionReason

	if (corruptionReason)
		return buildCorruptedTypeElement({
			family: params.family,
			element: params.element,
			elementId: params.elementId,
			originalId: params.originalId,
			corruptionReason
		})

	return {
		element: params.element,
		attributes,
		parameters: {
			label: getLabel(params.element),
			refFamily: refFamilyResult.refFamily,
			childrenOptions
		},
		refs: refsResult.refs
	}
}

export function getAndMapTypeElements<
	GenericFamily extends AvailableTypeFamily
>(params: {
	family: GenericFamily
	typeElements: TypeRawElement<GenericFamily>[] | undefined
	rootElement?: Element
}) {
	return (params.typeElements || []).reduce(
		(acc, element, index) => {
			const { elementId, originalId, corruptionReason } =
				resolveElementIdentity({
					family: params.family,
					element,
					index,
					existingElements: acc
				})

			acc[elementId] = buildTypeElement({
				family: params.family,
				element,
				elementId,
				originalId,
				structuralCorruptionReason: corruptionReason,
				rootElement: params.rootElement
			})

			return acc
		},
		{} as TypeElementByIds<GenericFamily>
	)
}
