import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignedLNodesStore } from './assigned-lnodes.store.svelte'
import type { LNodeTemplate } from '@/headless/common-types'

// Mock pluginGlobalStore
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null
	}
}))

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')

describe('assignedLNodesStore', () => {
	let mockDocument: Document
	const ld1 = 'LD1'
	const ld2 = 'LD2'

	beforeEach(() => {
		// Create a mock SCD document with some existing LNodes
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1">
					<AccessPoint name="AP1">
						<Server>
							<LDevice inst="LD1">
								<LN lnClass="XCBR" lnType="TestXCBR" lnInst="1" />
								<LN lnClass="CSWI" lnType="TestCSWI" lnInst="1" />
							<LN0 lnClass="LLN0" lnType="TestLLN0" />
							</LDevice>
							<LDevice inst="LD2">
								<LN lnClass="MMXU" lnType="TestMMXU" lnInst="1" />
							</LDevice>
						</Server>
					</AccessPoint>
				</IED>
				<IED name="IED2">
					<AccessPoint name="AP1">
						<Server>
							<LDevice inst="LD1">
								<LN lnClass="PTRC" lnType="TestPTRC" lnInst="1" />
							</LDevice>
						</Server>
					</AccessPoint>
				</IED>
			</SCL>`,
			'application/xml'
		)

		pluginGlobalStore.xmlDocument = mockDocument
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('rebuild', () => {
		it('should build index of all assigned LNodes in document', () => {
			assignedLNodesStore.rebuild()

			// Check that existing LNodes are marked as assigned
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'CSWI',
					lnType: 'TestCSWI',
					lnInst: '1'
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned(ld2, {
					lnClass: 'MMXU',
					lnType: 'TestMMXU',
					lnInst: '1'
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'PTRC',
					lnType: 'TestPTRC',
					lnInst: '1'
				})
			).toBe(true)
		})

		it('should not mark non-existent LNodes as assigned', () => {
			assignedLNodesStore.rebuild()

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'PDIS',
					lnType: 'TestPDIS',
					lnInst: '1'
				})
			).toBe(false)

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'DifferentType',
					lnInst: '1'
				})
			).toBe(false)

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '2'
				})
			).toBe(false)
		})

		it('should clear index when document is null', () => {
			assignedLNodesStore.rebuild()

			// Verify some LNodes are assigned
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(true)

			// Set document to null
			pluginGlobalStore.xmlDocument = undefined
			assignedLNodesStore.rebuild()

			// Verify index is cleared
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(false)
		})

		it('should handle empty document', () => {
			const emptyDoc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = emptyDoc

			assignedLNodesStore.rebuild()

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(false)
		})

		it('should handle LNodes with missing attributes', () => {
			const docWithMissingAttrs = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<IED name="IED1">
						<AccessPoint name="AP1">
							<Server>
								<LDevice inst="LD1">
									<LN lnClass="XCBR" lnType="TestXCBR" />
									<LN lnClass="CSWI" lnInst="1" />
									<LN lnType="TestMMXU" lnInst="1" />
								</LDevice>
							</Server>
						</AccessPoint>
					</IED>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = docWithMissingAttrs

			// Should not throw error
			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			// LNodes with missing attributes should not be indexed
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(false)
		})
	})

	describe('markAsAssigned', () => {
		it('should add single LNode to index', () => {
			assignedLNodesStore.rebuild()

			const newLNode: LNodeTemplate = {
				lnClass: 'PDIS',
				lnType: 'TestPDIS',
				lnInst: '1'
			}

			expect(assignedLNodesStore.isAssigned(ld1, newLNode)).toBe(false)

			assignedLNodesStore.markAsAssigned(ld1, [newLNode])

			expect(assignedLNodesStore.isAssigned(ld1, newLNode)).toBe(true)
		})

		it('should add multiple LNodes to index', () => {
			assignedLNodesStore.rebuild()

			const newLNodes: LNodeTemplate[] = [
				{ lnClass: 'PDIS', lnType: 'TestPDIS', lnInst: '1' },
				{ lnClass: 'PSCH', lnType: 'TestPSCH', lnInst: '1' },
				{ lnClass: 'RDIR', lnType: 'TestRDIR', lnInst: '1' }
			]

			for (const lnode of newLNodes) {
				expect(assignedLNodesStore.isAssigned(ld1, lnode)).toBe(false)
			}

			assignedLNodesStore.markAsAssigned(ld1, newLNodes)

			for (const lnode of newLNodes) {
				expect(assignedLNodesStore.isAssigned(ld1, lnode)).toBe(true)
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
				lnClass: 'PDIS',
				lnType: 'TestPDIS',
				lnInst: '1'
			}

			expect(assignedLNodesStore.isAssigned(ld1, existingLNode)).toBe(true)
			expect(assignedLNodesStore.isAssigned(ld1, newLNode)).toBe(false)

			assignedLNodesStore.markAsAssigned(ld1, [newLNode])

			// Both should be assigned
			expect(assignedLNodesStore.isAssigned(ld1, existingLNode)).toBe(true)
			expect(assignedLNodesStore.isAssigned(ld1, newLNode)).toBe(true)
		})

		it('should handle marking already assigned LNodes', () => {
			assignedLNodesStore.rebuild()

			const lnode: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1'
			}

			expect(assignedLNodesStore.isAssigned(ld1, lnode)).toBe(true)

			// Should not throw error when marking already assigned LNode
			expect(() => assignedLNodesStore.markAsAssigned(ld1, [lnode])).not.toThrow()

			// Should still be assigned
			expect(assignedLNodesStore.isAssigned(ld1, lnode)).toBe(true)
		})

		it('should handle empty array', () => {
			assignedLNodesStore.rebuild()

			const lnode: LNodeTemplate = {
				lnClass: 'PDIS',
				lnType: 'TestPDIS',
				lnInst: '1'
			}

			expect(assignedLNodesStore.isAssigned(ld1, lnode)).toBe(false)

			assignedLNodesStore.markAsAssigned(ld1, [])

			// Should still not be assigned
			expect(assignedLNodesStore.isAssigned(ld1, lnode)).toBe(false)
		})
	})

	describe('isAssigned', () => {
		beforeEach(() => {
			assignedLNodesStore.rebuild()
		})

		it('should return true for assigned LNode', () => {
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(true)
		})

		it('should return false for non-assigned LNode', () => {
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'PDIS',
					lnType: 'TestPDIS',
					lnInst: '1'
				})
			).toBe(false)
		})

		it('should differentiate between LNodes with same lnClass but different lnType', () => {
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'DifferentXCBR',
					lnInst: '1'
				})
			).toBe(false)
		})

		it('should differentiate between LNodes with same lnClass and lnType but different lnInst', () => {
			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '1'
				})
			).toBe(true)

			expect(
				assignedLNodesStore.isAssigned(ld1, {
					lnClass: 'XCBR',
					lnType: 'TestXCBR',
					lnInst: '2'
				})
			).toBe(false)
		})

		it('should handle LNode with optional properties', () => {
			const lnodeWithOptionals: LNodeTemplate = {
				uuid: 'test-uuid',
				lnClass: 'XCBR',
				lnType: 'TestXCBR',
				lnInst: '1',
				iedName: 'IED1',
				lDeviceName: 'LD1'
			}

			expect(
				assignedLNodesStore.isAssigned(ld1, lnodeWithOptionals)
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

			expect(assignedLNodesStore.isAssigned(ld1, existingLNode)).toBe(true)

			// Rebuild should still show it as assigned
			assignedLNodesStore.rebuild()

			expect(assignedLNodesStore.isAssigned(ld1, existingLNode)).toBe(true)
		})

		it('should remove manually marked LNodes after rebuild if they do not exist in document', () => {
			assignedLNodesStore.rebuild()

			const newLNode: LNodeTemplate = {
				lnClass: 'PDIS',
				lnType: 'TestPDIS',
				lnInst: '1'
			}

			assignedLNodesStore.markAsAssigned(ld1, [newLNode])
			expect(assignedLNodesStore.isAssigned(ld1, newLNode)).toBe(true)

			// Rebuild from document (which doesn't have this LNode)
			assignedLNodesStore.rebuild()

			// Should no longer be marked as assigned
			expect(assignedLNodesStore.isAssigned(ld1, newLNode)).toBe(false)
		})
	})
})