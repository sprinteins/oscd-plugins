export type ElementType = 'text' | 'image' | 'signalList' | 'table' | 'communication'

export type BlockElement = {
	id: string
	type: ElementType
	content: string | unknown
}

export type ElementMap = Record<ElementType, ComponentType<SvelteComponent>>
