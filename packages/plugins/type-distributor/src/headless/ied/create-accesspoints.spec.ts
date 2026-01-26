import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createAccessPoints } from './create-accesspoints'
import type { XMLEditor } from '@openscd/oscd-editor'
import type { Insert } from '@openscd/oscd-api'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))
const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')

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
			createAccessPoints('TestIED', accessPoints)

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const parent = edit.parent as Element

			expect(accessPointElement.tagName).toBe('AccessPoint')
			expect(parent.getAttribute('name')).toBe('TestIED')
		})

		it('should set the name attribute of AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints('TestIED', accessPoints)

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('name')).toBe('AP1')
		})

		it('should set the desc attribute of AccessPoint when description is provided', () => {
			const accessPoints = [
				{ name: 'AP1', description: 'Access Point 1' }
			]
			createAccessPoints('TestIED', accessPoints)

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('desc')).toBe(
				'Access Point 1'
			)
		})

		it('should not set desc attribute when description is not provided', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints('TestIED', accessPoints)

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.hasAttribute('desc')).toBe(false)
		})

		it('should create multiple AccessPoint elements when multiple accessPoints are provided', () => {
			const accessPoints = [{ name: 'AP1' }, { name: 'AP2' }]
			createAccessPoints('TestIED', accessPoints)

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
			createAccessPoints('TestIED', accessPoints)

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element
			const serverElements =
				accessPointElement.getElementsByTagName('Server')

			expect(serverElements.length).toBe(1)
		})

		it('should have an Authentication child element within Server with the attribut none="true"', () => {
			const accessPoints = [{ name: 'AP1' }]
			createAccessPoints('TestIED', accessPoints)

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
				createAccessPoints('TestIED', [{ name: 'AP1' }])
			).toThrow('No XML document found')
		})

		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() =>
				createAccessPoints('TestIED', [{ name: 'AP1' }])
			).toThrow('No editor found')
		})

		it('should throw error when IED with given name is not found', () => {
			expect(() =>
				createAccessPoints('NonExistentIED', [{ name: 'AP1' }])
			).toThrow('IED with name "NonExistentIED" not found')
		})
	})

	describe('edge cases', () => {
		it('should handle empty accessPoints array', () => {
			createAccessPoints('TestIED', [])

			expect(mockEditor.commit).not.toHaveBeenCalled()
		})

		it('should handle special characters in access point name', () => {
			const specialName = 'AP-1_test.abc'
			createAccessPoints('TestIED', [{ name: specialName }])

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('name')).toBe(specialName)
		})

		it('should handle special characters in description', () => {
			const specialDesc = 'Access <>&" Point'
			createAccessPoints('TestIED', [
				{ name: 'AP1', description: specialDesc }
			])

			const edit = mockEditor.commit.mock.calls[0][0] as Insert
			const accessPointElement = edit.node as Element

			expect(accessPointElement.getAttribute('desc')).toBe(specialDesc)
		})
	})
})
