// TYPES
import type { SvelteComponent, ComponentType } from 'svelte'

export class PluginInstance extends HTMLElement {
	private localDoc: XMLDocument
	private localDocName: string
	private localShadowRoot: ShadowRoot
	private pluginComponent: ComponentType<SvelteComponent>
	private pluginInstance: SvelteComponent | null

	constructor(pluginComponent: ComponentType<SvelteComponent>) {
		super()
		this.pluginComponent = pluginComponent
		this.localShadowRoot = this.attachShadow({ mode: 'open' })
		this.localDoc = new DOMParser().parseFromString(
			'<SCL></SCL>',
			'application/xml'
		)
		this.pluginInstance = null
		this.localDocName = 'default_file'
	}

	connectedCallback() {
		this.pluginInstance = new this.pluginComponent({
			target: this.localShadowRoot,
			props: {
				xmlDocument: this.localDoc
			}
		})
	}

	public get doc() {
		return this.localDoc
	}
	public set doc(newDoc: XMLDocument) {
		this.localDoc = newDoc
		if (!this.pluginInstance) return

		this.pluginInstance.$set({ xmlDocument: newDoc })
	}

	public get docName() {
		return this.localDocName
	}
	public set docName(newDocName: string) {
		this.localDocName = newDocName
	}
}
