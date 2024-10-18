import Plugin from './plugin.svelte'
import { createPluginInstance } from '@oscd-plugins/core'

export default createPluginInstance({
	pluginType: 'editor',
	isStandAlone: import.meta.env.MODE === 'STAND_ALONE',
	pluginComponent: Plugin
})