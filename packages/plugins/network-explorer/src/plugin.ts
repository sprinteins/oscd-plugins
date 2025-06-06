import Plugin from './plugin.svelte'
import * as pkg from "../package.json";

export default class NewPlugin extends HTMLElement {

	private plugin: Plugin
	
	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.plugin = new Plugin({
			target: this.shadowRoot,
			props: {
				doc: this._doc,
				editCount: -1
			}
		});

		const style = document.createElement("style");
        style.innerHTML = globalThis.pluginStyle[pkg.name];
        this.shadowRoot.appendChild(style);
	}

	disconnectedCallback() {
		this.plugin.$destroy()
	}

	private _doc: XMLDocument
	public set doc(newDoc: XMLDocument){
		this._doc = newDoc
		if(!this.plugin) {
			return
		}

		this.plugin.$set({doc: newDoc})
	}

	public set editCount(newCount: number) {
		if (!this.plugin) {
			return
		}
		this.plugin.$set({ editCount: newCount })
	}

}
