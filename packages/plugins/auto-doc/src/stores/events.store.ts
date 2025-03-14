// SVELTE
import { get } from 'svelte/store'
// OPENSCD
import { newActionEvent, createUpdateAction } from '@oscd-plugins/core'
// STORES
import { pluginStore } from './index'

import {
	typeGuard,
	createStandardElement,
	createAndDispatchEditEvent,
	findAllStandardElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'

//====== STORES ======//
const { pluginHostElement } = pluginStore

//====== ACTIONS ======//
function createAndDispatchActionEvent(parent: Element, element: Element, reference?: Node | null) {
	const event = newActionEvent({
		new: {
			parent,
			element,
			reference,
		}
	})

	get(pluginHostElement).dispatchEvent(event)
}

function createMultipleAndDispatchActionEvent(parent: Element, elements: Element[], title: string) {
	const creates = elements.map(element => ({
		new: {
			parent,
			element
		}
	}))

	const event = newActionEvent({
		title,
		actions: creates
	})

	get(pluginHostElement).dispatchEvent(event)
}

function deleteAndDispatchActionEvent(parent: Element, element: Element) {
	const event = newActionEvent({
		old: {
			parent,
			element
		}
	})

	get(pluginHostElement).dispatchEvent(event)
}

function moveAndDispatchActionEvent(oldParent: Element, newParent: Element, element: Element, position: number) {
	const event = newActionEvent({
		old: {
			parent: oldParent,
			element
		},
		new: {
			parent: newParent,
			element,
			position
		}
	})

	get(pluginHostElement).dispatchEvent(event)
}

function updateAndDispatchActionEvent(element: Element, newAttributes: Record<string, string | null>) {
	const updateAction = createUpdateAction(element, newAttributes)
	const event = newActionEvent(updateAction)

	get(pluginHostElement).dispatchEvent(event)
}

export const eventStore = {
	//actions
	createAndDispatchActionEvent,
	createMultipleAndDispatchActionEvent,
	updateAndDispatchActionEvent,
	deleteAndDispatchActionEvent,
	moveAndDispatchActionEvent
}
