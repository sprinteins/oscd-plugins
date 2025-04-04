// TYPES
import type { SvelteComponent, ComponentType } from 'svelte'
import type { PluginConstructor } from './types.scd-plugin'

export default function editorPluginInstance(
	pluginComponent: ComponentType<SvelteComponent>
) {
	//====== INITIALIZATION ======//

	// this emulate the class declaration we need for custom components
	function EditorPlugin() {
		return Reflect.construct(HTMLElement, [], new.target)
	}
	EditorPlugin.prototype = Object.create(HTMLElement.prototype)

	//====== PROPERTIES ======//

	EditorPlugin.prototype.pluginInstance = undefined
	EditorPlugin.prototype.localDoc = undefined
	EditorPlugin.prototype.localDocName = undefined
	EditorPlugin.prototype.localEditCount = -1

	//====== METHODS ======//

	Object.defineProperty(EditorPlugin.prototype, 'doc', {
		get: function doc() {
			return this.localDoc
		},
		set: function doc(newDoc: XMLDocument) {
			this.localDoc = newDoc
			if (!this.pluginInstance) return

			this.pluginInstance.$set({ xmlDocument: newDoc })
		}
	})

	Object.defineProperty(EditorPlugin.prototype, 'docName', {
		get: function docName() {
			return this.localDocName
		},
		set: function docName(newDocName: string) {
			this.localDocName = newDocName
		}
	})

	Object.defineProperty(EditorPlugin.prototype, 'editCount', {
		get: function editCount() {
			return this.localEditCount
		},
		set: function doc(newEditCount: number) {
			this.localEditCount = newEditCount
			if (!this.pluginInstance) return

			this.pluginInstance.$set({ editCount: newEditCount })
		}
	})

	//====== LIFECYCLE METHODS ======//

	EditorPlugin.prototype.connectedCallback = function () {
		this.pluginInstance = new pluginComponent({
			target: this.attachShadow({ mode: 'open' }),
			props: {
				xmlDocument: this.localDoc,
				pluginHostElement: this,
				editCount: this.localEditCount
			}
		})
	}

	//====== RETURN PLUGIN INSTANCE ======//

	return EditorPlugin as unknown as PluginConstructor
}
