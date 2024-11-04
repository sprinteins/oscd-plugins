// EMULATIONS
import {
	handleOpenDoc,
	handleSaveDoc,
	handleSimpleAction
} from './edition-actions.stand-alone-mode'
// TYPES
import type {
	PluginConstructor,
	EditorPluginInstance,
	PluginType
} from '../types.scd-plugin'

export default function standAloneMode(
	pluginInstance: PluginConstructor,
	pluginType: PluginType
) {
	customElements.define('stand-alone-plugin', pluginInstance)

	//====== INITIALIZATION ======//

	const pluginElement = document.createElement('stand-alone-plugin')
	document.body.appendChild(pluginElement)

	if (pluginType === 'editor')
		emulateOpenSCDInstanceEditionActions(
			pluginElement as EditorPluginInstance
		)
}

//====== EMULATION ======//

function emulateOpenSCDInstanceEditionActions(
	pluginElement: EditorPluginInstance
) {
	document.addEventListener('open-doc', (event) =>
		handleOpenDoc(pluginElement, event as CustomEvent)
	)
	document.addEventListener('save-doc', () => handleSaveDoc(pluginElement))
	// We only handle simple actions for now
	document.addEventListener('editor-action', (event) =>
		handleSimpleAction(pluginElement, event as CustomEvent)
	)
}
