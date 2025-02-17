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
}
