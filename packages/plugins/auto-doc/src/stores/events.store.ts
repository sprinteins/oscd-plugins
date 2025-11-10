// OPENSCD
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
// STORES
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

//====== ACTIONS ======//
function createAndDispatchActionEvent(
	parent: Element,
	element: Element,
	reference?: Node | null
) {
	reference = reference ?? null

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: {
			parent: parent,
			node: element,
			reference: reference
		}
	})
}

function createMultipleAndDispatchActionEvent(
	parent: Element,
	elements: Element[],
	title: string
) {
	const creates = elements.map((element) => ({
		parent,
		node: element,
		reference: null
	}))

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: creates,
		options: {
			title
		}
	})
}

function deleteAndDispatchActionEvent(element: Element) {
	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: {
			node: element
		}
	})
}

function moveAndDispatchActionEvent(
	parent: Element,
	element: Element,
	reference?: Node | null
) {
	reference = reference ?? null

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: {
			parent: parent,
			node: element,
			reference: reference
		}
	})
}

function updateAndDispatchActionEvent(
	element: Element,
	newAttributes: Record<string, string | null>
) {
	createAndDispatchEditEvent({
		host: pluginGlobalStore.host!,
		edit: {
			element: element,
			attributes: newAttributes,
			attributesNS: {}
		}
	})
}

export const eventStore = {
	//actions
	createAndDispatchActionEvent,
	createMultipleAndDispatchActionEvent,
	updateAndDispatchActionEvent,
	deleteAndDispatchActionEvent,
	moveAndDispatchActionEvent
}
