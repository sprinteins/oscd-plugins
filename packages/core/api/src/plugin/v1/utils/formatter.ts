// HELPERS
import { getCurrentElementDefinition } from './helpers'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

export function namedNodeMapAttributesToPlainObject<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	attributes,
	addAttributesFromDefinition
}: {
	attributes: NamedNodeMap
	addAttributesFromDefinition?: {
		element: GenericElement
		currentEdition: GenericEdition
		currentUnstableRevision?: GenericUnstableRevision
	}
}) {
	// init
	const attributesObject = {} as Record<string, string | null>

	if (addAttributesFromDefinition) {
		const CURRENT_ELEMENT_DEFINITION = getCurrentElementDefinition({
			element: addAttributesFromDefinition.element,
			currentEdition: addAttributesFromDefinition.currentEdition,
			currentUnstableRevision:
				addAttributesFromDefinition.currentUnstableRevision
		})

		for (const attribute of Object.keys(
			CURRENT_ELEMENT_DEFINITION.attributes
		)) {
			if (attribute) attributesObject[attribute] = null
		}
	}
	for (const attribute of Array.from(attributes))
		attributesObject[attribute.name] = attribute.value

	return attributesObject as typeof addAttributesFromDefinition extends undefined
		? Record<string, string | null>
		: Record<
				keyof IEC61850.CurrentElementAttributes<
					GenericElement,
					GenericEdition,
					GenericUnstableRevision
				>,
				string | null
			>
}
