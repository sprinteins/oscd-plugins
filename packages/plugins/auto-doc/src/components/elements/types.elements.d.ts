export type ElementType = 'text' | 'image' | 'signalList'

export type BlockElement = {
	id: string
	type: ElementType, 
	content: string
}

export type ElementMap = Record<ElementType,  ComponentType<SvelteComponent>>

