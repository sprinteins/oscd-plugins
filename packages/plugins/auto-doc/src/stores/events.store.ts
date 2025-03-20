// SVELTE
import { get } from 'svelte/store'
// OPENSCD
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1';
// STORES
import { pluginStore } from './index'

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

function createMultipleAndDispatchActionEvent(parent: Element, elements: Element[], title: string) {
	const creates = elements.map(element => ({
		parent,
		node: element,
		reference: null
	}));

	createAndDispatchEditEvent({
		host: get(pluginHostElement),
		edit: creates,
		options: {
			title
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
	createMultipleAndDispatchActionEvent,
	updateAndDispatchActionEvent,
	deleteAndDispatchActionEvent,
	moveAndDispatchActionEvent
}
