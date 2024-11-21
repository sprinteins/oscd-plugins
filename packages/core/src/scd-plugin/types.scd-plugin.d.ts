export type PluginType = 'editor' | 'menu' | 'validator'

export type PluginCustomComponentsProps = {
	doc: XMLDocument
	docName: string
	editCount: number
	locale: string
}

export type PluginConstructor = CustomElementConstructor

export type EditorPluginInstance = HTMLElement & {
	localDoc: XMLDocument | undefined
	localDocName: string | undefined
	pluginInstance: SvelteComponent | null
	get doc(): XMLDocument | undefined
	set doc(newDoc: XMLDocument)
	get docName(): string | undefined
	set docName(newDocName: string)
	get editCount(): number
	set editCount(newEditCount: number)
	connectedCallback(): void
	constructor(): EditorPluginInstance
}

export type MenuPluginInstance = HTMLElement & {
	pluginInstance: SvelteComponent | null
	run(): void
	connectedCallback(): void
	constructor(): MenuPluginInstance
}
