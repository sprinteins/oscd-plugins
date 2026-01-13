import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { createBasicIEDElement } from './create-basic-ied-element.helper'
import { createAccessPoints } from './create-accesspoints'
import { findSclInsertionReference } from './find-scl-insertion-ref.helper'

export function createSIED(
	name: string,
	description?: string,
	accessPoints?: { name: string; description?: string }[]
): void {
	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}
	if (!pluginGlobalStore.host) {
		throw new Error('No host element found')
	}

	const xmlDocument = pluginGlobalStore.xmlDocument

	const iedElement = createBasicIEDElement(name, xmlDocument, description)
	const sclRoot = xmlDocument.documentElement

	const reference = findSclInsertionReference(sclRoot)

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: iedElement,
			parent: sclRoot,
			reference: reference
		}
	})
	if (accessPoints && accessPoints.length > 0) {
		createAccessPoints(name, accessPoints)
	}
}
