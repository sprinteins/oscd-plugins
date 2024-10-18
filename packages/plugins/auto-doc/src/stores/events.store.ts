// SVELTE
import { get } from 'svelte/store'
// OPENSCD
import { newActionEvent } from '@oscd-plugins/core'
// STORES
import { pluginStore } from './index'

//====== STORES ======//
const { pluginHostElement } = pluginStore

//====== STATE ======//

//====== ACTIONS ======//

function createAndDispatchActionEvent(parent: Element, element: Element) {
	const event = newActionEvent({
		new: {
			parent,
			element
		}
	})

	get(pluginHostElement).dispatchEvent(event)
}

export const eventStore = {
	//actions
	createAndDispatchActionEvent
}
