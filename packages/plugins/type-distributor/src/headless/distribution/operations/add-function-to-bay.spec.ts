import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { addFunctionToBay } from './add-function-to-bay'
import type { XMLEditor } from '@openscd/oscd-editor'
import type { FunctionTemplate } from '@/headless/types'

// Mock the stores and pluginGlobalStore
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

vi.mock('../../stores', () => ({
	bayTypesStore: {
		selectedBayType: 'TestBayType'
	},
	ssdImportStore: {
		bayTypes: []
	}
}))

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')
const { bayTypesStore, ssdImportStore } = await import('../../stores')

describe('addFunctionToBay', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document
	let functionTemplate: FunctionTemplate

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="TestSubstation">
					<VoltageLevel name="TestVL">
						<Bay name="TestBay">
							<ConnectivityNode name="CN1" pathName="TestPath"/>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		mockEditor = {
			commit: vi.fn()
		}

		pluginGlobalStore.xmlDocument = mockDocument
		pluginGlobalStore.editor = mockEditor as unknown as XMLEditor

		functionTemplate = {
			uuid: 'func-template-uuid',
			name: 'TestFunction',
			desc: 'Test Function Description',
			lnodes: []
		}

		ssdImportStore.bayTypes = [
			{
				uuid: 'bay-type-uuid',
				name: 'TestBayType',
				desc: 'Test Bay Type',
				conductingEquipments: [],
				functions: [
					{
						uuid: 'func-bay-uuid',
						templateUuid: 'func-template-uuid'
					}
				]
			}
		]
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should create a Function element with correct attributes', () => {
			const edit = addFunctionToBay(mockDocument, functionTemplate, 'TestBay')

			expect(edit).not.toBeNull()
			if (!edit) return

			const functionElement = edit.node as Element

			expect(functionElement.tagName).toBe('Function')
			expect(functionElement.getAttribute('name')).toBe('TestFunction')
			expect(functionElement.getAttribute('desc')).toBe(
				'Test Function Description'
			)
			expect(functionElement.getAttribute('templateUuid')).toBe(
				'func-bay-uuid'
			)
			expect(functionElement.getAttribute('originUuid')).toBe(
				'func-template-uuid'
			)
			expect(functionElement.getAttribute('uuid')).toBeTruthy()
		})

		it('should not set desc attribute when description is not provided', () => {
			const templateWithoutDesc = {
				...functionTemplate,
				desc: undefined
			}

			const edit = addFunctionToBay(mockDocument, templateWithoutDesc, 'TestBay')

			if (!edit) return
			const functionElement = edit.node as Element

			expect(functionElement.hasAttribute('desc')).toBe(false)
		})

		it('should return null when function already exists', () => {
			// Add existing function
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
			const existingFunc = mockDocument.createElement('Function')
			existingFunc.setAttribute('name', 'TestFunction')
			bay?.appendChild(existingFunc)

			const edit = addFunctionToBay(mockDocument, functionTemplate, 'TestBay')

			expect(edit).toBeNull()
		})
	})

	describe('insertion reference', () => {
		it('should insert before ConnectivityNode if it exists', () => {
			const edit = addFunctionToBay(mockDocument, functionTemplate, 'TestBay')

			if (!edit) return
			const bayElement = mockDocument.querySelector('Bay[name="TestBay"]')
			const connectivityNode = bayElement?.querySelector('ConnectivityNode')

			expect(edit.parent).toBe(bayElement)
			expect(edit.reference).toBe(connectivityNode)
		})

		it('should insert with null reference when no ConnectivityNode exists', () => {
			const docWithoutCN = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation name="TestSubstation">
						<VoltageLevel name="TestVL">
							<Bay name="TestBay"></Bay>
						</VoltageLevel>
					</Substation>
				</SCL>`,
				'application/xml'
			)

			const edit = addFunctionToBay(docWithoutCN, functionTemplate, 'TestBay')

			if (!edit) return
			expect(edit.reference).toBeNull()
		})
	})

	describe('error handling', () => {
		it('should throw error when bay not found', () => {
			expect(() =>
				addFunctionToBay(mockDocument, functionTemplate, 'NonExistentBay')
			).toThrow('Bay with name NonExistentBay not found')
		})

		it('should throw error when bay type not found', () => {
			ssdImportStore.bayTypes = []

			expect(() => addFunctionToBay(mockDocument, functionTemplate, 'TestBay')).toThrow(
				'Bay type TestBayType not found'
			)
		})

		it('should throw error when function template not in bay type', () => {
			ssdImportStore.bayTypes = [
				{
					uuid: 'bay-type-uuid',
					name: 'TestBayType',
					desc: 'Test Bay Type',
					conductingEquipments: [],
					functions: []
				}
			]

			expect(() => addFunctionToBay(mockDocument, functionTemplate, 'TestBay')).toThrow(
				'Function template with UUID func-template-uuid not found in bay type TestBayType'
			)
		})
	})

	describe('edge cases', () => {
		it('should handle function with empty name', () => {
			const templateWithEmptyName = {
				...functionTemplate,
				name: ''
			}

			const edit = addFunctionToBay(mockDocument, templateWithEmptyName, 'TestBay')

			if (!edit) return
			const functionElement = edit.node as Element

			expect(functionElement.getAttribute('name')).toBe('')
		})

		it('should handle function with special characters in name', () => {
			const templateWithSpecialChars = {
				...functionTemplate,
				name: 'Test-Function_123.abc'
			}

			const edit = addFunctionToBay(mockDocument, templateWithSpecialChars, 'TestBay')

			if (!edit) return
			const functionElement = edit.node as Element

			expect(functionElement.getAttribute('name')).toBe(
				'Test-Function_123.abc'
			)
		})

		it('should generate unique UUIDs for each function', () => {
			const edit1 = addFunctionToBay(mockDocument, functionTemplate, 'TestBay')
			// Need to reset the document for second call since function will exist
			const mockDocument2 = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation name="TestSubstation">
						<VoltageLevel name="TestVL">
							<Bay name="TestBay">
								<ConnectivityNode name="CN1" pathName="TestPath"/>
							</Bay>
						</VoltageLevel>
					</Substation>
				</SCL>`,
				'application/xml'
			)
			const edit2 = addFunctionToBay(mockDocument2, functionTemplate, 'TestBay')

			if (!edit1 || !edit2) return

			const uuid1 = (edit1.node as Element).getAttribute('uuid')
			const uuid2 = (edit2.node as Element).getAttribute('uuid')

			expect(uuid1).not.toBe(uuid2)
		})
	})
})
