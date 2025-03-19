// SVELTE
import { get } from 'svelte/store'
// OPENSCD
// STORES
import { pluginStore } from './index'
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1';

//====== STORES ======//
const { pluginHostElement } = pluginStore

//====== ACTIONS ======//
function createAndDispatchActionEvent(parent: Element, element: Element, reference?: Node | null) {
	reference = reference ?? null;
	
	createAndDispatchEditEvent({
		host: get(pluginHostElement),
		edit: {
			parent: parent, 
			node: element,
			reference: reference
		}
	});
}

function deleteAndDispatchActionEvent(element: Element) {
	createAndDispatchEditEvent({
		host: get(pluginHostElement), 
		edit: {
			node: element
		}	
	})
}

function moveAndDispatchActionEvent(parent: Element, element: Element, reference?: Node | null) {
	reference = reference ?? null;

	createAndDispatchEditEvent({
		host: get(pluginHostElement),
		edit: {
			parent: parent,
			node: element,
			reference: reference
		}
	});
}

function updateAndDispatchActionEvent(element: Element, newAttributes: Record<string, string | null>) {
	createAndDispatchEditEvent({
		host: get(pluginHostElement),
		edit: {
			element: element,
			attributes: newAttributes,
			attributesNS: {}
		}
	});
}

export const eventStore = {
	//actions
	createAndDispatchActionEvent,
	updateAndDispatchActionEvent,
	deleteAndDispatchActionEvent,
	moveAndDispatchActionEvent
}
