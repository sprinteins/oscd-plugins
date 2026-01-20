import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignEqFunctionLNodeToAccessPoint } from './assign-eqfunction-lnode-to-accesspoint'
import type { XMLEditor } from '@openscd/oscd-editor'
import type { ConductingEquipmentTemplate, LNodeTemplate } from '../../types'
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

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')
const { ssdImportStore } = await import('../../stores')
const { copyRelevantDataTypeTemplates } = await import(
	'../data-types/copy-data-type-templates'
)

describe('assignEqFunctionLNodeToAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document
	let lnodeTemplate: LNodeTemplate
	let conductingEquipmentTemplate: ConductingEquipmentTemplate

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
                            <ConductingEquipment name="ExistingCE" type="CBR"/>
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

		conductingEquipmentTemplate = {
			uuid: 'ce-template-uuid',
			name: 'CircuitBreaker1',
			type: 'CBR',
			desc: 'Test Circuit Breaker',
            terminals: [{
                uuid: "term-uuid",
	            name: "Term1",
	            connectivityNode: "CN1",
	            cNodeName: "TestPath"
            }],
			eqFunctions: [
				{
					uuid: 'eqfunc-bay-uuid',
					name: 'CBFunction',
					desc: 'Circuit Breaker Function',
					lnodes: [lnodeTemplate]
				}
			]
		}

		ssdImportStore.bayTypes = [
			{
				uuid: 'bay-type-uuid',
				name: 'TestBay',
				conductingEquipments: [
					{
						uuid: 'ce-bay-uuid',
						templateUuid: 'ce-template-uuid',
                        virtual: false
					}
				],
				functions: []
			}
		]

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should create ConductingEquipment in Bay', () => {
			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			expect(mockEditor.commit).toHaveBeenCalledTimes(1)
			const [edits] = mockEditor.commit.mock.calls[0]

			// CE edit should exist in edits array
			const ceEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'ConductingEquipment'
			)
			expect(ceEdit).toBeDefined()

			if (!ceEdit) return
			const ceElement = ceEdit.node as Element
			expect(ceElement.getAttribute('name')).toBe('CircuitBreaker1')
			expect(ceElement.getAttribute('type')).toBe('CBR')
		})

		it('should create LDevice with combined equipment and function name', () => {
			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			const [edits] = mockEditor.commit.mock.calls[0]
			const lDeviceEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LDevice'
			)
			expect(lDeviceEdit).toBeDefined()

			if (!lDeviceEdit) return
			const lDeviceElement = lDeviceEdit.node as Element
			expect(lDeviceElement.getAttribute('inst')).toBe('CircuitBreaker1_CBFunction')
		})

		it('should create LN element with correct attributes', () => {
			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			const [edits] = mockEditor.commit.mock.calls[0]
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

		it('should create LNode reference in ConductingEquipment (not in Function)', () => {
			// First, manually add the ConductingEquipment to the Bay so LNode can find its parent
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
            if (!bay) throw new Error('Bay not found in setup')
			const ce = mockDocument.createElement('ConductingEquipment')
			ce.setAttribute('name', 'CircuitBreaker1')
			bay.appendChild(ce)

			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			const [edits] = mockEditor.commit.mock.calls[0]
			const lnodeEdit = (edits as Insert[]).find(
				(edit) => (edit.node as Element).tagName === 'LNode'
			)
			expect(lnodeEdit).toBeDefined()

			if (!lnodeEdit) return
			const lnodeElement = lnodeEdit.node as Element
			expect(lnodeElement.getAttribute('iedName')).toBe('TestIED')
			expect(lnodeElement.getAttribute('ldInst')).toBe('CircuitBreaker1_CBFunction')
			expect(lnodeElement.getAttribute('lnClass')).toBe('XCBR')

			// Check that parent is ConductingEquipment, not Function
			expect(lnodeEdit.parent).toBe(ce)
		})

		it('should call copyRelevantDataTypeTemplates', () => {
			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			expect(copyRelevantDataTypeTemplates).toHaveBeenCalledWith(lnodeTemplate)
		})

		it('should reuse existing ConductingEquipment if it exists', () => {
			// Add existing ConductingEquipment
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
			const existingCE = mockDocument.createElement('ConductingEquipment')
			existingCE.setAttribute('name', 'CircuitBreaker1')
			bay?.appendChild(existingCE)

			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			const [edits] = mockEditor.commit.mock.calls[0]

			// Should not have a ConductingEquipment edit
			const ceEdits = (edits as Insert[]).filter(
				(edit) => (edit.node as Element).tagName === 'ConductingEquipment'
			)
			expect(ceEdits.length).toBe(0)

			// But should have LNode edit referencing the existing CE
			const lnodeEdits = (edits as Insert[]).filter(
				(edit) => (edit.node as Element).tagName === 'LNode'
			)
			expect(lnodeEdits.length).toBe(1)
		})

		it('should reuse existing LDevice if it exists', () => {
			// Add existing LDevice
			const ied = mockDocument.querySelector('IED[name="TestIED"]')
			const ap = ied?.querySelector('AccessPoint[name="TestAP"]')
			const server = mockDocument.createElement('Server')
			ap?.appendChild(server)
			const existingLDevice = mockDocument.createElement('LDevice')
			existingLDevice.setAttribute('inst', 'CircuitBreaker1_CBFunction')
			server.appendChild(existingLDevice)

			// Add ConductingEquipment to bay
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
			const ce = mockDocument.createElement('ConductingEquipment')
			ce.setAttribute('name', 'CircuitBreaker1')
			bay?.appendChild(ce)

			assignEqFunctionLNodeToAccessPoint(
				conductingEquipmentTemplate,
				lnodeTemplate,
				'TestIED',
				'TestAP'
			)

			const [edits] = mockEditor.commit.mock.calls[0]

			// Should not have an LDevice edit
			const lDeviceEdits = (edits as Insert[]).filter(
				(edit) => (edit.node as Element).tagName === 'LDevice'
			)
			expect(lDeviceEdits.length).toBe(0)

			// But should still have LN and LNode edits
			const lnEdits = (edits as Insert[]).filter(
				(edit) => (edit.node as Element).tagName === 'LN'
			)
			expect(lnEdits.length).toBe(1)
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() =>
				assignEqFunctionLNodeToAccessPoint(
					conductingEquipmentTemplate,
					lnodeTemplate,
					'TestIED',
					'TestAP'
				)
			).toThrow('No XML document loaded')
		})

		it('should throw error when editor is not available', () => {
			pluginGlobalStore.editor = undefined

			expect(() =>
				assignEqFunctionLNodeToAccessPoint(
					conductingEquipmentTemplate,
					lnodeTemplate,
					'TestIED',
					'TestAP'
				)
			).toThrow('No editor available')
		})

		it('should throw error when AccessPoint not found', () => {
			expect(() =>
				assignEqFunctionLNodeToAccessPoint(
					conductingEquipmentTemplate,
					lnodeTemplate,
					'TestIED',
					'NonExistentAP'
				)
			).toThrow('AccessPoint NonExistentAP not found')
		})

		it('should throw error when Bay not found', () => {
			// First add CE to allow getting past that step
			const bay = mockDocument.querySelector('Bay[name="TestBay"]')
			const ce = mockDocument.createElement('ConductingEquipment')
			ce.setAttribute('name', 'CircuitBreaker1')
			bay?.appendChild(ce)

			// Remove the bay to trigger error
			bay?.parentElement?.removeChild(bay)

			expect(() =>
				assignEqFunctionLNodeToAccessPoint(
					conductingEquipmentTemplate,
					lnodeTemplate,
					'TestIED',
					'TestAP'
				)
			).toThrow('Bay with name TestBay not found')
		})
	})
})
