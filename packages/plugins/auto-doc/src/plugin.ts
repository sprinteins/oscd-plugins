import { createPluginInstance } from '@oscd-plugins/core'
import Plugin from './plugin.svelte'

export default createPluginInstance({
	pluginType: 'editor',
	isStandAlone: import.meta.env.MODE === 'STAND_ALONE',
	pluginComponent: Plugin
})
