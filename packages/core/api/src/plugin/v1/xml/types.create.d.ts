// TYPES
import type { Xml } from './types'
import type { IEC61850 } from '@oscd-plugins/core-standard'

type Attributes = Record<string, string | null>
type Namespace = {
	uri: string
	prefix: string
}

export type CreateStandardElement<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
> = {
	xmlDocument: XMLDocument
	currentEdition: GenericEdition
	currentUnstableRevision?: GenericUnstableRevision
	element: {
		family: GenericElement
		namespace?: Namespace
	}
	attributes?: Attributes
	attributesNS?: {
		namespace: Namespace
		attributes: Attributes
	}[]
	wrapWithPrivateElement?: boolean
}

export type CreateCustomElement = {
	xmlDocument: XMLDocument
	tagName: string
	namespace: Namespace
	attributes?: Attributes
	wrapWithPrivateElement?: boolean
	setAttributesToFirstChild?: boolean
}

export type CheckAttributes<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
> = {
	element: {
		family: GenericElement
		namespace?: Namespace
	}
	currentEdition: GenericEdition
	currentUnstableRevision?: GenericUnstableRevision
	attributes: Attributes
}
