import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createIED, createAccessPoints } from './ied-edits'
import type { XMLEditor } from '@openscd/oscd-editor'
import { sclMockA } from '@oscd-plugins/core-api/mocks/v1'
import type { Insert } from '@openscd/oscd-api'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

// Mock the pluginGlobalStore module
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

describe('createIED', () => {
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
			createIED({ name: 'TestIED' })

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.node).toBeInstanceOf(Element)
			const iedElement = edit.node as Element
			expect(iedElement.tagName).toBe('IED')
			expect(iedElement.getAttribute('name')).toBe('TestIED')
		})

		it('should create an IED element with name and description', () => {
			createIED({ name: 'TestIED', description: 'Test Description' })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('name')).toBe('TestIED')
			expect(iedElement.getAttribute('desc')).toBe('Test Description')
		})

		it('should not set desc attribute when description is not provided', () => {
			createIED({ name: 'TestIED' })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.hasAttribute('desc')).toBe(false)
		})
	})

	describe('default attributes', () => {
		it('should set all default SIED attributes', () => {
			createIED({ name: 'TestIED' })

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
			createIED({ name: 'TestIED' })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			const servicesElement = iedElement.querySelector('Services')
			expect(servicesElement).not.toBeNull()
			expect(servicesElement?.getAttribute('nameLength')).toBe('64')
		})

		it('should have Services as direct child of IED', () => {
			createIED({ name: 'TestIED' })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			const children = Array.from(iedElement.children)
			expect(children).toHaveLength(1)
			expect(children[0].tagName).toBe('Services')
		})
	})

	describe('insertion reference', () => {
		it('should insert before DataTypeTemplates if it exists', () => {
			createIED({ name: 'TestIED' })

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

			createIED({ name: 'TestIED' })

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

			createIED({ name: 'TestIED' })

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

			createIED({ name: 'TestIED' })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert

			expect(edit.reference).toBe(dataTypeTemplates)
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() => createIED({ name: 'TestIED' })).toThrow('No XML document loaded')
		})
		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() => createIED({ name: 'TestIED' })).toThrow('No editor available')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string as name', () => {
			createIED({ name: '' })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('name')).toBe('')
		})

		it('should handle special characters in name', () => {
			const specialName = 'Test-IED_123.abc'
			createIED({ name: specialName })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('name')).toBe(specialName)
		})

		it('should handle special characters in description', () => {
			const specialDesc = 'Test <>&" description'
			createIED({ name: 'TestIED', description: specialDesc })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const iedElement = edit.node as Element

			expect(iedElement.getAttribute('desc')).toBe(specialDesc)
		})
	})
})

describe('createAccessPoints', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><IED name="TestIED"></IED></SCL>',
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

	describe('Functionality Tests', () => {
		it('should create an AccessPoint element with correct structure', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const parent = edit.parent as Element

			expect(accessPointElement.tagName).toBe('AccessPoint')
			expect(parent.getAttribute('name')).toBe('TestIED')
		})

		it('should set the name attribute of AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('name')).toBe('AP1')
		})

		it('should set the desc attribute of AccessPoint when description is provided', () => {
			const accessPoints = [
				{ name: 'AP1', description: 'Access Point 1' }
			]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('desc')).toBe(
				'Access Point 1'
			)
		})

		it('should not set desc attribute when description is not provided', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.hasAttribute('desc')).toBe(false)
		})

		it('should create multiple AccessPoint elements when multiple accessPoints are provided', () => {
			const accessPoints = [{ name: 'AP1' }, { name: 'AP2' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			expect(mockEditor.commit).toHaveBeenCalledTimes(2)

			const edit1 = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPoint1 = edit1.node as Element

			const edit2 = mockEditor.commit.mock.calls[1][0] as Insert
			const accessPoint2 = edit2.node as Element

			expect(accessPoint1.getAttribute('name')).toBe('AP1')
			expect(accessPoint2.getAttribute('name')).toBe('AP2')
		})

		it('should have a Server child element within AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const serverElements =
				accessPointElement.getElementsByTagName('Server')

			expect(serverElements.length).toBe(1)
		})

		it('should have an Authentication child element within Server with the attribut none="true"', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints({ iedName: 'TestIED', accessPoints })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const serverElements =
				accessPointElement.getElementsByTagName('Server')
			const authenticationElements =
				serverElements[0].getElementsByTagName('Authentication')

			expect(authenticationElements.length).toBe(1)
			expect(authenticationElements[0].getAttribute('none')).toBe('true')
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() =>
				createAccessPoints({ iedName: 'TestIED', accessPoints: [{ name: 'AP1' }] })
			).toThrow('No XML document loaded')
		})

		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() =>
				createAccessPoints({ iedName: 'TestIED', accessPoints: [{ name: 'AP1' }] })
			).toThrow('No editor available')
		})

		it('should throw error when IED with given name is not found', () => {
			expect(() =>
				createAccessPoints({ iedName: 'NonExistentIED', accessPoints: [{ name: 'AP1' }] })
			).toThrow('IED with name "NonExistentIED" not found')
		})
	})

	describe('edge cases', () => {
		it('should handle empty accessPoints array', () => {
			createAccessPoints({ iedName: 'TestIED', accessPoints: [] })

			expect(mockEditor.commit).not.toHaveBeenCalled()
		})

		it('should handle special characters in access point name', () => {
			const specialName = 'AP-1_test.abc'
			createAccessPoints({ iedName: 'TestIED', accessPoints: [{ name: specialName }] })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('name')).toBe(specialName)
		})

		it('should handle special characters in description', () => {
			const specialDesc = 'Access <>&" Point'
			createAccessPoints({ iedName: 'TestIED', accessPoints: [
				{ name: 'AP1', description: specialDesc }
			] })

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('desc')).toBe(specialDesc)
		})
	})
})
