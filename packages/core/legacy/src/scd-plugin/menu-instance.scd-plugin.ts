// TYPES
import type { SvelteComponent, ComponentType } from 'svelte'
import type { PluginConstructor } from './types.scd-plugin'

export default function menuPluginInstance(
	pluginComponent: ComponentType<SvelteComponent>
) {
	//====== INITIALIZATION ======//

	// this emulate the class declaration we need for custom components
	function MenuPlugin() {
		return Reflect.construct(HTMLElement, [], new.target)
	}
	MenuPlugin.prototype = Object.create(HTMLElement.prototype)

	//====== PROPERTIES ======//

	MenuPlugin.prototype.pluginInstance = undefined

	//====== METHODS ======//

	MenuPlugin.prototype.run = function () {
		return this.pluginInstance.run()
	}

	//====== LIFECYCLE METHODS ======//

	MenuPlugin.prototype.connectedCallback = function () {
		this.pluginInstance = new pluginComponent({
			target: this.attachShadow({ mode: 'open' })
		})
	}

	//====== RETURN PLUGIN INSTANCE ======//

	return MenuPlugin as unknown as PluginConstructor
}
