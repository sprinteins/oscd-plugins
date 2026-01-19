import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createSIED } from './create-s-ied'
import type { XMLEditor } from '@openscd/oscd-editor'
import { sclMockA } from '@oscd-plugins/core-api/mocks/v1'
import type { Insert } from '@openscd/oscd-api'

// Mock the pluginGlobalStore module
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))
const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')

describe('createSIED', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			sclMockA,
			'application/xml'
		)
		mockEditor = {
			commit: vi.fn()
		}

		pluginGlobalStore.xmlDocument = mockDocument
		pluginGlobalStore.editor = mockEditor as unknown as XMLEditor
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should create an IED element with the given name', () => {
			createSIED('TestIED')

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.node).toBeInstanceOf(Element)
			const iedElement = edit.node as Element
			expect(iedElement.tagName).toBe('IED')
			expect(iedElement.getAttribute('name')).toBe('TestIED')
		})

		it('should create an IED element with name and description', () => {
			createSIED('TestIED', 'Test Description')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('name')).toBe('TestIED')
			expect(iedElement.getAttribute('desc')).toBe('Test Description')
		})

		it('should not set desc attribute when description is not provided', () => {
			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.hasAttribute('desc')).toBe(false)
		})
	})

	describe('default attributes', () => {
		it('should set all default SIED attributes', () => {
			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('configVersion')).toBe('1.0')
			expect(iedElement.getAttribute('engRight')).toBe('full')
			expect(iedElement.getAttribute('manufacturer')).toBe('none')
			expect(iedElement.getAttribute('originalSclRevision')).toBe('B')
			expect(iedElement.getAttribute('originalSclVersion')).toBe('2007')
			expect(iedElement.getAttribute('type')).toBe('none')
		})
	})

	describe('Services element', () => {
		it('should create a Services child element with nameLength attribute', () => {
			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			const servicesElement = iedElement.querySelector('Services')
			expect(servicesElement).not.toBeNull()
			expect(servicesElement?.getAttribute('nameLength')).toBe('64')
		})

		it('should have Services as direct child of IED', () => {
			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			const children = Array.from(iedElement.children)
			expect(children).toHaveLength(1)
			expect(children[0].tagName).toBe('Services')
		})
	})

	describe('insertion reference', () => {
		it('should insert before DataTypeTemplates if it exists', () => {
			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.parent).toBe(mockDocument.documentElement)
			expect(edit.reference?.nodeName).toBe('DataTypeTemplates')
		})

		it('should insert after last IED if DataTypeTemplates does not exist', () => {
			const customDoc = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = customDoc

			const existingIED1 = customDoc.createElement('IED')
			existingIED1.setAttribute('name', 'IED1')
			customDoc.documentElement.appendChild(existingIED1)

			const existingIED2 = customDoc.createElement('IED')
			existingIED2.setAttribute('name', 'IED2')
			customDoc.documentElement.appendChild(existingIED2)

			const someOtherElement = customDoc.createElement('Communication')
			customDoc.documentElement.appendChild(someOtherElement)

			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.parent).toBe(customDoc.documentElement)
			expect(edit.reference).toBe(someOtherElement)
		})

		it('should insert with null reference when no IEDs or DataTypeTemplates exist', () => {
			const customDoc = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = customDoc

			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.parent).toBe(customDoc.documentElement)
			expect(edit.reference).toBeNull()
		})

		it('should prioritize DataTypeTemplates over existing IEDs for insertion reference', () => {
			const customDoc = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = customDoc

			const existingIED = customDoc.createElement('IED')
			existingIED.setAttribute('name', 'ExistingIED')
			customDoc.documentElement.appendChild(existingIED)

			const dataTypeTemplates =
				customDoc.createElement('DataTypeTemplates')
			customDoc.documentElement.appendChild(dataTypeTemplates)

			createSIED('TestIED')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.reference).toBe(dataTypeTemplates)
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() => createSIED('TestIED')).toThrow('No XML document found')
		})
		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() => createSIED('TestIED')).toThrow('No editor found')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string as name', () => {
			createSIED('')

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('name')).toBe('')
		})

		it('should handle special characters in name', () => {
			const specialName = 'Test-IED_123.abc'
			createSIED(specialName)

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('name')).toBe(specialName)
		})

		it('should handle special characters in description', () => {
			const specialDesc = 'Test <>&" description'
			createSIED('TestIED', specialDesc)

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('desc')).toBe(specialDesc)
		})
	})
})
