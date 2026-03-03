import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import type { XMLEditor } from '@openscd/oscd-editor'
import { sclMockA } from '@oscd-plugins/core-api/mocks/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { buildEditForCreateIed, buildEditsForCreateIedWithAccessPoints } from './ied-edits'

// Mock the pluginGlobalStore module
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

describe('buildEditForCreateIed', () => {
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
		it('GIVEN a valid name WHEN building the IED edit THEN returns an IED element with that name', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED')

			// THEN
			expect(edit).toBeInstanceOf(Object)
			expect(edit.node).toBeInstanceOf(Element)
			const iedElement = edit.node as Element
			expect(iedElement.tagName).toBe('IED')
			expect(iedElement.getAttribute('name')).toBe('TestIED')
		})

		it('GIVEN a name and description WHEN building the IED edit THEN sets both name and desc attributes', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED', 'Test Description')
			const iedElement = edit.node as Element

			// THEN
			expect(iedElement.getAttribute('name')).toBe('TestIED')
			expect(iedElement.getAttribute('desc')).toBe('Test Description')
		})

		it('GIVEN no description WHEN building the IED edit THEN does not set desc attribute', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED')
			const iedElement = edit.node as Element

			// THEN
			expect(iedElement.hasAttribute('desc')).toBe(false)
		})
	})

	describe('default attributes', () => {
		it('GIVEN any name WHEN building the IED edit THEN sets all default SIED attributes', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED')
			const iedElement = edit.node as Element

			// THEN
			expect(iedElement.getAttribute('configVersion')).toBe('1.0')
			expect(iedElement.getAttribute('engRight')).toBe('full')
			expect(iedElement.getAttribute('manufacturer')).toBe('none')
			expect(iedElement.getAttribute('originalSclRevision')).toBe('B')
			expect(iedElement.getAttribute('originalSclVersion')).toBe('2007')
			expect(iedElement.getAttribute('type')).toBe('none')
		})
	})

	describe('Services element', () => {
		it('GIVEN a valid name WHEN building the IED edit THEN creates Services child with nameLength="64"', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED')
			const iedElement = edit.node as Element

			// THEN
			const servicesElement = iedElement.querySelector('Services')
			expect(servicesElement).not.toBeNull()
			expect(servicesElement?.getAttribute('nameLength')).toBe('64')
		})

		it('GIVEN a valid name WHEN building the IED edit THEN IED has exactly one child element which is Services', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED')
			const iedElement = edit.node as Element

			// THEN
			const children = Array.from(iedElement.children)
			expect(children).toHaveLength(1)
			expect(children[0].tagName).toBe('Services')
		})
	})

	describe('insertion reference', () => {
		it('GIVEN DataTypeTemplates exists in document WHEN building the IED edit THEN reference points to DataTypeTemplates', () => {
			// WHEN
			const edit = buildEditForCreateIed('TestIED')

			// THEN
			expect(edit.parent).toBe(mockDocument.documentElement)
			expect(edit.reference?.nodeName).toBe('DataTypeTemplates')
		})

		it('GIVEN IEDs exist but no DataTypeTemplates WHEN building the IED edit THEN reference points to element after last IED', () => {
			// GIVEN
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

			// WHEN
			const edit = buildEditForCreateIed('TestIED')

			// THEN
			expect(edit.parent).toBe(customDoc.documentElement)
			expect(edit.reference).toBe(someOtherElement)
		})

		it('GIVEN empty SCL document WHEN building the IED edit THEN reference is null', () => {
			// GIVEN
			const customDoc = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = customDoc

			// WHEN
			const edit = buildEditForCreateIed('TestIED')

			// THEN
			expect(edit.parent).toBe(customDoc.documentElement)
			expect(edit.reference).toBeNull()
		})

		it('GIVEN both IEDs and DataTypeTemplates exist WHEN building the IED edit THEN DataTypeTemplates takes priority as reference', () => {
			// GIVEN
			const customDoc = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>',
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = customDoc

			const existingIED = customDoc.createElement('IED')
			existingIED.setAttribute('name', 'ExistingIED')
			customDoc.documentElement.appendChild(existingIED)

			const dataTypeTemplates = customDoc.createElement('DataTypeTemplates')
			customDoc.documentElement.appendChild(dataTypeTemplates)

			// WHEN
			const edit = buildEditForCreateIed('TestIED')

			// THEN
			expect(edit.reference).toBe(dataTypeTemplates)
		})
	})

	describe('error handling', () => {
		it('GIVEN xmlDocument is not available WHEN building the IED edit THEN throws "No XML document loaded"', () => {
			// GIVEN
			pluginGlobalStore.xmlDocument = undefined

			// WHEN / THEN
			expect(() => buildEditForCreateIed('TestIED')).toThrow(
				'No XML document loaded'
			)
		})

		it('GIVEN editor is not available WHEN building the IED edit THEN throws "No editor available"', () => {
			// GIVEN
			pluginGlobalStore.editor = undefined

			// WHEN / THEN
			expect(() => buildEditForCreateIed('TestIED')).toThrow(
				'No editor available'
			)
		})
	})

	describe('edge cases', () => {
		it('GIVEN an empty string as name WHEN building the IED edit THEN sets name attribute to empty string', () => {
			// WHEN
			const edit = buildEditForCreateIed('')
			const iedElement = edit.node as Element

			// THEN
			expect(iedElement.getAttribute('name')).toBe('')
		})

		it('GIVEN special characters in name WHEN building the IED edit THEN preserves them in name attribute', () => {
			// GIVEN
			const specialName = 'Test-IED_123.abc'

			// WHEN
			const edit = buildEditForCreateIed(specialName)
			const iedElement = edit.node as Element

			// THEN
			expect(iedElement.getAttribute('name')).toBe(specialName)
		})

		it('GIVEN special characters in description WHEN building the IED edit THEN preserves them in desc attribute', () => {
			// GIVEN
			const specialDesc = 'Test <>&" description'

			// WHEN
			const edit = buildEditForCreateIed('TestIED', specialDesc)
			const iedElement = edit.node as Element

			// THEN
			expect(iedElement.getAttribute('desc')).toBe(specialDesc)
		})
	})
})

