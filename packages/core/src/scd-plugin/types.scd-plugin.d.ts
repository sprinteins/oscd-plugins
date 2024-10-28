export type PluginType = 'editor' | 'menu' | 'validator'

export type PluginConstructor = CustomElementConstructor

export type EditorPluginInstance = HTMLElement & {
	localDoc: XMLDocument | undefined
	localDocName: string | undefined
	pluginInstance: SvelteComponent | null
	get doc(): XMLDocument | undefined
	set doc(newDoc: XMLDocument)
	get docName(): string | undefined
	set docName(newDocName: string)
	connectedCallback(): void
	constructor(): EditorPluginInstance
}

export type MenuPluginInstance = HTMLElement & {
	pluginInstance: SvelteComponent | null
	run(): void
	connectedCallback(): void
	constructor(): MenuPluginInstance
}
