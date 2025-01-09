export type ElementType = 'text' | 'image' | 'signal-list'

export type BlockElement = {
	id: string
	type: ElementType, 
	content: string
}

export type ElementMap = Record<ElementType,  ComponentType<SvelteComponent>>

