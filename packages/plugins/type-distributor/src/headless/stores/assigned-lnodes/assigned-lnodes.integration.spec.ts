import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignedLNodesStore } from '@/headless/stores/assigned-lnodes'
import { dndStore } from '@/headless/stores/dnd'
import type { LNodeTemplate, FunctionTemplate } from '@/headless/common-types'
import type { XMLEditor } from '@openscd/oscd-editor'

// Mock modules
vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

// Mock the entire drop-handler module to avoid real execution
vi.mock('@/headless/stores/dnd/drop-handler', () => ({
	getBayTypeApplicationState: vi.fn(() => ({
		hasAssignedBayType: false,
		hasSelectedBay: true,
		requiresManualMatching: false,
		hasValidAutoSelection: false,
		hasPendingManualSelection: false
	})),
	applyBayTypeIfNeeded: vi.fn(() => false),
	createIedEdits: vi.fn(() => []),
	createBayEdits: vi.fn(() => []),
	generateCommitTitle: vi.fn(() => 'Test Commit'),
	commitEdits: vi.fn()
}))

vi.mock('@/headless/stores/bay-types.store.svelte', () => ({
	bayTypesStore: {
		selectedBayType: null,
		bayTypes: []
	}
}))

vi.mock('@/headless/stores/bay.store.svelte', () => ({
	bayStore: {
		selectedBay: null,
		assigendBayType: null,
		pendingBayTypeApply: null
	}
}))

vi.mock('@/headless/stores/equipment-matching.store.svelte', () => ({
	equipmentMatchingStore: {
		validationResult: null
	}
}))

const { pluginGlobalStore } = await import('@oscd-plugins/core-ui-svelte')
const dropHandler = await import('@/headless/stores/dnd/drop-handler')

