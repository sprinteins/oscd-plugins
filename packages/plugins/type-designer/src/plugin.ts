import Plugin from './plugin.svelte'
import { createPluginInstanceClass } from '@oscd-plugins/core'

export default createPluginInstanceClass(
	import.meta.env.MODE === 'STAND_ALONE',
	Plugin
)
