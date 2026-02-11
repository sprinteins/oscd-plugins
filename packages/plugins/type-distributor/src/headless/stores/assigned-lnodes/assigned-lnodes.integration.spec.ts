import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { assignedLNodesStore } from '@/headless/stores/assigned-lnodes'
import { dndStore } from '@/headless/stores/dnd'
import type { LNodeTemplate, FunctionTemplate } from '@/headless/common-types'
import type { XMLEditor } from '@openscd/oscd-editor'
import { createIedEdits } from '@/headless/stores/dnd/drop-handler'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

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

describe('Integration: Assigned LNodes Flow', () => {
	let mockDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }
	let accessPoint: Element
	let lnode1: LNodeTemplate
	let lnode2: LNodeTemplate
	let lnode3: LNodeTemplate
	let functionTemplate: FunctionTemplate
	let funcUuid: string
	let funcUuid2: string

	beforeEach(() => {
		// Create SCD with Bay structure and IED structure
		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation name="Sub1">
					<VoltageLevel name="VL1">
						<Bay name="Bay1">
							<Function name="TestFunction" templateUuid="func-uuid-1">
								<LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="ExistingIED" ldInst="LD1" />
							</Function>
							<Function name="AnotherFunction" templateUuid="func-uuid-2">
							</Function>
						</Bay>
					</VoltageLevel>
				</Substation>
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

		funcUuid = 'func-uuid-1'
		funcUuid2 = 'func-uuid-2'

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
			uuid: funcUuid,
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

			// lnode1 already exists in Bay structure with iedName
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)

			// lnode2 and lnode3 do not exist yet
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)
		})
	})

	describe('Drag and drop flow', () => {
		beforeEach(() => {
			// Mock createIedEdits to return a non-empty array so commitEdits is called
			vi.mocked(createIedEdits).mockReturnValue([
				// biome-ignore lint/suspicious/noExplicitAny: mock data
				{
					type: 'insert',
					node: {},
					parent: accessPoint,
					reference: null
				} as any
			])
		})

		it('should mark LNodes as assigned after successful drop', () => {
			assignedLNodesStore.rebuild()

			// Initial state - only lnode1 is assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)

			// Start drag with unassigned LNodes
			dndStore.handleDragStart({
				type: 'functionTemplate',
				sourceFunction: functionTemplate,
				lNodes: [lnode2, lnode3]
			})

			// Simulate successful drop
			dndStore.handleDrop(accessPoint, 'NewIED')

			// After drop, lnode2 and lnode3 should be marked as assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(true)

			// lnode1 should still be assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
		})

		it('should handle mixed assigned/unassigned LNodes in drag', () => {
			assignedLNodesStore.rebuild()

			// lnode1 is already assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// Drag all LNodes including the already assigned one
			dndStore.handleDragStart({
				type: 'functionTemplate',
				sourceFunction: functionTemplate,
				lNodes: [lnode1, lnode2]
			})

			dndStore.handleDrop(accessPoint, 'NewIED')

			// Both should be marked as assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)
		})
	})

	describe('Rebuild synchronization', () => {
		it('should maintain consistency between manual marking and document state', () => {
			assignedLNodesStore.rebuild()

			// Mark lnode2 as assigned manually
			assignedLNodesStore.markAsAssigned(funcUuid, [lnode2])
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)

			// Rebuild from document (which doesn't have lnode2 in Bay structure)
			assignedLNodesStore.rebuild()

			// lnode2 should no longer be marked as assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// lnode1 (which exists in Bay structure with iedName) should still be assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)
		})

		it('should sync state after document modifications to Bay structure', () => {
			assignedLNodesStore.rebuild()

			// Initial state
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// Manually add lnode2 to Bay structure with iedName
			const func = mockDocument.querySelector(
				'Function[templateUuid="func-uuid-1"]'
			)
			const newLN = mockDocument.createElement('LNode')
			newLN.setAttribute('lnClass', 'CSWI')
			newLN.setAttribute('lnType', 'TestCSWI')
			newLN.setAttribute('lnInst', '1')
			newLN.setAttribute('iedName', 'NewIED')
			newLN.setAttribute('ldInst', 'LD2')
			func?.appendChild(newLN)

			// Rebuild to sync with document
			assignedLNodesStore.rebuild()

			// Now lnode2 should be marked as assigned
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(true)
		})
	})

	describe('Performance: Incremental updates vs full rebuild', () => {
		it('should use incremental update during drop instead of full rebuild', () => {
			const rebuildSpy = vi.spyOn(assignedLNodesStore, 'rebuild')
			const markAsAssignedSpy = vi.spyOn(
				assignedLNodesStore,
				'markAsAssigned'
			)

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

			const initialState = assignedLNodesStore.isAssigned(
				funcUuid,
				lnode2
			)

			dndStore.handleDragStart({
				type: 'lNode',
				sourceFunction: functionTemplate,
				lNodes: [lnode2]
			})

			// End drag without dropping
			dndStore.handleDragEnd()

			// State should remain unchanged
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(
				initialState
			)
		})

		it('should handle empty document', () => {
			const emptyDoc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"></SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = emptyDoc

			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)
		})

		it('should handle null document', () => {
			pluginGlobalStore.xmlDocument = undefined

			expect(() => assignedLNodesStore.rebuild()).not.toThrow()

			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(false)
		})
	})

	describe('Multiple Functions scenario', () => {
		it('should track LNodes across multiple Functions', () => {
			// Add lnode2 to another Function
			const func2 = mockDocument.querySelector(
				'Function[templateUuid="func-uuid-2"]'
			)
			const ln2 = mockDocument.createElement('LNode')
			ln2.setAttribute('lnClass', 'CSWI')
			ln2.setAttribute('lnType', 'TestCSWI')
			ln2.setAttribute('lnInst', '1')
			ln2.setAttribute('iedName', 'NewIED')
			ln2.setAttribute('ldInst', 'LD2')
			func2?.appendChild(ln2)

			assignedLNodesStore.rebuild()

			// lnode1 should be assigned in funcUuid
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode1)).toBe(true)

			// lnode2 should be assigned in funcUuid2 (different function)
			expect(assignedLNodesStore.isAssigned(funcUuid2, lnode2)).toBe(true)

			// But lnode2 should not be assigned in funcUuid
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode2)).toBe(false)

			// And lnode3 should not be assigned anywhere
			expect(assignedLNodesStore.isAssigned(funcUuid, lnode3)).toBe(false)
			expect(assignedLNodesStore.isAssigned(funcUuid2, lnode3)).toBe(
				false
			)
		})
	})
})
