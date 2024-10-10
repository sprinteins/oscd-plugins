import { PluginInstance, devPluginInstance } from '.'
// TYPES
import type { SvelteComponent, ComponentType } from 'svelte'

export function createPluginInstanceClass(
	isStandAlone: boolean,
	pluginComponent: ComponentType<SvelteComponent>
) {
	class PluginClass extends PluginInstance {
		constructor() {
			super(pluginComponent)
		}
	}

	if (isStandAlone) return devPluginInstance(PluginClass)
	return PluginClass
}
