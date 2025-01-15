export namespace Common {
	//==== COMMON ANY

	export type AnyElement = {
		tag: string
		attributes: AnyAttributes | Record<never, never>
		subElements:
			| Record<string, AnyElement | AnyElement[]>
			| Record<never, never>
	}
	export type AnyAttributes = {
		[key: string]: string | `${number}` | `${boolean}`
	}

	//==== COMMON & SPECIFIED

	export type Text = AnyElement & {
		tag: 'Text'
		attributes: {
			source?: string
		}
	}

	export type Private = AnyElement & {
		tag: 'Private'
		attributes: {
			type: string
			source?: string
		}
	}

	//==== COMMON BASE

	export type BaseElement = {
		attributes: AnyAttributes
		subElements: Record<string, AnyElement | AnyElement[]> & {
			text?: Text
			private?: Private[]
		}
	}

	export type BaseElementWithDesc = BaseElement & {
		attributes: {
			desc?: string
		}
	}

	export type BaseElementWithId = BaseElementWithDesc & {
		attributes: {
			id: string
		}
	}

	export type BaseElementWithName = BaseElementWithDesc & {
		attributes: {
			name: string
		}
	}
}
