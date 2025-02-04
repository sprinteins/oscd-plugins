import { IEC61850_DEFINITIONS } from '@oscd-plugins/core-standard'
// GUARDS
import { isCurrentElementKeyOfCurrentDefinition } from './guards'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

export function getCurrentDefinition<
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	currentEdition,
	currentUnstableRevision
}: {
	currentEdition: GenericEdition
	currentUnstableRevision?: GenericUnstableRevision
}): IEC61850.CurrentDefinition<GenericEdition, GenericUnstableRevision> {
	return currentUnstableRevision
		? (IEC61850_DEFINITIONS[currentEdition].unstable[
				currentUnstableRevision
			] as IEC61850.CurrentDefinition<
				GenericEdition,
				GenericUnstableRevision
			>)
		: (IEC61850_DEFINITIONS[currentEdition]
				.stable as IEC61850.CurrentDefinition<
				GenericEdition,
				GenericUnstableRevision
			>)
}

export function getCurrentElementDefinition<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	element,
	currentEdition,
	currentUnstableRevision
}: {
	element: GenericElement
	currentEdition: GenericEdition
	currentUnstableRevision?: GenericUnstableRevision
}) {
	const CURRENT_DEFINITION = getCurrentDefinition<
		GenericEdition,
		GenericUnstableRevision
	>({
		currentEdition,
		currentUnstableRevision
	})

	if (
		!isCurrentElementKeyOfCurrentDefinition<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>(element, CURRENT_DEFINITION)
	)
		throw new Error('Element is not part of the current definition')

	const CURRENT_DEFINITION_ELEMENT = CURRENT_DEFINITION[
		element
	] as IEC61850.GeneratedElement<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>

	return {
		tag: CURRENT_DEFINITION_ELEMENT.tag,
		anyAllowed: CURRENT_DEFINITION_ELEMENT.anyAllowed,
		attributes: CURRENT_DEFINITION_ELEMENT.attributes,
		subElements: CURRENT_DEFINITION_ELEMENT.subElements
	}
}

// TODO: handle multiple unstable version

// export function flattenUnstableDefinition({
// 	currentEdition,
// 	currentUnstableRevisions
// }: {
// 	currentEdition: IEC61850.AvailableEdition
// 	currentUnstableRevisions: IEC61850.UnstableRevisions<typeof currentEdition>
// }) {
// 	const CURRENT_EDITION_DEFINITION = IEC61850_DEFINITIONS[currentEdition]
// 	let mergedUnstableRevision =
// 		CURRENT_EDITION_DEFINITION.unstable[currentUnstableRevisions[0]]

// 	if (currentUnstableRevisions.length > 1)
// 		for (const revision of currentUnstableRevisions.slice(1)) {
// 			mergedUnstableRevision = deepMerge(
// 				mergedUnstableRevision,
// 				CURRENT_EDITION_DEFINITION.unstable[revision]
// 			)
// 		}

// 	return mergedUnstableRevision
// }

// // biome-ignore lint/suspicious/noExplicitAny: this is a generic helper function
// export function deepMerge(target: any, source: any): any {
// 	for (const key of Object.keys(source)) {
// 		if (source[key] instanceof Object && key in target) {
// 			Object.assign(source[key], deepMerge(target[key], source[key]))
// 		}
// 	}
// 	// Join `target` and modified `source`
// 	Object.assign(target || {}, source)
// 	return target
// }
