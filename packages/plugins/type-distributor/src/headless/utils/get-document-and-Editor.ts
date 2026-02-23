import type { XMLEditor } from '@openscd/oscd-editor'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

export function getDocumentAndEditor(): {
	doc: XMLDocument
	editor: XMLEditor
} {
	const doc = pluginGlobalStore.xmlDocument
	if (!doc) {
		throw new Error('No XML document loaded')
	}

	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor available')
	}

	return { doc, editor }
}

export function getDocument(): XMLDocument {
	const { doc } = getDocumentAndEditor()
	if (!doc) {
		throw new Error('No XML document loaded')
	}
	return doc
}

export function getEditor(): XMLEditor {
	const { editor } = getDocumentAndEditor()
	if (!editor) {
		throw new Error('No editor available')
	}
	return editor
}
