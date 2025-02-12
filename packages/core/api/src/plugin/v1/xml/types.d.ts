import type { IEC61850 } from '@oscd-plugins/core-standard'

export namespace Xml {
	export type SclElement<
		GenericElement extends IEC61850.AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends IEC61850.AvailableEdition,
		GenericUnstableRevision extends
			| IEC61850.AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = Element & {
		tagName: IEC61850.CurrentElementTag<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>
	}

	export type SclCustomElement<TagName> = Element & {
		tagName: TagName
	}

	export type SubElementsToSclElements<
		GenericElement extends IEC61850.AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends IEC61850.AvailableEdition,
		GenericUnstableRevision extends
			| IEC61850.AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = {
		[key in IEC61850.CurrentElementAvailableSubElementsKey<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>]: IEC61850.CurrentElementSubElements<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>[key]['array'] extends boolean
			? Array<SclElement<GenericVersion, key>>
			: SclElement<GenericVersion, key>
	}

	export type CommonOptions = {
		root?: Element
	}
}
