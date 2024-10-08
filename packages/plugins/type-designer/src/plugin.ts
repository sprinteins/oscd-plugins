import Plugin from './plugin.svelte'

export default class NewPlugin extends HTMLElement {
	private plugin: Plugin
	private _doc: XMLDocument

	constructor() {
		super()
	}

	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: 'open' })

		this.plugin = new Plugin({
			target: shadowRoot,
			props: {
				xmlDocument:
					this._doc ||
					new DOMParser().parseFromString(
						'<SCL></SCL>',
						'application/xml'
					)
			}
		})
	}

	public set doc(newDoc: XMLDocument) {
		this._doc = newDoc
		if (!this.plugin) return

		this.plugin.$set({ xmlDocument: newDoc })
	}
}

if (import.meta.env.MODE === 'STAND_ALONE') {
	customElements.define('type-designer-plugin', NewPlugin)

	// Create an instance of the custom element and add it to the DOM
	const pluginElement = document.createElement('type-designer-plugin')
	document.body.appendChild(pluginElement)

	// Document events to simulate the OPENSCD instance actions
	//document.addEventListener('oscd-open', this.handleOpenDoc);

}
