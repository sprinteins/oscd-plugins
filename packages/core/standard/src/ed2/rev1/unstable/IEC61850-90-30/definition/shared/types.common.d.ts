export namespace Common {
	//==== COMMON ANY

	export type AnyElement = {
		tag: string
		attributes: AnyAttributes
		subElements: Record<string, AnyElement | AnyElement[]>
	}
	export type AnyAttributes = {
		[key: string]: string | `${number}` | `${boolean}`
	}

	//==== COMMON & SPECIFIED

	export type Text = AnyElement & {
		tag: 'Text'
	}

	//==== COMMON BASE

	export type BaseElement = {
		attributes: AnyAttributes
		subElements: Record<string, AnyElement | AnyElement[]> & {
			text?: Text
		}
	}

	export type BaseElementWithDesc = BaseElement & {
		attributes: {
			desc?: string
		}
	}
}
