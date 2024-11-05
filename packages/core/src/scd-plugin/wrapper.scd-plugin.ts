import editorPluginInstance from './editor-instance.scd-plugin'
import menuPluginInstance from './menu-instance.scd-plugin'
import validatorPluginInstance from './validator-instance.scd-plugin'
import standAloneMode from './stand-alone-mode'
// TYPES
import type { SvelteComponent, ComponentType } from 'svelte'
import type { PluginType } from './types.scd-plugin'

export function createPluginInstance({
	pluginType,
	isStandAlone,
	pluginComponent
}: {
	pluginType: PluginType
	isStandAlone: boolean
	pluginComponent: ComponentType<SvelteComponent>
	// biome-ignore lint/suspicious/noConfusingVoidType: in stand alone mode the function does not return anything
}): void | CustomElementConstructor {
	const pluginInstances = {
		editor: editorPluginInstance(pluginComponent),
		menu: menuPluginInstance(pluginComponent),
		validator: validatorPluginInstance(pluginComponent) // TODO
	}

	if (isStandAlone)
		return standAloneMode(pluginInstances[pluginType], pluginType)
	return pluginInstances[pluginType]
}
