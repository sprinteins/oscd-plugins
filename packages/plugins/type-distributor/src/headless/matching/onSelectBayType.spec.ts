import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { onSelectBayType } from './onSelectBayType'
import type { XMLEditor } from '@openscd/oscd-editor'
import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type { BayType, ConductingEquipmentTemplate, FunctionTemplate } from '@/headless/types'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

// Mock the stores and pluginGlobalStore
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

vi.mock('../stores', () => ({
	bayTypesStore: {
		selectedBayType: null
	},
	ssdImportStore: {
		bayTypes: [],
		getConductingEquipmentTemplate: vi.fn(),
		getFunctionTemplate: vi.fn(),
		loadedSSDDocument: null
	}
}))

vi.mock('../distribution/data-types/copy-data-type-templates', () => ({
	copyRelevantDataTypeTemplates: vi.fn()
}))

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')
const { bayTypesStore, ssdImportStore } = await import('../stores')
const { copyRelevantDataTypeTemplates } = await import(
	'../distribution/data-types/copy-data-type-templates'
)

describe('onSelectBayType', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockSCDDocument: Document
	let mockSSDDocument: Document
	let bayType: BayType
	let ceTemplate1: ConductingEquipmentTemplate
	let ceTemplate2: ConductingEquipmentTemplate
	let functionTemplate: FunctionTemplate

	beforeEach(() => {
		// Create SCD document with a Bay containing ConductingEquipment
		mockSCDDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="TestSubstation">
					<VoltageLevel name="TestVL">
						<Bay name="TestBay">
							<ConductingEquipment name="CB1" type="CBR">
								<Terminal name="T1" connectivityNode="CN1" cNodeName="CN1"/>
							</ConductingEquipment>
							<ConductingEquipment name="DIS1" type="DIS">
								<Terminal name="T1" connectivityNode="CN2" cNodeName="CN2"/>
							</ConductingEquipment>
							<ConductingEquipment name="DIS2" type="DIS">
								<Terminal name="T1" connectivityNode="CN3" cNodeName="CN3"/>
							</ConductingEquipment>
							<ConnectivityNode name="CN1" pathName="Test/CN1"/>
							<ConnectivityNode name="CN2" pathName="Test/CN2"/>
							<ConnectivityNode name="CN3" pathName="Test/CN3"/>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		// Create SSD mock document
		mockSSDDocument = new DOMParser().parseFromString(ssdMockA, 'application/xml')

		mockEditor = {
			commit: vi.fn()
		}

		pluginGlobalStore.xmlDocument = mockSCDDocument
		pluginGlobalStore.editor = mockEditor as unknown as XMLEditor

		// Setup templates
		ceTemplate1 = {
			uuid: 'ce-template-cbr-uuid',
			name: 'Circuit Breaker',
			type: 'CBR',
			desc: 'Test CBR',
			terminals: [],
			eqFunctions: [
				{
					uuid: 'eqfunc-cbr-uuid',
					name: 'CBR_Function',
					desc: 'CBR Function',
					lnodes: [
						{
							uuid: 'lnode-cbr-uuid',
							lnClass: 'XCBR',
							lnType: 'XCBR$184311',
							lnInst: '1'
						}
					]
				}
			]
		}

		ceTemplate2 = {
			uuid: 'ce-template-dis-uuid',
			name: 'Disconnector',
			type: 'DIS',
			desc: 'Test DIS',
			terminals: [],
			eqFunctions: [
				{
					uuid: 'eqfunc-dis-uuid',
					name: 'DIS_Function',
					lnodes: [
						{
							uuid: 'lnode-dis-uuid',
							lnClass: 'XSWI',
							lnType: 'XSWI$5114e81752706b92',
							lnInst: '1'
						}
					]
				}
			]
		}

		functionTemplate = {
			uuid: 'func-template-uuid',
			name: 'Protection',
			desc: 'Protection Function',
			lnodes: [
				{
					uuid: 'lnode-func-uuid',
					lnClass: 'PTOC',
					lnType: 'PTOC$26842',
					lnInst: '1'
				}
			]
		}

		// Setup BayType
		bayType = {
			uuid: 'baytype-uuid',
			name: 'TestBayType',
			desc: 'Test Bay Type',
			conductingEquipments: [
				{
					uuid: 'baytype-ce-cbr-uuid',
					templateUuid: 'ce-template-cbr-uuid',
					virtual: false
				},
				{
					uuid: 'baytype-ce-dis1-uuid',
					templateUuid: 'ce-template-dis-uuid',
					virtual: false
				},
				{
					uuid: 'baytype-ce-dis2-uuid',
					templateUuid: 'ce-template-dis-uuid',
					virtual: false
				}
			],
			functions: [
				{
					uuid: 'baytype-func-uuid',
					templateUuid: 'func-template-uuid'
				}
			]
		}

		// Setup mocks
		bayTypesStore.selectedBayType = 'TestBayType'
		ssdImportStore.bayTypes = [
			bayType,
			{
				uuid: 'template-bay-uuid',
				name: 'TEMPLATE',
				desc: 'Template Bay',
				conductingEquipments: [],
				functions: []
			}
		]
		ssdImportStore.loadedSSDDocument = mockSSDDocument

		// Mock getConductingEquipmentTemplate
		vi.mocked(ssdImportStore.getConductingEquipmentTemplate).mockImplementation(
			(uuid: string) => {
				if (uuid === 'ce-template-cbr-uuid') return ceTemplate1
				if (uuid === 'ce-template-dis-uuid') return ceTemplate2
				return undefined
			}
		)

		// Mock getFunctionTemplate
		vi.mocked(ssdImportStore.getFunctionTemplate).mockImplementation(
			(uuid: string) => {
				if (uuid === 'func-template-uuid') return functionTemplate
				return undefined
			}
		)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('validation', () => {
		it('should throw error if no BayType selected', () => {
			bayTypesStore.selectedBayType = null

			expect(() => onSelectBayType('TestBay')).toThrow('No BayType selected')
		})

		it('should throw error if selected BayType not found', () => {
			bayTypesStore.selectedBayType = 'NonExistentBayType'

			expect(() => onSelectBayType('TestBay')).toThrow(
				'BayType "NonExistentBayType" not found'
			)
		})

		it('should throw error if Bay not found in SCD', () => {
			expect(() => onSelectBayType('NonExistentBay')).toThrow(
				'Bay with name NonExistentBay not found'
			)
		})

		it('should throw error if equipment counts do not match', () => {
			// Modify SCD to have different count
			const bay = mockSCDDocument.querySelector('Bay[name="TestBay"]')
			if (!bay) throw new Error('Bay not found')
			const lastDIS = bay.querySelector('ConductingEquipment[type="DIS"]:last-of-type')
			lastDIS?.parentNode?.removeChild(lastDIS)

			expect(() => onSelectBayType('TestBay')).toThrow(
				/Equipment validation failed/
			)
			expect(() => onSelectBayType('TestBay')).toThrow(
				/DIS.*SCD has 1.*BayType has 2/
			)
		})

		it('should throw error if equipment type is missing in SCD', () => {
			// Add extra equipment type to BayType
			bayType.conductingEquipments.push({
				uuid: 'extra-ce-uuid',
				templateUuid: 'ce-template-ctr-uuid',
				virtual: false
			})

			const ctrTemplate: ConductingEquipmentTemplate = {
				uuid: 'ce-template-ctr-uuid',
				name: 'CT',
				type: 'CTR',
				terminals: [],
				eqFunctions: []
			}

			vi.mocked(ssdImportStore.getConductingEquipmentTemplate).mockImplementation(
				(uuid: string) => {
					if (uuid === 'ce-template-cbr-uuid') return ceTemplate1
					if (uuid === 'ce-template-dis-uuid') return ceTemplate2
					if (uuid === 'ce-template-ctr-uuid') return ctrTemplate
					return undefined
				}
			)

			expect(() => onSelectBayType('TestBay')).toThrow(
				/Equipment validation failed/
			)
			expect(() => onSelectBayType('TestBay')).toThrow(/CTR.*Missing in SCD/)
		})
	})

	describe('sequential matching', () => {
		it('should match equipment in sequential order', () => {
			onSelectBayType('TestBay')

			expect(mockEditor.commit).toHaveBeenCalledOnce()
			const edits = mockEditor.commit.mock.calls[0][0]

			// Find SetAttributes edits for ConductingEquipment
			const ceUpdates = edits.filter(
				(edit: SetAttributes | Insert): edit is SetAttributes =>
					'attributes' in edit && (edit.element as Element).tagName === 'ConductingEquipment'
			)

			expect(ceUpdates).toHaveLength(3)

			// First should be CBR
			const cbrUpdate = ceUpdates.find(
				(e: SetAttributes) => (e.element as Element).getAttribute('type') === 'CBR'
			)
			if (!cbrUpdate) throw new Error('CBR update not found')
			expect(cbrUpdate.attributes?.templateUuid).toBe('baytype-ce-cbr-uuid')
			expect(cbrUpdate.attributes?.originUuid).toBe('ce-template-cbr-uuid')

			// Second and third should be DIS in order
			const disUpdates = ceUpdates.filter(
				(e: SetAttributes) => (e.element as Element).getAttribute('type') === 'DIS'
			)
			expect(disUpdates).toHaveLength(2)
			expect(disUpdates[0].attributes.templateUuid).toBe('baytype-ce-dis1-uuid')
			expect(disUpdates[1].attributes.templateUuid).toBe('baytype-ce-dis2-uuid')
		})
	})

	describe('UUID updates', () => {
		it('should add uuid, templateUuid, and originUuid to each equipment', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const ceUpdates = edits.filter(
				(edit: SetAttributes | Insert): edit is SetAttributes =>
					'attributes' in edit && (edit.element as Element).tagName === 'ConductingEquipment'
			)

			for (const update of ceUpdates) {
				expect(update.attributes.uuid).toBeTruthy()
				expect(update.attributes.uuid).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
				expect(update.attributes.templateUuid).toBeTruthy()
				expect(update.attributes.originUuid).toBeTruthy()
			}
		})

		it('should update Bay element with templateUuid and originUuid', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const bayUpdate = edits.find(
				(edit: SetAttributes | Insert): edit is SetAttributes =>
					'attributes' in edit && (edit.element as Element).tagName === 'Bay'
			)

			expect(bayUpdate).toBeDefined()
			expect(bayUpdate.attributes.uuid).toBeTruthy()
			expect(bayUpdate.attributes.templateUuid).toBe('baytype-uuid')
			expect(bayUpdate.attributes.originUuid).toBe('template-bay-uuid')
		})

		it('should preserve existing Bay uuid if present', () => {
			const bay = mockSCDDocument.querySelector('Bay[name="TestBay"]')
			if (!bay) throw new Error('Bay not found')
			bay.setAttribute('uuid', 'existing-bay-uuid')

			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const bayUpdate = edits.find(
				(edit: SetAttributes | Insert): edit is SetAttributes =>
					'attributes' in edit && (edit.element as Element).tagName === 'Bay'
			)

			expect(bayUpdate.attributes.uuid).toBe('existing-bay-uuid')
		})
	})

	describe('EqFunction creation', () => {
		it('should create EqFunction elements for each equipment', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const eqFunctionInserts = edits.filter(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'EqFunction'
			)

			// 3 equipment * 1 EqFunction each = 3 EqFunctions
			expect(eqFunctionInserts).toHaveLength(3)
		})

		it('should create EqFunction with uuid only (no templateUuid/originUuid)', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const eqFunctionInsert = edits.find(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'EqFunction'
			)

			const eqFunctionElement = eqFunctionInsert.node as Element
			expect(eqFunctionElement.getAttribute('uuid')).toBeTruthy()
			expect(eqFunctionElement.getAttribute('name')).toBeTruthy()
			expect(eqFunctionElement.hasAttribute('templateUuid')).toBe(false)
			expect(eqFunctionElement.hasAttribute('originUuid')).toBe(false)
		})

		it('should copy LNodes from EqFunction template', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const eqFunctionInsert = edits.find(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit &&
					(edit.node as Element).tagName === 'EqFunction' &&
					(edit.node as Element).getAttribute('name') === 'CBR_Function'
			)

			const eqFunctionElement = eqFunctionInsert.node as Element
			const lnodes = eqFunctionElement.querySelectorAll('LNode')

			expect(lnodes).toHaveLength(1)
			expect(lnodes[0].getAttribute('lnClass')).toBe('XCBR')
			expect(lnodes[0].getAttribute('uuid')).toBeTruthy()
			expect(lnodes[0].getAttribute('uuid')).not.toBe('lnode-cbr-uuid') // New UUID
		})

		it('should insert EqFunction before Terminal elements', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const eqFunctionInserts = edits.filter(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'EqFunction'
			)

			for (const insert of eqFunctionInserts) {
				expect(insert.reference?.tagName).toBe('Terminal')
			}
		})

		it('should handle EqFunction with description', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const eqFunctionInsert = edits.find(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit &&
					(edit.node as Element).tagName === 'EqFunction' &&
					(edit.node as Element).getAttribute('name') === 'CBR_Function'
			)

			const eqFunctionElement = eqFunctionInsert.node as Element
			expect(eqFunctionElement.getAttribute('desc')).toBe('CBR Function')
		})
	})

	describe('Function creation', () => {
		it('should create Function elements from BayType', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const functionInserts = edits.filter(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'Function'
			)

			expect(functionInserts).toHaveLength(1)
		})

		it('should create Function with uuid, templateUuid, and originUuid', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const functionInsert = edits.find(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'Function'
			)

			const functionElement = functionInsert.node as Element
			expect(functionElement.getAttribute('uuid')).toBeTruthy()
			expect(functionElement.getAttribute('templateUuid')).toBe(
				'baytype-func-uuid'
			)
			expect(functionElement.getAttribute('originUuid')).toBe(
				'func-template-uuid'
			)
			expect(functionElement.getAttribute('name')).toBe('Protection')
		})

		it('should copy LNodes from Function template', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const functionInsert = edits.find(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'Function'
			)

			const functionElement = functionInsert.node as Element
			const lnodes = functionElement.querySelectorAll('LNode')

			expect(lnodes).toHaveLength(1)
			expect(lnodes[0].getAttribute('lnClass')).toBe('PTOC')
			expect(lnodes[0].getAttribute('uuid')).toBeTruthy()
		})

		it('should insert Function before ConnectivityNode elements', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const functionInsert = edits.find(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'Function'
			)

			expect(functionInsert.reference?.tagName).toBe('ConnectivityNode')
		})

		it('should call copyRelevantDataTypeTemplates for Function LNodes', () => {
			onSelectBayType('TestBay')

			expect(copyRelevantDataTypeTemplates).toHaveBeenCalled()
			// Should be called once for Function LNode + 3 times for EqFunction LNodes
			expect(copyRelevantDataTypeTemplates).toHaveBeenCalledTimes(4)
		})
	})

	describe('atomic commit', () => {
		it('should commit all edits in a single operation', () => {
			onSelectBayType('TestBay')

			expect(mockEditor.commit).toHaveBeenCalledOnce()
		})

		it('should include descriptive title in commit', () => {
			onSelectBayType('TestBay')

			const commitOptions = mockEditor.commit.mock.calls[0][1]
			expect(commitOptions.title).toContain('TestBayType')
			expect(commitOptions.title).toContain('TestBay')
		})

		it('should combine SetAttributes and Insert edits', () => {
			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]

			const setAttributesEdits = edits.filter((edit: SetAttributes | Insert): edit is SetAttributes => 'attributes' in edit)
			const insertEdits = edits.filter((edit: SetAttributes | Insert): edit is Insert => 'node' in edit)

			// Should have both types of edits
			expect(setAttributesEdits.length).toBeGreaterThan(0)
			expect(insertEdits.length).toBeGreaterThan(0)

			// Total: 4 SetAttributes (3 CE + 1 Bay) + 3 EqFunctions + 1 Function = 8
			expect(edits.length).toBe(8)
		})
	})

	describe('edge cases', () => {
		it('should handle Bay with no ConnectivityNode', () => {
			const bay = mockSCDDocument.querySelector('Bay[name="TestBay"]')
			if (!bay) throw new Error('Bay not found')
			const connectivityNodes = bay.querySelectorAll('ConnectivityNode')
			for (const cn of connectivityNodes) {
				cn.parentNode?.removeChild(cn)
			}

			expect(() => onSelectBayType('TestBay')).not.toThrow()
			expect(mockEditor.commit).toHaveBeenCalledOnce()
		})

		it('should handle equipment with no Terminals', () => {
			const bay = mockSCDDocument.querySelector('Bay[name="TestBay"]')
			if (!bay) throw new Error('Bay not found')
			const terminals = bay.querySelectorAll('Terminal')
			for (const t of terminals) {
				t.parentNode?.removeChild(t)
			}

			expect(() => onSelectBayType('TestBay')).not.toThrow()
			expect(mockEditor.commit).toHaveBeenCalledOnce()
		})

		it('should handle BayType with no functions', () => {
			bayType.functions = []

			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const functionInserts = edits.filter(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'Function'
			)

			expect(functionInserts).toHaveLength(0)
		})

		it('should handle equipment with no EqFunctions', () => {
			ceTemplate1.eqFunctions = []
			ceTemplate2.eqFunctions = []

			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const eqFunctionInserts = edits.filter(
				(edit: SetAttributes | Insert): edit is Insert =>
					'node' in edit && (edit.node as Element).tagName === 'EqFunction'
			)

			expect(eqFunctionInserts).toHaveLength(0)
		})

		it('should handle missing TEMPLATE bay gracefully', () => {
			ssdImportStore.bayTypes = [bayType] // Remove TEMPLATE bay

			onSelectBayType('TestBay')

			const edits = mockEditor.commit.mock.calls[0][0]
			const bayUpdate = edits.find(
				(edit: SetAttributes | Insert): edit is SetAttributes =>
					'attributes' in edit && (edit.element as Element).tagName === 'Bay'
			)

			// Should fallback to bayType uuid
			expect(bayUpdate.attributes.originUuid).toBe('baytype-uuid')
		})
	})
})
