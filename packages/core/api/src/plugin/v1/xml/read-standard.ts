import type { Xml } from './types'
import type { IEC61850 } from '@oscd-plugins/core-standard'

export function findOneStandardElementBySelector<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	selector,
	root
}: {
	selector: string
	root: Element
}): Xml.SclElement<
	GenericElement,
	GenericEdition,
	GenericUnstableRevision
> | null {
	return root.querySelector(selector)
}

export function findAllStandardElementsBySelector<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	selector,
	root
}: {
	selector: string
	root: Element
}): Xml.SclElement<GenericElement, GenericEdition, GenericUnstableRevision>[] {
	return Array.from(root.querySelectorAll(selector))
}

export function findAllStandardElementsByTagNameNS<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	namespace,
	tagName,
	root
}: {
	namespace: string
	tagName: string
	root: Element
}) {
	return Array.from(
		root.getElementsByTagNameNS(namespace, tagName)
	) as Xml.SclElement<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>[]
}