describe('Integration: Assigned LNodes Flow', () => {
	let mockDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let accessPoint: Element
	let lnode1: LNodeTemplate
	let lnode2: LNodeTemplate
	let lnode3: LNodeTemplate
	let functionTemplate: FunctionTemplate

	beforeEach(() => {
		// Create SCD with one IED already having an LNode
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="ExistingIED">
					<AccessPoint name="AP1">
						<Server>
							<LDevice inst="LD1">
								<LN lnClass="XCBR" lnType="TestXCBR" lnInst="1" />
							</LDevice>
						</Server>
					</AccessPoint>
				</IED>
				<IED name="NewIED">
					<AccessPoint name="AP1">
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

		accessPoint = mockDocument.querySelector(
			'IED[name="NewIED"] AccessPoint[name="AP1"]'
		) as Element

		lnode1 = {
			uuid: 'lnode1-uuid',
			lnClass: 'XCBR',
			lnType: 'TestXCBR',
			lnInst: '1'
		}

		lnode2 = {
			uuid: 'lnode2-uuid',
			lnClass: 'CSWI',
			lnType: 'TestCSWI',
			lnInst: '1'
		}

		lnode3 = {
			uuid: 'lnode3-uuid',
			lnClass: 'MMXU',
			lnType: 'TestMMXU',
			lnInst: '1'
		}

		functionTemplate = {
			uuid: 'func-template-uuid',
			name: 'TestFunction',
			desc: 'Test Function',
			lnodes: [lnode1, lnode2, lnode3]
		}

		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.clearAllMocks()
		dndStore.handleDragEnd()
	})

	describe('Initial state', () => {
		it('should identify already assigned LNodes after rebuild', () => {
			assignedLNodesStore.rebuild()

			// lnode1 already exists in ExistingIED
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)

			// lnode2 and lnode3 do not exist yet
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(lnode3)).toBe(false)
		})
	})

	describe('Drag and drop flow', () => {
		beforeEach(() => {
			// Mock createIedEdits to return a non-empty array so commitEdits is called
			vi.mocked(dropHandler.createIedEdits).mockReturnValue([
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				{ type: 'insert', node: {}, parent: accessPoint, reference: null } as any
			])
		})

		it('should mark LNodes as assigned after successful drop', () => {
			assignedLNodesStore.rebuild()

			// Initial state - only lnode1 is assigned
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(lnode3)).toBe(false)

			// Start drag with unassigned LNodes
			dndStore.handleDragStart({
				type: 'functionTemplate',
				sourceFunction: functionTemplate,
				lNodes: [lnode2, lnode3]
			})

			// Simulate successful drop
			dndStore.handleDrop(accessPoint, 'NewIED')

			// After drop, lnode2 and lnode3 should be marked as assigned
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(true)
			expect(assignedLNodesStore.isAssigned(lnode3)).toBe(true)

			// lnode1 should still be assigned
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)
		})

		it('should handle mixed assigned/unassigned LNodes in drag', () => {
			assignedLNodesStore.rebuild()

			// lnode1 is already assigned
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(false)

			// Drag all LNodes including the already assigned one
			dndStore.handleDragStart({
				type: 'functionTemplate',
				sourceFunction: functionTemplate,
				lNodes: [lnode1, lnode2]
			})

			dndStore.handleDrop(accessPoint, 'NewIED')

			// Both should be marked as assigned
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(true)
		})
	})

	describe('Rebuild synchronization', () => {
		it('should maintain consistency between manual marking and document state', () => {
			assignedLNodesStore.rebuild()

			// Mark lnode2 as assigned manually
			assignedLNodesStore.markAsAssigned([lnode2])
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(true)

			// Rebuild from document (which doesn't have lnode2)
			assignedLNodesStore.rebuild()

			// lnode2 should no longer be marked as assigned
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(false)

			// lnode1 (which exists in document) should still be assigned
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)
		})

		it('should sync state after document modifications', () => {
			assignedLNodesStore.rebuild()

			// Initial state
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(false)

			// Manually add lnode2 to document
			const newIED = mockDocument.querySelector('IED[name="NewIED"]')
			const newAP = newIED?.querySelector('AccessPoint[name="AP1"]')
			const newServer = mockDocument.createElement('Server')
			const newLDevice = mockDocument.createElement('LDevice')
			newLDevice.setAttribute('inst', 'LD1')
			const newLN = mockDocument.createElement('LN')
			newLN.setAttribute('lnClass', 'CSWI')
			newLN.setAttribute('lnType', 'TestCSWI')
			newLN.setAttribute('lnInst', '1')
			newLDevice.appendChild(newLN)
			newServer.appendChild(newLDevice)
			newAP?.appendChild(newServer)

			// Rebuild to sync with document
			assignedLNodesStore.rebuild()

			// Now lnode2 should be marked as assigned
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(true)
		})
	})

	describe('Performance: Incremental updates vs full rebuild', () => {
		it('should use incremental update during drop instead of full rebuild', () => {
			const rebuildSpy = vi.spyOn(assignedLNodesStore, 'rebuild')
			const markAsAssignedSpy = vi.spyOn(assignedLNodesStore, 'markAsAssigned')

			assignedLNodesStore.rebuild()
			rebuildSpy.mockClear()

			// Perform drop
			dndStore.handleDragStart({
				type: 'lNode',
				sourceFunction: functionTemplate,
				lNodes: [lnode2]
			})

			dndStore.handleDrop(accessPoint, 'NewIED')

			// Should use markAsAssigned, not rebuild
			expect(markAsAssignedSpy).toHaveBeenCalledTimes(1)
			expect(rebuildSpy).not.toHaveBeenCalled()
		})
	})

	describe('Edge cases', () => {
		it('should handle drag end without drop', () => {
			assignedLNodesStore.rebuild()

			const initialState = assignedLNodesStore.isAssigned(lnode2)

			dndStore.handleDragStart({
				type: 'lNode',
				sourceFunction: functionTemplate,
				lNodes: [lnode2]
			})

			// End drag without dropping
			dndStore.handleDragEnd()

			// State should remain unchanged
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(initialState)
		})

		it('should handle empty document', () => {
			const emptyDoc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = emptyDoc

			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(false)
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(lnode3)).toBe(false)
		})

		it('should handle null document', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(false)
		})
	})

	describe('Multiple IEDs scenario', () => {
		it('should track LNodes across multiple IEDs', () => {
			// Add lnode2 to ExistingIED
			const existingIED = mockDocument.querySelector('IED[name="ExistingIED"]')
			const existingLDevice = existingIED?.querySelector('LDevice[inst="LD1"]')
			const ln2 = mockDocument.createElement('LN')
			ln2.setAttribute('lnClass', 'CSWI')
			ln2.setAttribute('lnType', 'TestCSWI')
			ln2.setAttribute('lnInst', '1')
			existingLDevice?.appendChild(ln2)

			assignedLNodesStore.rebuild()

			// Both lnode1 and lnode2 should be assigned now
			expect(assignedLNodesStore.isAssigned(lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(lnode2)).toBe(true)
			expect(assignedLNodesStore.isAssigned(lnode3)).toBe(false)
		})
	})
})
