import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignedLNodesStore } from './assigned-lnodes.store.svelte'
import type { LNodeTemplate } from '@/headless/common-types'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { bayStore } from '../bay.store.svelte'

// Mock pluginGlobalStore
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null
	}
}))

// Mock ssdImportStore
vi.mock('../ssd-import.store.svelte', () => ({
	ssdImportStore: {
		getConductingEquipmentTemplate: vi.fn((templateUuid: string) => {
			if (templateUuid === 'template-ce-1') {
				return {
					uuid: templateUuid,
					name: 'CB1 Template',
					type: 'CBR',
					terminals: [],
					eqFunctions: [
						{
							uuid: 'eq-func-template-control',
							name: 'Control',
							lnodes: []
						}
					]
				}
			}

			return undefined
		}),
		bayTypes: [
			{
				uuid: 'baytype-uuid-1',
				name: 'TestBayType',
				conductingEquipments: [
					{
						uuid: 'eq-uuid-1',
						templateUuid: 'template-ce-1',
						virtual: false
					}
				]
			}
		]
	}
}))

// Mock bayStore
vi.mock('../bay.store.svelte', () => ({
	bayStore: {
		scdBay: null,
		equipmentMatches: []
	}
}))

describe('assignedLNodesStore', () => {
	let mockDocument: Document
	const funcUuid1 = 'func-uuid-1'
	const funcUuid2 = 'func-uuid-2'
	const eqUuid1 = 'eq-uuid-1'

	beforeEach(() => {
		// Create a mock SCD document with Bay structures containing LNodes
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="Sub1">
					<VoltageLevel name="VL1">
						<Bay name="Bay1">
							<Function name="ProtectionFunc" templateUuid="${funcUuid1}">
								<LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1" ldInst="LD1" />
								<LNode lnClass="CSWI" lnType="TestCSWI" lnInst="1" iedName="IED1" ldInst="LD1" />
								<LNode lnClass="LLN0" lnType="TestLLN0" iedName="IED1" ldInst="LD1" />
							</Function>
							<Function name="ControlFunc" templateUuid="${funcUuid2}">
								<LNode lnClass="MMXU" lnType="TestMMXU" lnInst="1" iedName="IED2" ldInst="LD2" />
								<LNode lnClass="PDIS" lnType="TestPDIS" lnInst="1" />
							</Function>
							<ConductingEquipment name="CB1" type="CBR" templateUuid="${eqUuid1}">
								<EqFunction name="Control">
									<LNode lnClass="PTRC" lnType="TestPTRC" lnInst="1" iedName="IED1" ldInst="LD1" />
								</EqFunction>
							</ConductingEquipment>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		pluginGlobalStore.xmlDocument = mockDocument

		// Set up bayStore.scdBay to point to the Bay element in the mock document
		const bayElement = mockDocument.querySelector('Bay')
		bayStore.scdBay = bayElement as Element

		const equipmentElement = mockDocument.querySelector(
			'ConductingEquipment'
		)
		bayStore.equipmentMatches = equipmentElement
			? [
					{
						scdElement: equipmentElement,
						bayTypeEquipment: {
							uuid: eqUuid1,
							templateUuid: 'template-ce-1',
							virtual: false
						},
						templateEquipment: {
							uuid: 'template-ce-1',
							name: 'CB1 Template',
							type: 'CBR',
							terminals: [],
							eqFunctions: [
								{
									uuid: 'eq-func-template-control',
									name: 'Control',
									lnodes: []
								}
							]
						}
					}
				]
			: []
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('rebuild', () => {
		it('should build index of all assigned LNodes in Bay structures', () => {
			assignedLNodesStore.rebuild()

			// Check Function LNodes with iedName are marked as assigned
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'CSWI',
						lnType: 'TestCSWI',
						lnInst: '1'
					}
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid2,
					lnode: {
						lnClass: 'MMXU',
						lnType: 'TestMMXU',
						lnInst: '1'
					}
				})
			).toBe(true)

			// Check EqFunction LNode with iedName
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: eqUuid1,
					lnode: {
						lnClass: 'PTRC',
						lnType: 'TestPTRC',
						lnInst: '1'
					},
					functionScopeUuid: 'eq-func-template-control'
				})
			).toBe(true)
		})

		it('should not mark LNodes without iedName attribute as assigned', () => {
			assignedLNodesStore.rebuild()

			// PDIS LNode doesn't have iedName attribute
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid2,
					lnode: {
						lnClass: 'PDIS',
						lnType: 'TestPDIS',
						lnInst: '1'
					}
				})
			).toBe(false)
		})

		it('should not mark non-existent LNodes as assigned', () => {
			assignedLNodesStore.rebuild()

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'RDIR',
						lnType: 'TestRDIR',
						lnInst: '1'
					}
				})
			).toBe(false)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'DifferentType',
						lnInst: '1'
					}
				})
			).toBe(false)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '2'
					}
				})
			).toBe(false)
		})

		it('should clear index when document is null', () => {
			assignedLNodesStore.rebuild()

			// Verify some LNodes are assigned
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(true)

			// Set document to null and clear bayStore.scdBay
			pluginGlobalStore.xmlDocument = undefined
			bayStore.scdBay = null
			assignedLNodesStore.rebuild()

			// Verify index is cleared
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(false)
		})

		it('should handle empty document', () => {
			const emptyDoc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = emptyDoc
			bayStore.scdBay = null

			assignedLNodesStore.rebuild()

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(false)
		})

		it('should handle LNodes with missing attributes', () => {
			const docWithMissingAttrs = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation name="Sub1">
						<VoltageLevel name="VL1">
							<Bay name="Bay1">
								<Function name="TestFunc" templateUuid="${funcUuid1}">
									<LNode lnClass="XCBR" lnType="TestXCBR" iedName="IED1" />
									<LNode lnClass="CSWI" lnInst="1" iedName="IED1" />
									<LNode lnType="TestMMXU" lnInst="1" iedName="IED1" />
								</Function>
							</Bay>
						</VoltageLevel>
					</Substation>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = docWithMissingAttrs
			const bayElement = docWithMissingAttrs.querySelector('Bay')
			bayStore.scdBay = bayElement as Element

			// Should not throw error
			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			// LNodes with missing lnClass or lnType should not be indexed
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(false)
		})

		it('should skip Functions without templateUuid', () => {
			const docWithoutUuid = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation name="Sub1">
						<VoltageLevel name="VL1">
							<Bay name="Bay1">
								<Function name="NoUuidFunc">
									<LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1" />
								</Function>
							</Bay>
						</VoltageLevel>
					</Substation>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = docWithoutUuid
			const bayElement = docWithoutUuid.querySelector('Bay')
			bayStore.scdBay = bayElement as Element

			const consoleSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {})

			assignedLNodesStore.rebuild()

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					'Function "NoUuidFunc" has no templateUuid'
				)
			)

			consoleSpy.mockRestore()
		})
	})

	describe('markAsAssigned', () => {
		it('should add single LNode to index', () => {
			assignedLNodesStore.rebuild()

			const newLNode: LNodeTemplate = {
				lnClass: 'RDIR',
				lnType: 'TestRDIR',
				lnInst: '1'
			}

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: newLNode
				})
			).toBe(false)

			assignedLNodesStore.markAsAssigned({
				parentUuid: funcUuid1,
				lNodes: [newLNode]
			})

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: newLNode
				})
			).toBe(true)
		})

		it('should add multiple LNodes to index', () => {
			assignedLNodesStore.rebuild()

			const newLNodes: LNodeTemplate[] = [
				{ lnClass: 'RDIR', lnType: 'TestRDIR', lnInst: '1' },
				{ lnClass: 'PSCH', lnType: 'TestPSCH', lnInst: '1' },
				{ lnClass: 'RSYN', lnType: 'TestRSYN', lnInst: '1' }
			]

			for (const lnode of newLNodes) {
				expect(
					assignedLNodesStore.isAssigned({
						parentUuid: funcUuid1,
						lnode
					})
				).toBe(false)
			}

			assignedLNodesStore.markAsAssigned({
				parentUuid: funcUuid1,
				lNodes: newLNodes
			})

			for (const lnode of newLNodes) {
				expect(
					assignedLNodesStore.isAssigned({
						parentUuid: funcUuid1,
						lnode
					})
				).toBe(true)
			}
		})

		it('should preserve existing assignments when adding new ones', () => {
			assignedLNodesStore.rebuild()

			const existingLNode: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1'
			}

			const newLNode: LNodeTemplate = {
				lnClass: 'RDIR',
				lnType: 'TestRDIR',
				lnInst: '1'
			}

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: existingLNode
				})
			).toBe(true)
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: newLNode
				})
			).toBe(false)

			assignedLNodesStore.markAsAssigned({
				parentUuid: funcUuid1,
				lNodes: [newLNode]
			})

			// Both should be assigned
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: existingLNode
				})
			).toBe(true)
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: newLNode
				})
			).toBe(true)
		})

		it('should handle marking already assigned LNodes', () => {
			assignedLNodesStore.rebuild()

			const lnode: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1'
			}

			expect(
				assignedLNodesStore.isAssigned({ parentUuid: funcUuid1, lnode })
			).toBe(true)

			// Should not throw error when marking already assigned LNode
			expect(() =>
				assignedLNodesStore.markAsAssigned({
					parentUuid: funcUuid1,
					lNodes: [lnode]
				})
			).not.toThrow()

			// Should still be assigned
			expect(
				assignedLNodesStore.isAssigned({ parentUuid: funcUuid1, lnode })
			).toBe(true)
		})

		it('should handle empty array', () => {
			assignedLNodesStore.rebuild()

			const lnode: LNodeTemplate = {
				lnClass: 'RDIR',
				lnType: 'TestRDIR',
				lnInst: '1'
			}

			expect(
				assignedLNodesStore.isAssigned({ parentUuid: funcUuid1, lnode })
			).toBe(false)

			assignedLNodesStore.markAsAssigned({
				parentUuid: funcUuid1,
				lNodes: []
			})

			// Should still not be assigned
			expect(
				assignedLNodesStore.isAssigned({ parentUuid: funcUuid1, lnode })
			).toBe(false)
		})
	})

	describe('isAssigned', () => {
		beforeEach(() => {
			assignedLNodesStore.rebuild()
		})

		it('should return true for assigned LNode', () => {
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(true)
		})

		it('should return false for non-assigned LNode', () => {
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'RDIR',
						lnType: 'TestRDIR',
						lnInst: '1'
					}
				})
			).toBe(false)
		})

		it('should differentiate between LNodes with same lnClass but different lnType', () => {
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'DifferentXCBR',
						lnInst: '1'
					}
				})
			).toBe(false)
		})

		it('should differentiate between LNodes with same lnClass and lnType but different lnInst', () => {
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '1'
					}
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'XCBR',
						lnType: 'TestXCBR',
						lnInst: '2'
					}
				})
			).toBe(false)
		})

		it('should differentiate LNodes across different parent UUIDs', () => {
			// Same LNode tuple but different parent UUID
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: {
						lnClass: 'MMXU',
						lnType: 'TestMMXU',
						lnInst: '1'
					}
				})
			).toBe(false)

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid2,
					lnode: {
						lnClass: 'MMXU',
						lnType: 'TestMMXU',
						lnInst: '1'
					}
				})
			).toBe(true)
		})

		it('should handle LNode with optional properties', () => {
			const lnodeWithOptionals: LNodeTemplate = {
				uuid: 'test-uuid',
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1',
				iedName: 'IED1',
				ldInst: 'LD1'
			}

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: lnodeWithOptionals
				})
			).toBe(true)
		})
	})

	describe('integration: rebuild after markAsAssigned', () => {
		it('should preserve manually marked LNodes after rebuild if they exist in document', () => {
			assignedLNodesStore.rebuild()

			const existingLNode: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1'
			}

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: existingLNode
				})
			).toBe(true)

			// Rebuild should still show it as assigned
			assignedLNodesStore.rebuild()

			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: existingLNode
				})
			).toBe(true)
		})

		it('should remove manually marked LNodes after rebuild if they do not exist in document', () => {
			assignedLNodesStore.rebuild()

			const newLNode: LNodeTemplate = {
				lnClass: 'RDIR',
				lnType: 'TestRDIR',
				lnInst: '1'
			}

			assignedLNodesStore.markAsAssigned({
				parentUuid: funcUuid1,
				lNodes: [newLNode]
			})
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: newLNode
				})
			).toBe(true)

			// Rebuild from document (which doesn't have this LNode)
			assignedLNodesStore.rebuild()

			// Should no longer be marked as assigned
			expect(
				assignedLNodesStore.isAssigned({
					parentUuid: funcUuid1,
					lnode: newLNode
				})
			).toBe(false)
		})
	})
})
