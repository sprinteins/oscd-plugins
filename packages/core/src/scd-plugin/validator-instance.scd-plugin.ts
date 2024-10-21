// TYPES
import type { SvelteComponent, ComponentType } from 'svelte'
import type { PluginConstructor } from './types.scd-plugin'

export default function validatorPluginInstance(
	pluginComponent: ComponentType<SvelteComponent>
) {
	//====== INITIALIZATION ======//

	// this emulate the class declaration we need for custom components
	function ValidatorPlugin(this: typeof validatorPluginInstance) {
		return Reflect.construct(HTMLElement, [], this.constructor)
	}
	ValidatorPlugin.prototype = Object.create(HTMLElement.prototype)

	//====== PROPERTIES ======//

	ValidatorPlugin.prototype.pluginInstance = null

	//====== METHODS ======//

	// TODO

	//====== LIFECYCLE METHODS ======//

	ValidatorPlugin.prototype.connectedCallback = function () {
		this.pluginInstance = new pluginComponent({
			target: this.attachShadow({ mode: 'open' })
		})
	}

	//====== RETURN PLUGIN INSTANCE ======//

	return ValidatorPlugin as unknown as PluginConstructor
}
