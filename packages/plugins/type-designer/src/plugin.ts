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

if (import.meta.env.MODE === 'NOT_INTEGRATED') {
	customElements.define('type-designer-plugin', NewPlugin)

	// Create an instance of the custom element and add it to the DOM
	const pluginElement = document.createElement('type-designer-plugin')
	document.body.appendChild(pluginElement)
}

// 	customElements.define('type-designer-plugin', NewPlugin)
// 	const pluginElement = document.getElementById('plugin')
// 	const newDoc =
// 	pluginElement.xmlDocument = newDoc
// }
// const target = import.meta.env.DEV ? document.getElementById('plugin') : this.shadowRoot

// const plugin = new Plugin({
// 	target: document.body,
// })
