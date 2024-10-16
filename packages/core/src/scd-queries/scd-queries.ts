// TYPES
import type {
	SCDBaseElement,
	CommonOptions,
	AttributeList,
	Optional
} from './types.scd-queries'

export class SCDQueries {
	constructor(protected readonly root: Element) {}

	//
	// Privates
	//

	protected determineRoot(options?: CommonOptions): Element {
		return options?.root || this.root
	}

	protected searchElements<T extends SCDBaseElement>(
		selector: string,
		attributeList: AttributeList<T>[],
		options?: CommonOptions
	): T[] {
		const root = this.determineRoot(options)
		const elements = Array.from(root.querySelectorAll(selector))
		const els = elements.map((el) =>
			this.createElement<T>(el, attributeList)
		)
		return els
	}

	protected searchSingleElement<T extends SCDBaseElement>(
		selector: string,
		attributeList: AttributeList<T>[],
		options?: CommonOptions
	): T | null {
		const root = this.determineRoot(options)
		const el = root.querySelector(selector)

		if (el === null) return null

		const els = this.createElement<T>(el, attributeList)
		return els
	}

	protected searchElementParent<T extends SCDBaseElement>(
		element: Element,
		parentSelector: string,
		attributeList: AttributeList<T>[]
	): Optional<T> {
		const parentEl = element.closest(parentSelector)
		if (!parentEl) return

		return this.createElement<T>(parentEl, attributeList)
	}

	protected createElement<T extends SCDBaseElement>(
		el: Element,
		attributeList: AttributeList<T>[]
	): T {
		const obj: { [key: string]: unknown } = { element: el }
		for (const attr of attributeList) {
			const key = attr as string
			obj[key] = el.getAttribute(key) ?? ''
		}

		return obj as T
	}
}
