import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { buildEditsForBayLNode } from './bay-edits'
import { bayStore } from '@/headless/stores'
import type { XMLEditor } from '@openscd/oscd-editor'
import type {
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
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