describe('buildEditsForCreateIedWithAccessPoints', () => {
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

	describe('returned array structure', () => {
		it('GIVEN a name and access points WHEN building edits THEN IED edit is the first element in the array', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			expect(edits[0].node).toBeInstanceOf(Element)
			expect((edits[0].node as Element).tagName).toBe('IED')
			expect((edits[0].node as Element).getAttribute('name')).toBe('TestIED')
		})

		it('GIVEN one access point WHEN building edits THEN returns 2 edits', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			expect(edits).toHaveLength(2)
		})

		it('GIVEN three access points WHEN building edits THEN returns 4 edits', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [
					{ name: 'AP1' },
					{ name: 'AP2' },
					{ name: 'AP3' }
				]
			})

			// THEN
			expect(edits).toHaveLength(4)
		})

		it('GIVEN empty accessPoints WHEN building edits THEN returns only the IED edit', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: []
			})

			// THEN
			expect(edits).toHaveLength(1)
			expect((edits[0].node as Element).tagName).toBe('IED')
		})
	})

	describe('IED edit', () => {
		it('GIVEN a name and description WHEN building edits THEN IED element has both name and desc attributes', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				description: 'My IED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			const iedElement = edits[0].node as Element
			expect(iedElement.getAttribute('name')).toBe('TestIED')
			expect(iedElement.getAttribute('desc')).toBe('My IED')
		})

		it('GIVEN no description WHEN building edits THEN IED element does not have desc attribute', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			const iedElement = edits[0].node as Element
			expect(iedElement.hasAttribute('desc')).toBe(false)
		})

		it('GIVEN a valid document WHEN building edits THEN IED edit parent is the SCL root', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			expect(edits[0].parent).toBe(mockDocument.documentElement)
		})

		it('GIVEN DataTypeTemplates exists in document WHEN building edits THEN IED edit reference points to DataTypeTemplates', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			expect(edits[0].reference?.nodeName).toBe('DataTypeTemplates')
		})
	})

	describe('AccessPoint edits', () => {
		it('GIVEN one access point WHEN building edits THEN AP edit has correct name attribute', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			const apElement = edits[1].node as Element
			expect(apElement.tagName).toBe('AccessPoint')
			expect(apElement.getAttribute('name')).toBe('AP1')
		})

		it('GIVEN an access point with description WHEN building edits THEN sets desc attribute on AP element', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1', description: 'First AP' }]
			})

			// THEN
			const apElement = edits[1].node as Element
			expect(apElement.getAttribute('desc')).toBe('First AP')
		})

		it('GIVEN an access point without description WHEN building edits THEN desc attribute is null on AP element', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			const apElement = edits[1].node as Element
			expect(apElement.getAttribute('desc')).toBeNull()
		})

		it('GIVEN multiple access points WHEN building edits THEN all AP edits use the IED element as parent', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }, { name: 'AP2' }]
			})

			// THEN
			const iedNode = edits[0].node
			expect(edits[1].parent).toBe(iedNode)
			expect(edits[2].parent).toBe(iedNode)
		})

		it('GIVEN multiple access points WHEN building edits THEN all AP edits have null reference', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }, { name: 'AP2' }]
			})

			// THEN
			expect(edits[1].reference).toBeNull()
			expect(edits[2].reference).toBeNull()
		})

		it('GIVEN one access point WHEN building edits THEN AP element contains a Server child', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			const apElement = edits[1].node as Element
			const server = apElement.querySelector('Server')
			expect(server).not.toBeNull()
		})

		it('GIVEN one access point WHEN building edits THEN Server contains Authentication with none="true"', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }]
			})

			// THEN
			const apElement = edits[1].node as Element
			const auth = apElement.querySelector('Server > Authentication')
			expect(auth).not.toBeNull()
			expect(auth?.getAttribute('none')).toBe('true')
		})

		it('GIVEN three access points WHEN building edits THEN AP edits preserve input order', () => {
			// WHEN
			const edits = buildEditsForCreateIedWithAccessPoints({
				name: 'TestIED',
				accessPoints: [{ name: 'AP1' }, { name: 'AP2' }, { name: 'AP3' }]
			})

			// THEN
			expect((edits[1].node as Element).getAttribute('name')).toBe('AP1')
			expect((edits[2].node as Element).getAttribute('name')).toBe('AP2')
			expect((edits[3].node as Element).getAttribute('name')).toBe('AP3')
		})
	})

	describe('error handling', () => {
		it('GIVEN xmlDocument is not available WHEN building edits THEN throws "No XML document loaded"', () => {
			// GIVEN
			pluginGlobalStore.xmlDocument = undefined

			// WHEN / THEN
			expect(() =>
				buildEditsForCreateIedWithAccessPoints({
					name: 'TestIED',
					accessPoints: [{ name: 'AP1' }]
				})
			).toThrow('No XML document loaded')
		})

		it('GIVEN editor is not available WHEN building edits THEN throws "No editor available"', () => {
			// GIVEN
			pluginGlobalStore.editor = undefined

			// WHEN / THEN
			expect(() =>
				buildEditsForCreateIedWithAccessPoints({
					name: 'TestIED',
					accessPoints: [{ name: 'AP1' }]
				})
			).toThrow('No editor available')
		})
	})
})
