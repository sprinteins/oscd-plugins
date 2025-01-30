import type { IEC61850 } from '@oscd-plugins/core-standard'

export function isCurrentElementKeyOfCurrentDefinition<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>(
	elementName: GenericElement,
	definition: IEC61850.CurrentDefinition<
		GenericEdition,
		GenericUnstableRevision
	>
): elementName is GenericElement & keyof typeof definition {
	return Object.hasOwn(definition, elementName)
}
