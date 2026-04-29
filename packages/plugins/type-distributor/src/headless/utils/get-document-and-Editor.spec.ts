import type { XMLEditor } from '@openscd/oscd-editor'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	getDocument,
	getDocumentAndEditor,
	getEditor
} from './get-document-and-Editor'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null as XMLDocument | null,
		editor: null as unknown
	}
}))

describe('getDocumentAndEditor', () => {
	afterEach(() => {
		pluginGlobalStore.xmlDocument = undefined
		pluginGlobalStore.editor = undefined
	})

	it('GIVEN no xmlDocument WHEN called THEN throws "No XML document loaded"', () => {
		pluginGlobalStore.xmlDocument = undefined
		expect(() => getDocumentAndEditor()).toThrow('No XML document loaded')
	})

	it('GIVEN xmlDocument present but no editor WHEN called THEN throws "No editor available"', () => {
		pluginGlobalStore.xmlDocument = {} as XMLDocument
		pluginGlobalStore.editor = undefined
		expect(() => getDocumentAndEditor()).toThrow('No editor available')
	})

	it('GIVEN both xmlDocument and editor present WHEN called THEN returns doc and editor', () => {
		const mockDoc = {} as XMLDocument
		const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
		pluginGlobalStore.xmlDocument = mockDoc
		pluginGlobalStore.editor = mockEditor

		const result = getDocumentAndEditor()

		expect(result.doc).toBe(mockDoc)
		expect(result.editor).toBe(mockEditor)
	})
})

describe('getDocument', () => {
	afterEach(() => {
		pluginGlobalStore.xmlDocument = undefined
		pluginGlobalStore.editor = undefined
	})

	it('GIVEN no xmlDocument WHEN called THEN throws', () => {
		pluginGlobalStore.xmlDocument = undefined
		expect(() => getDocument()).toThrow('No XML document loaded')
	})

	it('GIVEN both doc and editor present WHEN called THEN returns the document', () => {
		const mockDoc = {} as XMLDocument
		pluginGlobalStore.xmlDocument = mockDoc
		pluginGlobalStore.editor = { commit: vi.fn() } as unknown as XMLEditor

		const result = getDocument()

		expect(result).toBe(mockDoc)
	})
})

describe('getEditor', () => {
	afterEach(() => {
		pluginGlobalStore.xmlDocument = undefined
		pluginGlobalStore.editor = undefined
	})

	it('GIVEN no xmlDocument WHEN called THEN throws', () => {
		pluginGlobalStore.xmlDocument = undefined
		expect(() => getEditor()).toThrow('No XML document loaded')
	})

	it('GIVEN both doc and editor present WHEN called THEN returns the editor', () => {
		const mockEditor = { commit: vi.fn() } as unknown as XMLEditor
		pluginGlobalStore.xmlDocument = {} as XMLDocument
		pluginGlobalStore.editor = mockEditor

		const result = getEditor()

		expect(result).toBe(mockEditor)
	})
})
