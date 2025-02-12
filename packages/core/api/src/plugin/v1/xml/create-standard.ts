import { createCustomElement } from './create-custom'
// HELPERS
import { getCurrentElementDefinition } from '@/plugin/v1/utils'
import {
	setElementsAttributes,
	checkIfRequiredAttributesArePresent,
	checkIfAttributesAreAllowed
} from './create-helpers'
// TYPES
import type { Xml } from './types'
import type { IEC61850 } from '@oscd-plugins/core-standard'
import type { CreateStandardElement } from './types.create'

export function createStandardElement<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	xmlDocument,
	element,
	attributes,
	attributesNS,
	currentEdition,
	currentUnstableRevision,
	wrapWithPrivateElement
}: CreateStandardElement<
	GenericElement,
	GenericEdition,
	GenericUnstableRevision
>): Xml.SclElement<
	typeof wrapWithPrivateElement extends true ? 'private' : GenericElement,
	GenericEdition,
	GenericUnstableRevision
> {
	const CURRENT_DEFINITION_ELEMENT = getCurrentElementDefinition({
		element: element.family,
		currentEdition,
		currentUnstableRevision
	})

	let standardElement: Element

	// CREATE ELEMENTS
	if (element.namespace) {
		standardElement = createCustomElement({
			xmlDocument,
			tagName: CURRENT_DEFINITION_ELEMENT.tag as string,
			namespace: element.namespace,
			wrapWithPrivateElement
		})
	} else
		standardElement = xmlDocument.createElement(
			CURRENT_DEFINITION_ELEMENT.tag as string
		)
	// SET ATTRIBUTES
	if (standardElement && attributes && Object.keys(attributes).length) {
		checkIfRequiredAttributesArePresent({
			currentEdition,
			currentUnstableRevision,
			element,
			attributes
		})

		checkIfAttributesAreAllowed({
			currentEdition,
			currentUnstableRevision,
			element,
			attributes
		})

		standardElement = setElementsAttributes({
			element: standardElement,
			attributes,
			setAttributesToFirstChild: wrapWithPrivateElement
		})
	}

	if (standardElement && attributesNS?.length) {
		for (const { namespace, attributes } of attributesNS) {
			// should allow any attributes
			checkIfAttributesAreAllowed({
				currentEdition,
				currentUnstableRevision,
				element,
				attributes
			})

			standardElement = setElementsAttributes({
				element: standardElement,
				attributes,
				namespace,
				setAttributesToFirstChild: wrapWithPrivateElement
			})
		}
	}

	return standardElement as Xml.SclElement<
		typeof wrapWithPrivateElement extends true ? 'private' : GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>
}
