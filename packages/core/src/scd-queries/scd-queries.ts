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

	protected searchElementsWithChildren<
		ParentElementGenericType extends SCDBaseElement,
		ChildrenKeyGenericType extends string,
		ChildrenElementGenericType extends SCDBaseElement
	>({
		selector,
		childrenKey,
		attributeList,
		options
	}: {
		selector: string
		childrenKey: ChildrenKeyGenericType
		attributeList: AttributeList<ParentElementGenericType>[]
		options?: CommonOptions
	}): Array<
		ParentElementGenericType & {
			[key in ChildrenKeyGenericType]: ChildrenElementGenericType[]
		}
	> {
		const root = this.determineRoot(options)
		const elements = Array.from(root.querySelectorAll(selector))

		const els = elements.map((el) => ({
			...this.createElement<ParentElementGenericType>(el, attributeList),
			[childrenKey]: Array.from(el.children).map((child) =>
				this.createElement<ChildrenElementGenericType>(child)
			)
		})) as Array<
			ParentElementGenericType & {
				[key in ChildrenKeyGenericType]: ChildrenElementGenericType[]
			}
		>

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
		attributeList?: AttributeList<T>[]
	): T {
		const obj: { [key: string]: unknown } = { element: el }

		if (attributeList) {
			for (const attr of attributeList) {
				const key = attr as string
				obj[key] = el.getAttribute(key) ?? ''
			}
		} else {
			for (const attribute of el.attributes) {
				obj[attribute.name] = attribute.value
			}
		}

		return obj as T
	}
}
