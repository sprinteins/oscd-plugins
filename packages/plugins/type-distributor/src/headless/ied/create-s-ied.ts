import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { createBasicIEDElement } from './create-basic-ied-element.helper'
import { createAccessPoints } from './create-accesspoints'
import { findSclInsertionReference } from './find-scl-insertion-ref.helper'
import type { Insert } from '@openscd/oscd-api'

export function createSIED(
	name: string,
	description?: string,
	accessPoints?: { name: string; description?: string }[]
): void {
	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}
	const xmlDocument = pluginGlobalStore.xmlDocument

	const iedElement = createBasicIEDElement(name, xmlDocument, description)
	const sclRoot = xmlDocument.documentElement

	const reference = findSclInsertionReference(sclRoot)

	const edit: Insert = {
			node: iedElement,
			parent: sclRoot,
			reference: reference
		}
	
	editor.commit(edit, {
		title: `Add SIED ${name}`,
	})
	
	if (accessPoints && accessPoints.length > 0) {
		createAccessPoints(name, accessPoints, true)
	}
}
