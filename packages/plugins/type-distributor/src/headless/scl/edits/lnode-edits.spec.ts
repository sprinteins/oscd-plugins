import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { buildEditsForBayLNode, createMultipleLNodesInAccessPoint } from './lnode-edits'
import { bayStore } from '@/headless/stores'
import type { XMLEditor } from '@openscd/oscd-editor'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { Insert } from '@openscd/oscd-api'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

// ============================================================================
// buildEditsForBayLNode Tests
// ============================================================================

describe('buildEditsForBayLNode', () => {
	let mockDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		// Reset bay store
		bayStore.selectedBay = 'TestBay'
		bayStore.equipmentMatches = []

		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation>
					<VoltageLevel>
						<Bay name="TestBay">
							<Function name="TopLevelFunc">
								<LNode lnType="XSWI_Type1" lnInst="1"/>
							</Function>
							<Function name="TestFunc">
								<LNode lnType="XCBR_Type1" lnInst="1"/>
								<LNode lnType="XCBR_Type1" lnInst="1" iedName="AlreadyAssigned"/>
								<LNode lnType="XSWI_Type1" lnInst="1"/>
								<LNode lnType="CSWI_Type1" lnInst="1"/>
							</Function>
							<ConductingEquipment name="Breaker1">
								<EqFunction name="ProtectionFunc">
									<LNode lnType="XCBR_Type1" lnInst="1"/>
									<LNode lnType="XCBR_Type1" lnInst="2" iedName="ExistingIED"/>
								</EqFunction>
							</ConductingEquipment>
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
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('with equipment UUID', () => {
		it('GIVEN equipment UUID and matching LNode WHEN buildEditsForBayLNode is called THEN should create edit for EqFunction LNode', () => {
			// GIVEN equipment UUID and matching LNode
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
						const breaker = mockDocument.querySelector(
				'ConductingEquipment[name="Breaker1"]'
			)!
			bayStore.equipmentMatches = [
				{
					scdElement: breaker,
					bayTypeEquipment: {
						uuid: 'eq-uuid',
						templateUuid: 'template-uuid',
						virtual: false
					},
					templateEquipment: {
						uuid: 'eq-uuid',
						name: 'Breaker1',
						type: 'CBR',
						terminals: [],
						eqFunctions: []
					}
				}
			]

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'ProtectionFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentUuid: 'eq-uuid'
			})

			// THEN should create edit for EqFunction LNode
			expect(edits).toHaveLength(1)
			expect(edits[0].element.tagName).toBe('LNode')
			expect(edits[0].attributes).toEqual({ iedName: 'IED1' })
			expect(edits[0].element.getAttribute('lnType')).toBe('XCBR_Type1')
			expect(edits[0].element.getAttribute('lnInst')).toBe('1')
		})

		it('GIVEN equipment UUID not in matches WHEN buildEditsForBayLNode is called THEN should return empty array', () => {
			// GIVEN equipment UUID not in matches
			bayStore.equipmentMatches = []

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'ProtectionFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentUuid: 'non-existent-uuid'
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})

	describe('without equipment UUID', () => {
		it('GIVEN no equipment UUID and matching Function LNode WHEN buildEditsForBayLNode is called THEN should create edit for top-level Function', () => {
			// GIVEN no equipment UUID and matching Function LNode
			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TopLevelFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should create edit for top-level Function
			expect(edits).toHaveLength(1)
			expect(edits[0].element.tagName).toBe('LNode')
			expect(edits[0].attributes).toEqual({ iedName: 'IED1' })
			expect(edits[0].element.getAttribute('lnType')).toBe('XSWI_Type1')
		})

		it('GIVEN no equipment UUID and Function not found WHEN buildEditsForBayLNode is called THEN should return empty array', () => {
			// GIVEN no equipment UUID and Function not found
			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'NonExistentFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})

	describe('LNode matching preferences', () => {
		it('GIVEN multiple LNode matches with one unassigned WHEN buildEditsForBayLNode is called THEN should prefer unassigned LNode', () => {
			// GIVEN multiple LNode matches with one unassigned
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnType="XCBR_Type1" lnInst="1" iedName="AlreadyAssigned"/>
							<LNode lnType="XCBR_Type1" lnInst="1"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should prefer unassigned LNode
			expect(edits).toHaveLength(1)
			expect(edits[0].element.getAttribute('iedName')).toBeNull()
		})

		it('GIVEN all LNode matches already assigned WHEN buildEditsForBayLNode is called THEN should return empty array', () => {
			// GIVEN all LNode matches already assigned
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnType="XCBR_Type1" lnInst="1" iedName="IED1"/>
							<LNode lnType="XCBR_Type1" lnInst="1" iedName="IED2"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})

	describe('multiple LNodes', () => {
		it('GIVEN multiple LNodes in template WHEN buildEditsForBayLNode is called THEN should create edit for each unassigned match', () => {
			// GIVEN multiple LNodes in template
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnType="XCBR_Type1" lnInst="1"/>
							<LNode lnType="XSWI_Type1" lnInst="1"/>
							<LNode lnType="CSWI_Type1" lnInst="1"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				},
				{
					lnClass: 'XSWI',
					lnType: 'XSWI_Type1',
					lnInst: '1'
				},
				{
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should create edit for each unassigned match
			expect(edits).toHaveLength(3)
			expect(edits[0].element.getAttribute('lnType')).toBe('XCBR_Type1')
			expect(edits[1].element.getAttribute('lnType')).toBe('XSWI_Type1')
			expect(edits[2].element.getAttribute('lnType')).toBe('CSWI_Type1')
		})

		it('GIVEN some LNodes with no match WHEN buildEditsForBayLNode is called THEN should create edits only for matching LNodes', () => {
			// GIVEN some LNodes with no match
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnType="XCBR_Type1" lnInst="1"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				},
				{
					lnClass: 'XSWI',
					lnType: 'NonExistent_Type',
					lnInst: '99'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should create edits only for matching LNodes
			expect(edits).toHaveLength(1)
			expect(edits[0].element.getAttribute('lnType')).toBe('XCBR_Type1')
		})
	})

	describe('edge cases', () => {
		it('GIVEN empty lNodes array WHEN buildEditsForBayLNode is called THEN should return empty array', () => {
			// GIVEN empty lNodes array
			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: []
			}

			// WHEN buildEditsForBayLNode is called
			const edits = buildEditsForBayLNode({
				lNodes: [],
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})

		it('GIVEN no document loaded WHEN buildEditsForBayLNode is called without equipmentUuid THEN should return empty array', () => {
			// GIVEN no document loaded
			pluginGlobalStore.xmlDocument = undefined
			bayStore.selectedBay = null

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildEditsForBayLNode is called without equipmentUuid
			const edits = buildEditsForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})
})

// ============================================================================
// createMultipleLNodesInAccessPoint Tests
// ============================================================================

describe('createMultipleLNodesInAccessPoint', () => {
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let mockDocument: Document
	let lnodeTemplate: LNodeTemplate
	let functionTemplate: FunctionTemplate
	let equipmentTemplate: ConductingEquipmentTemplate
	let accessPoint: Element

	beforeEach(() => {
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="TestIED">
					<AccessPoint name="TestAP">
					</AccessPoint>
				</IED>
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

		functionTemplate = {
			uuid: 'func-template-uuid',
			name: 'CBFunction',
			desc: 'Circuit Breaker Function',
			lnodes: [lnodeTemplate]
		}

		equipmentTemplate = {
			uuid: 'eq-template-uuid',
			name: 'CircuitBreaker1',
			type: 'CBR',
			desc: 'Test Circuit Breaker',
			terminals: [
				{
					uuid: 'term-uuid',
					name: 'Term1',
					connectivityNode: 'CN1',
					cNodeName: 'TestPath'
				}
			],
			eqFunctions: [functionTemplate]
		}

		accessPoint = mockDocument.querySelector(
			'AccessPoint[name="TestAP"]'
		) as Element

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('with FunctionTemplate', () => {
		it('should create Server element if it does not exist', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Find the Server creation edit
			let serverCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'Server'
				) {
					serverCreated = true
					expect(edit.parent).toBe(accessPoint)
				}
			}
			expect(serverCreated).toBe(true)
		})

		it('should create LDevice with function name', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lDeviceCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LDevice'
				) {
					lDeviceCreated = true
					expect(edit.node.getAttribute('inst')).toBe('CBFunction')
				}
			}
			expect(lDeviceCreated).toBe(true)
		})

		it('should create LN elements for each lNode', () => {
			const lnode2 = {
				...lnodeTemplate,
				uuid: 'lnode2-uuid',
				lnInst: '2'
			}
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2],
				accessPoint
			})

			let lnCount = 0
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnCount++
				}
			}
			expect(lnCount).toBe(2)
		})

		it('should reuse existing Server', () => {
			// Create existing Server
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let serverCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'Server'
				) {
					serverCreated = true
				}
			}
			expect(serverCreated).toBe(false)
		})

		it('should reuse existing LDevice without creating new edit', () => {
			// Create existing Server and LDevice
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const lDevice = mockDocument.createElement('LDevice')
			lDevice.setAttribute('inst', 'CBFunction')
			server.appendChild(lDevice)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Should not create LDevice edit since it already exists
			let lDeviceCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LDevice'
				) {
					lDeviceCreated = true
				}
			}
			expect(lDeviceCreated).toBe(false)

			// Should still create LN edit
			let lnCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnCreated = true
				}
			}
			expect(lnCreated).toBe(true)
		})
	})

	describe('with ConductingEquipmentTemplate', () => {
		it('should create LDevice with equipment name', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lDeviceCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LDevice'
				) {
					lDeviceCreated = true
					expect(edit.node.getAttribute('inst')).toBe(
						'CircuitBreaker1_CBFunction'
					)
				}
			}
			expect(lDeviceCreated).toBe(true)
		})

		it('should create LN elements for equipment lNodes', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: equipmentTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lnCreated = false
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnCreated = true
					expect(edit.node.getAttribute('lnClass')).toBe('XCBR')
					expect(edit.node.getAttribute('lnType')).toBe('TestLNType')
				}
			}
			expect(lnCreated).toBe(true)
		})
	})

	describe('LN element creation', () => {
		it('should create LN with correct attributes', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			let lnElement: Element | null = null
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnElement = edit.node
					break
				}
			}

			expect(lnElement).not.toBeNull()
			expect(lnElement?.getAttribute('lnClass')).toBe('XCBR')
			expect(lnElement?.getAttribute('lnType')).toBe('TestLNType')
			expect(lnElement?.getAttribute('lnInst')).toBe('1')
		})

		it('should create multiple LN elements with unique inst values', () => {
			const lnode2 = {
				...lnodeTemplate,
				uuid: 'lnode2-uuid',
				lnInst: '2'
			}
			const lnode3 = {
				...lnodeTemplate,
				uuid: 'lnode3-uuid',
				lnInst: '3'
			}

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate, lnode2, lnode3],
				accessPoint
			})

			const lnInstances = new Set<string | null>()
			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'LN'
				) {
					lnInstances.add(edit.node.getAttribute('lnInst'))
				}
			}

			expect(lnInstances.size).toBe(3)
			expect(lnInstances.has('1')).toBe(true)
			expect(lnInstances.has('2')).toBe(true)
			expect(lnInstances.has('3')).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should throw error when xmlDocument is not available', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() =>
				createMultipleLNodesInAccessPoint({
					sourceFunction: functionTemplate,
					lNodes: [lnodeTemplate],
					accessPoint
				})
			).toThrow('No XML document found')
		})

		it('should return empty array when lNodes array is empty', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [],
				accessPoint
			})
			// Should return empty array
			expect(edits).toEqual([])
		})

		it('should create lNode even when same lNode exists in another IED', () => {
			// Create existing LNode in another IED
			const otherIED = mockDocument.createElement('IED')
			otherIED.setAttribute('name', 'OtherIED')
			const otherAP = mockDocument.createElement('AccessPoint')
			otherAP.setAttribute('name', 'OtherAP')
			otherIED.appendChild(otherAP)
			const otherServer = mockDocument.createElement('Server')
			otherAP.appendChild(otherServer)
			const otherLDevice = mockDocument.createElement('LDevice')
			otherLDevice.setAttribute('inst', 'TestLD')
			otherServer.appendChild(otherLDevice)
			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnType', 'TestLNType')
			existingLN.setAttribute('lnInst', '1')
			otherLDevice.appendChild(existingLN)
			mockDocument.documentElement.appendChild(otherIED)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Should create edits since lNode uniqueness is scoped to LDevice, not entire document
			expect(edits.length).toBeGreaterThan(0)
			
			// Verify Server, LDevice, and LN are created
			let hasServer = false
			let hasLDevice = false
			let hasLN = false
			for (const edit of edits as Insert[]) {
				if (edit.node instanceof Element) {
					if (edit.node.localName === 'Server') hasServer = true
					if (edit.node.localName === 'LDevice') hasLDevice = true
					if (edit.node.localName === 'LN') hasLN = true
				}
			}
			expect(hasServer).toBe(true)
			expect(hasLDevice).toBe(true)
			expect(hasLN).toBe(true)
		})

		it('should return empty array when all lNodes already exist in same LDevice', () => {
			// Create existing Server and LDevice with the same LNode in target AccessPoint
			const server = mockDocument.createElement('Server')
			const auth = mockDocument.createElement('Authentication')
			auth.setAttribute('none', 'true')
			server.appendChild(auth)
			accessPoint.appendChild(server)

			const lDevice = mockDocument.createElement('LDevice')
			lDevice.setAttribute('inst', 'CBFunction')
			server.appendChild(lDevice)

			const existingLN = mockDocument.createElement('LN')
			existingLN.setAttribute('lnClass', 'XCBR')
			existingLN.setAttribute('lnType', 'TestLNType')
			existingLN.setAttribute('lnInst', '1')
			lDevice.appendChild(existingLN)

			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			// Should return empty array since lNode already exists in the same LDevice
			expect(edits).toEqual([])
		})
	})

	describe('authentication setup', () => {
		it('should create Server with Authentication element set to none=true', () => {
			const edits = createMultipleLNodesInAccessPoint({
				sourceFunction: functionTemplate,
				lNodes: [lnodeTemplate],
				accessPoint
			})

			for (const edit of edits as Insert[]) {
				if (
					edit.node instanceof Element &&
					edit.node.localName === 'Server'
				) {
					const authElement =
						edit.node.querySelector('Authentication')
					expect(authElement).not.toBeNull()
					expect(authElement?.getAttribute('none')).toBe('true')
				}
			}
		})
	})
})
