import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { createBasicIEDElement } from './create-basic-ied-element.helper'
import { createAccessPoints } from './create-accesspoints'
import { queryIEDInsertionReference } from './query-ied-insertion-ref.helper'
import type { Insert } from '@openscd/oscd-api'
import { getDocumentAndEditor } from '../utils'

export function createIED(
	name: string,
	description?: string,
	accessPoints?: { name: string; description?: string }[]
): void {
	const { doc, editor } = getDocumentAndEditor()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement

	const reference = queryIEDInsertionReference(sclRoot)

	const edit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference: reference
	}

	editor.commit(edit, {
		title: `Add SIED ${name}`
	})

	if (accessPoints && accessPoints.length > 0) {
		createAccessPoints(name, accessPoints, true)
	}
}
