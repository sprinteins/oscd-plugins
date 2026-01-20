import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignLNodeToAccessPoint } from './assign-lnode-to-accesspoint'
import type { XMLEditor } from '@openscd/oscd-editor'
import type {
	FunctionTemplate,
	ConductingEquipmentTemplate,
	LNodeTemplate
} from '@/headless/types'
import type { Insert } from '@openscd/oscd-api'

// Mock modules
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

vi.mock('../../stores', () => ({
	bayTypesStore: {
		selectedBayType: 'TestBay'
	},
	ssdImportStore: {
		bayTypes: [],
		lnodeTypes: [],
		loadedSSDDocument: null
	}
}))

vi.mock('../data-types/copy-data-type-templates', () => ({
	copyRelevantDataTypeTemplates: vi.fn()
}))

vi.mock('./add-function-to-bay', () => ({
	addFunctionToBay: vi.fn()
}))

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')
const { ssdImportStore } = await import('../../stores')
const { copyRelevantDataTypeTemplates } = await import(
	'../data-types/copy-data-type-templates'
)
const { addFunctionToBay } = await import('./add-function-to-bay')

describe('assignLNodeToAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document
	let lnodeTemplate: LNodeTemplate

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="TestIED">
					<AccessPoint name="TestAP">
					</AccessPoint>
				</IED>
				<Substation name="TestSubstation">
					<VoltageLevel name="TestVL">
						<Bay name="TestBay">
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

		lnodeTemplate = {
			uuid: 'lnode-uuid',
			lnClass: 'XCBR',
			lnType: 'TestLNType',
			lnInst: '1'
		}

		ssdImportStore.bayTypes = [
			{
				uuid: 'bay-type-uuid',
				name: 'TestBay',
				conductingEquipments: [],
				functions: [
					{
						uuid: 'func-bay-uuid',
						templateUuid: 'func-template-uuid'
					}
				]
			}
		]

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('with Function template', () => {
		let functionTemplate: FunctionTemplate

		beforeEach(() => {
			functionTemplate = {
				uuid: 'func-template-uuid',
				name: 'TestFunction',
				desc: 'Test Function',
				lnodes: [lnodeTemplate]
			}

			// Mock addFunctionToBay to actually add the function to the bay
			vi.mocked(addFunctionToBay).mockImplementation((doc, template) => {
				const bay = doc.querySelector('Bay[name="TestBay"]')
				if (bay) {
					const func = doc.createElement('Function')
					func.setAttribute('name', template.name)
					bay.appendChild(func)
					return {
						parent: bay,
						node: func,
						reference: null
					}
				}
				return null
			})
		})

		it('should create LDevice with function name as inst', () => {
			assignLNodeToAccessPoint(
				functionTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			// Should have one commit call with all edits
			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits, options] = mockEditor.commit.mock.calls[0]
			expect(options.title).toContain('Assign LNode')
			expect(Array.isArray(edits)).toBe(true)

			// Find the LDevice creation edit
			const lDeviceEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LDevice'
			)
			expect(lDeviceEdit).toBeDefined()

			if (!lDeviceEdit) return

			const lDeviceElement = lDeviceEdit.node as Element
			expect(lDeviceElement.getAttribute('inst')).toBe('TestFunction')
		})

		it('should create LN element with correct attributes', () => {
			assignLNodeToAccessPoint(
				functionTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			// Get the commit call
			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits] = mockEditor.commit.mock.calls[0]

			// Find the LN creation edit (not the LNode in Bay)
			const lnEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LN'
			)
			expect(lnEdit).toBeDefined()

			if (!lnEdit) return

			const lnElement = lnEdit.node as Element
			expect(lnElement.getAttribute('lnClass')).toBe('XCBR')
			expect(lnElement.getAttribute('lnType')).toBe('TestLNType')
			expect(lnElement.getAttribute('lnInst')).toBe('1')
		})

		it('should call copyRelevantDataTypeTemplates', () => {
			assignLNodeToAccessPoint(
				functionTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			expect(copyRelevantDataTypeTemplates).toHaveBeenCalledWith(
				lnodeTemplate
			)
		})

		it('should reuse existing LDevice if it exists', () => {
			// Add existing LDevice
			const ied = mockDocument.querySelector('IED[name="TestIED"]')
			const ap = ied?.querySelector('AccessPoint[name="TestAP"]')
			const existingLDevice = mockDocument.createElement('LDevice')
			existingLDevice.setAttribute('inst', 'TestFunction')
			ap?.appendChild(existingLDevice)

			assignLNodeToAccessPoint(
				functionTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			// Should have one commit with edits (but no LDevice creation)
			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits] = mockEditor.commit.mock.calls[0]
			
			// Should not contain LDevice creation edit
			const lDeviceEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LDevice'
			)
			expect(lDeviceEdit).toBeUndefined()
		})

		it('should increment lnInst for multiple LNodes of same class', () => {
			// Add existing LN
			const ied = mockDocument.querySelector('IED[name="TestIED"]')
			const ap = ied?.querySelector('AccessPoint[name="TestAP"]')
			const lDevice = mockDocument.createElement('LDevice')
			lDevice.setAttribute('inst', 'TestFunction')
			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnInst', '1')
			lDevice.appendChild(existingLN)
			ap?.appendChild(lDevice)

			assignLNodeToAccessPoint(
				functionTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits] = mockEditor.commit.mock.calls[0]

			const lnEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LN'
			)
			if (!lnEdit) return

			const lnElement = lnEdit.node as Element
			expect(lnElement.getAttribute('lnInst')).toBe('2')
		})
	})

	describe('with ConductingEquipment template', () => {
		let conductingEquipmentTemplate: ConductingEquipmentTemplate

		beforeEach(() => {
			conductingEquipmentTemplate = {
				uuid: 'ce-uuid',
				name: 'TestCE',
				type: 'CBR',
				terminals: [],
				eqFunctions: [
					{
						uuid: 'eqfunc-uuid',
						name: 'TestEqFunc',
						lnodes: [lnodeTemplate]
					}
				]
			}

			// Add ConductingEquipment to bay
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
			const ce = mockDocument.createElement('ConductingEquipment')
			ce.setAttribute('name', 'TestCE')
			ce.setAttribute('type', 'CBR')
			bay?.appendChild(ce)
		})

		it('should create LDevice with combined equipment and function name', () => {
			assignLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits] = mockEditor.commit.mock.calls[0]
			
			const lDeviceEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LDevice'
			)
			if (!lDeviceEdit) return
			const lDeviceElement = lDeviceEdit.node as Element

			expect(lDeviceElement.getAttribute('inst')).toBe(
				'TestCE_TestEqFunc'
			)
		})

		it('should not call addFunctionToBay for conducting equipment', () => {
			assignLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			// addFunctionToBay should not be called for conducting equipment
			expect(addFunctionToBay).not.toHaveBeenCalled()
		})

		it('should create LNode reference in ConductingEquipment', () => {
			assignLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits] = mockEditor.commit.mock.calls[0]
			
			// Find LNode reference (not LN which goes in LDevice)
			const ce = mockDocument.querySelector(
				'ConductingEquipment[name="TestCE"]'
			)
			const lnodeRefEdit = (edits as Insert[]).find(
				(edit) =>
					(edit.node as Element).tagName === 'LNode' &&
					edit.parent === ce
			)

			expect(lnodeRefEdit).toBeDefined()
		})
	})

	describe('error handling', () => {
		let functionTemplate: FunctionTemplate

		beforeEach(() => {
			functionTemplate = {
				uuid: 'func-template-uuid',
				name: 'TestFunction',
				lnodes: [lnodeTemplate]
			}
		})

		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() =>
				assignLNodeToAccessPoint(
					functionTemplate,
					lnodeTemplate,
					'TestIED',
					'TestAP'
				)
			).toThrow('No XML document loaded')
		})

		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() =>
				assignLNodeToAccessPoint(
					functionTemplate,
					lnodeTemplate,
					'TestIED',
					'TestAP'
				)
			).toThrow('No editor available')
		})

		it('should throw error when AccessPoint not found', () => {
			expect(() =>
				assignLNodeToAccessPoint(
					functionTemplate,
					lnodeTemplate,
					'TestIED',
					'NonExistentAP'
				)
			).toThrow('AccessPoint NonExistentAP not found in IED TestIED')
		})

		it('should throw error when Bay not found', () => {
			// Remove bay from document to test error
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
			bay?.remove()

			// Clear the mock to prevent it from adding the function
			vi.mocked(addFunctionToBay).mockImplementation(() => {
				throw new Error('Bay with name TestBay not found')
			})

			expect(() =>
				assignLNodeToAccessPoint(
					functionTemplate,
					lnodeTemplate,
					'TestIED',
					'TestAP'
				)
			).toThrow('Bay with name TestBay not found')
		})
	})
})
