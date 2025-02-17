import type {
	IEC61850_DEFINITIONS,
	AVAILABLE_REVISIONS_PER_EDITIONS
} from './generated/definitions.generated'

export namespace IEC61850 {
	export type AvailableEdition = keyof typeof IEC61850_DEFINITIONS

	export type UnstableRevisions<GenericEdition extends AvailableEdition> =
		(typeof AVAILABLE_REVISIONS_PER_EDITIONS)[GenericEdition]

	export type AvailableUnstableRevision<
		GenericEdition extends AvailableEdition
	> = UnstableRevisions<GenericEdition>[number]

	export type AvailableDefinition<
		GenericUnstableRevision extends
			| AvailableUnstableRevision
			| undefined = undefined
	> = GenericUnstableRevision extends undefined
		? AvailableEdition
		: AvailableUnstableRevision<AvailableEdition>

	export type CurrentStableDefinition<
		GenericEdition extends AvailableEdition
	> = (typeof IEC61850_DEFINITIONS)[GenericEdition]['stable']

	export type CurrentUnstableDefinition<
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			AvailableUnstableRevision<GenericEdition>
	> = (typeof IEC61850_DEFINITIONS)[GenericEdition]['unstable'][GenericUnstableRevision]

	export type CurrentDefinition<
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = GenericUnstableRevision extends undefined
		? CurrentStableDefinition<GenericEdition>
		: CurrentUnstableDefinition<GenericEdition, GenericUnstableRevision>

	// TODO: handle multiple unstable version
	// export type MergedCurrentUnstableDefinitions<
	// 	GenericEdition extends AvailableEdition,
	// 	GenericUnstableRevisions extends UnstableRevisions<GenericEdition>
	// > = GenericUnstableRevisions extends [infer First, ...infer Rest]
	// 	? First extends AvailableUnstableRevision<GenericEdition>
	// 		? Rest extends UnstableRevisions<GenericEdition>
	// 			? CurrentUnstableDefinition<GenericEdition, First> &
	// 					MergedCurrentUnstableDefinitions<GenericEdition, Rest>
	// 			: CurrentUnstableDefinition<GenericEdition, First>
	// 		: never
	// 	: Record<never, never>

	export type AvailableElement<
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = keyof CurrentDefinition<GenericEdition, GenericUnstableRevision>

	export type CurrentElement<
		GenericElement extends AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = CurrentDefinition<
		GenericEdition,
		GenericUnstableRevision
	>[GenericElement]

	export type CurrentElementTag<
		GenericElement extends AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = CurrentElement<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>['tag']

	export type CurrentElementAttributes<
		GenericElement extends AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = CurrentElement<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>['attributes']

	export type CurrentElementAvailableAttributesKey<
		GenericElement extends AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = ExtractKeys<
		CurrentElementAttributes<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>
	>

	export type CurrentElementSubElements<
		GenericElement extends AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = CurrentElement<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>['subElements']

	export type CurrentElementAvailableSubElementsKey<
		GenericElement extends AvailableElement<
			GenericEdition,
			GenericUnstableRevision
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| AvailableUnstableRevision<GenericEdition>
			| undefined = undefined
	> = ExtractKeys<
		CurrentElementSubElements<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>
	>

	export type GeneratedElement<
		GenericElement extends CurrentDefinitionAvailableElement<
			GenericEdition,
			GenericUnstableRevisions
		>,
		GenericEdition extends AvailableEdition,
		GenericUnstableRevision extends
			| UnstableRevision<GenericEdition>
			| undefined = undefined
	> = {
		tag: CurrentElementTag<
			GenericElement,
			GenericEdition,
			GenericUnstableRevision
		>
		anyAllowed: {
			attributes: boolean
			subElements: boolean
		}
		attributes: {
			[key: string]: {
				required: boolean
				types: string[]
			}
		}
		subElements: {
			[key: string]: {
				required: boolean
				array: boolean
			}
		}
	}

	// export type GeneratedDefinition<
	// 	GenericEdition extends AvailableEdition,
	// 	GenericUnstableRevisions extends
	// 		| UnstableRevisions<GenericEdition>
	// 		| undefined = undefined
	// > = {
	// 	[key in CurrentDefinitionAvailableElement<
	// 		GenericEdition,
	// 		GenericUnstableRevisions
	// 	>]: GeneratedElement<key, GenericEdition, GenericUnstableRevisions>
	// }

	//====== HELPERS ======//

	type UnionToIntersection<U> =
		// biome-ignore lint/suspicious/noExplicitAny: this is a generic helper type
		(U extends any ? (k: U) => void : never) extends (k: infer I) => void
			? I
			: never

	export type ExtractKeys<T> = keyof UnionToIntersection<T>
}
