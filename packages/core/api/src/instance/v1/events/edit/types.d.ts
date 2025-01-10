export namespace EditEvent {
	//==== EVENT

	export type Root<
		GenericEditAction extends AvailableAction = AvailableAction
	> = CustomEvent<Detail<GenericEditAction>>

	export type Detail<
		GenericEditAction extends AvailableAction = AvailableAction
	> = {
		edit: GenericEditAction
		title?: string
		squash?: boolean
	}

	export type Options = {
		title?: string
		squash?: boolean
	}

	//==== GUARDS

	/** Intent to change some XMLDocuments */
	export type AvailableAction =
		| Insert
		| SetAttributes
		| SetTextContent
		| Remove
		| AvailableAction[]

	/** Intent to `parent.insertBefore(node, reference)` */
	export type Insert = {
		parent: Node
		node: Node
		reference: Node | null
	}

	/** Intent to remove a `node` from its `ownerDocument` */
	export type Remove = {
		node: Node
	}

	/** Intent to set the `textContent` of `element` */
	export type SetTextContent = {
		element: Element
		textContent: string
	}

	/** Intent to set or remove (if `null`) `attributes`(-`NS`) on `element` */
	export type SetAttributes = {
		element: Element
		attributes: Partial<Record<string, string | null>>
		attributesNS: Partial<
			Record<string, Partial<Record<string, string | null>>>
		>
	}
}
