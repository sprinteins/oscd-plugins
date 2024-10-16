import * as pkg from '../package.json'

import Plugin from './plugin.svelte'

export default class NewPlugin extends HTMLElement {
	private plugin: Plugin

	connectedCallback() {
		this.attachShadow({ mode: 'open' })
		this.plugin = new Plugin({
			target: this.shadowRoot
		})

		const style = document.createElement('style')
		style.innerHTML = globalThis.pluginStyle[pkg.name]
		this.shadowRoot.appendChild(style)
	}

	public run() {
		return this.plugin.run()
	}
}
