import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { dndStore } from './dnd.store.svelte'
import * as dropHandler from './drop-handler'
import {
	buildUpdatesForBayLNode,
	createMultipleLNodesInAccessPoint
} from '@/headless/scl'

vi.mock('./drop-handler', () => ({
	getBayTypeApplicationState: vi.fn(),
	shouldApplyBayType: vi.fn(),
	applyBayType: vi.fn(() => []),
	generateCommitTitle: vi.fn(),
	commitEdits: vi.fn()
}))

vi.mock('@/headless/utils/get-document-and-Editor', () => ({
	getDocumentAndEditor: vi.fn(() => ({ doc: {}, editor: {} }))
}))

vi.mock('@/headless/scl', () => ({
	createMultipleLNodesInAccessPoint: vi.fn(),
	buildUpdatesForBayLNode: vi.fn()
}))

vi.mock('@/headless/stores', () => ({
	assignedLNodesStore: {
		markAsAssigned: vi.fn(),
		rebuild: vi.fn(),
		isAssigned: vi.fn(),
		get hasConnections() {
			return false
		}
	},
	bayStore: {
		equipmentMatches: []
	},
	ssdImportStore: {
		lnodeTypes: []
	}
}))

describe('dndStore', () => {
	const mockAccessPoint = document.createElement('AccessPoint')
	const mockLNodes = [
		{
			lnClass: 'XCBR',
			lnType: 'XCBR_Type1',
			lnInst: '1',
			iedName: undefined,
			ldInst: 'LD0'
		}
	]
	const mockFunction = {
		uuid: 'func-uuid',
		name: 'TestFunction',
		lnodes: mockLNodes
	}

	beforeEach(() => {
		// Reset store state
		dndStore.isDragging = false
		dndStore.draggedItem = null

		// Reset all mocks
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('handleDragStart', () => {
		it('GIVEN a dragged item WHEN handleDragStart is called THEN should set isDragging to true and store the item', () => {
			// GIVEN a dragged item
			const draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			// WHEN handleDragStart is called
			dndStore.handleDragStart(draggedItem)

			// THEN should set isDragging to true and store the item
			expect(dndStore.isDragging).toBe(true)
			expect(dndStore.draggedItem).toStrictEqual(draggedItem)
		})
	})

	describe('handleDragEnd', () => {
		it('GIVEN an active drag WHEN handleDragEnd is called THEN should reset drag state', () => {
			// GIVEN an active drag
			dndStore.isDragging = true
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			// WHEN handleDragEnd is called
			dndStore.handleDragEnd()

			// THEN should reset drag state
			expect(dndStore.isDragging).toBe(false)
			expect(dndStore.draggedItem).toBeNull()
		})
	})

	describe('GIVEN no dragged item', () => {
		it('WHEN handleDrop is called THEN should exit early and call handleDragEnd', () => {
			// GIVEN no dragged item
			dndStore.draggedItem = null

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should exit early and call handleDragEnd
			expect(
				dropHandler.getBayTypeApplicationState
			).not.toHaveBeenCalled()
			expect(dropHandler.commitEdits).not.toHaveBeenCalled()
			expect(dndStore.isDragging).toBe(false)
		})

		it('WHEN currentDraggedItem is accessed THEN should return null', () => {
			// GIVEN no dragged item
			dndStore.draggedItem = null

			// WHEN currentDraggedItem is accessed
			const result = dndStore.currentDraggedItem

			// THEN should return null
			expect(result).toBeNull()
		})
	})

	describe('handleDrop', () => {
		it('GIVEN dragged item with missing parentUuid WHEN handleDrop is called THEN should exit early and reset state', () => {
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: '',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			expect(
				dropHandler.getBayTypeApplicationState
			).not.toHaveBeenCalled()
			expect(dropHandler.commitEdits).not.toHaveBeenCalled()
			expect(dndStore.draggedItem).toBeNull()
		})

		it('GIVEN dragged item with missing functionScopeUuid WHEN handleDrop is called THEN should exit early and reset state', () => {
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: '',
				equipmentUuid: 'eq-uuid'
			}

			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			expect(
				dropHandler.getBayTypeApplicationState
			).not.toHaveBeenCalled()
			expect(dropHandler.commitEdits).not.toHaveBeenCalled()
			expect(dndStore.draggedItem).toBeNull()
		})

		it('GIVEN dragged item with empty lNodes WHEN handleDrop is called THEN should exit early and reset state', () => {
			// GIVEN dragged item with empty lNodes
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: [],
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should exit early and reset state
			expect(
				dropHandler.getBayTypeApplicationState
			).not.toHaveBeenCalled()
			expect(dropHandler.commitEdits).not.toHaveBeenCalled()
			expect(dndStore.draggedItem).toBeNull()
		})

		it('GIVEN valid dragged item and no bay type WHEN handleDrop is called THEN should build IED edits only and commit', () => {
			// GIVEN valid dragged item and no bay type
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			const mockIedEdits = [
				{
					node: document.createElement('LNode'),
					parent: mockAccessPoint,
					reference: null
				}
			]
			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: false,
				hasSelectedBay: false,
				requiresManualMatching: false,
				hasValidAutoSelection: false,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.shouldApplyBayType).mockReturnValue(false)
			vi.mocked(createMultipleLNodesInAccessPoint).mockReturnValue(
				mockIedEdits
			)
			vi.mocked(dropHandler.generateCommitTitle).mockReturnValue(
				'Test Commit'
			)

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should build IED edits only and commit
			expect(createMultipleLNodesInAccessPoint).toHaveBeenCalledWith({
				sourceFunction: mockFunction,
				lNodes: mockLNodes,
				accessPoint: mockAccessPoint,
				equipmentMatches: [],
				equipmentUuid: 'eq-uuid',
				doc: expect.anything(),
				lnodeTypes: expect.anything()
			})
			expect(buildUpdatesForBayLNode).not.toHaveBeenCalled()
			expect(dropHandler.commitEdits).toHaveBeenCalledWith({
				edits: mockIedEdits,
				title: 'Test Commit',
				squash: false
			})
			expect(dndStore.draggedItem).toBeNull()
		})

		it('GIVEN valid dragged item and bay type applied WHEN handleDrop is called THEN should build both IED and bay edits', () => {
			// GIVEN valid dragged item and bay type applied
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			const mockIedEdits = [
				{
					node: document.createElement('LNode'),
					parent: mockAccessPoint,
					reference: null
				}
			]
			const mockBayEdits = [
				{
					element: document.createElement('LNode'),
					parent: document.createElement('Bay'),
					reference: null
				}
			]

			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: true,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.shouldApplyBayType).mockReturnValue(false)
			vi.mocked(createMultipleLNodesInAccessPoint).mockReturnValue(
				mockIedEdits
			)
			vi.mocked(buildUpdatesForBayLNode).mockReturnValue(mockBayEdits)
			vi.mocked(dropHandler.generateCommitTitle).mockReturnValue(
				'Test Commit with Bay'
			)

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should build both IED and bay edits
			expect(createMultipleLNodesInAccessPoint).toHaveBeenCalledWith({
				sourceFunction: mockFunction,
				lNodes: mockLNodes,
				accessPoint: mockAccessPoint,
				equipmentMatches: [],
				equipmentUuid: 'eq-uuid',
				doc: expect.anything(),
				lnodeTypes: expect.anything()
			})
			expect(buildUpdatesForBayLNode).toHaveBeenCalledWith({
				lNodes: mockLNodes,
				iedName: 'TestIED',
				sourceFunction: mockFunction,
				equipmentUuid: 'eq-uuid',
				equipmentMatches: []
			})
			expect(dropHandler.commitEdits).toHaveBeenCalledWith({
				edits: [...mockIedEdits, ...mockBayEdits],
				title: 'Test Commit with Bay',
				squash: false
			})
		})

		it('GIVEN bay type needs applying WHEN handleDrop is called THEN should apply bay type and use squash flag', () => {
			// GIVEN bay type needs applying
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			const mockIedEdits = [
				{
					node: document.createElement('LNode'),
					parent: mockAccessPoint,
					reference: null
				}
			]
			const mockBayEdits = [
				{
					element: document.createElement('LNode'),
					parent: document.createElement('Bay'),
					reference: null
				}
			]

			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.shouldApplyBayType).mockReturnValue(true)
			vi.mocked(createMultipleLNodesInAccessPoint).mockReturnValue(
				mockIedEdits
			)
			vi.mocked(buildUpdatesForBayLNode).mockReturnValue(mockBayEdits)
			vi.mocked(dropHandler.generateCommitTitle).mockReturnValue(
				'Apply Bay Type'
			)

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should apply bay type and use squash flag
			expect(dropHandler.shouldApplyBayType).toHaveBeenCalled()
			expect(dropHandler.applyBayType).toHaveBeenCalled()
			expect(buildUpdatesForBayLNode).toHaveBeenCalled()
			expect(dropHandler.commitEdits).toHaveBeenCalledWith({
				edits: [...mockIedEdits, ...mockBayEdits],
				title: 'Apply Bay Type',
				squash: true
			})
		})

		it('GIVEN no edits generated WHEN handleDrop is called THEN should not call commitEdits', () => {
			// GIVEN no edits generated
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: false,
				hasSelectedBay: false,
				requiresManualMatching: false,
				hasValidAutoSelection: false,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.shouldApplyBayType).mockReturnValue(false)
			vi.mocked(createMultipleLNodesInAccessPoint).mockReturnValue([])

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should not call commitEdits
			expect(dropHandler.commitEdits).not.toHaveBeenCalled()
			expect(dndStore.draggedItem).toBeNull()
		})

		it('GIVEN error during edit creation WHEN handleDrop is called THEN should catch error and still call handleDragEnd', () => {
			// GIVEN error during edit creation
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			vi.mocked(
				dropHandler.getBayTypeApplicationState
			).mockImplementation(() => {
				throw new Error('Test error')
			})

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should catch error and still call handleDragEnd
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'[DnD] Error creating LNodes:',
				expect.any(Error)
			)
			expect(dndStore.draggedItem).toBeNull()
			expect(dndStore.isDragging).toBe(false)

			consoleErrorSpy.mockRestore()
		})
	})

	describe('isDraggingItem', () => {
		it('GIVEN no active drag WHEN isDraggingItem is called THEN should return false', () => {
			dndStore.isDragging = false
			dndStore.draggedItem = null

			expect(
				dndStore.isDraggingItem(
					'equipmentFunction',
					'func-uuid',
					'eq-uuid'
				)
			).toBe(false)
		})

		it('GIVEN active drag with matching type, sourceFunctionUuid, and parentUuid WHEN isDraggingItem is called THEN should return true', () => {
			dndStore.isDragging = true
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			expect(
				dndStore.isDraggingItem(
					'equipmentFunction',
					mockFunction.uuid,
					'eq-uuid'
				)
			).toBe(true)
		})

		it('GIVEN active drag with mismatched type WHEN isDraggingItem is called THEN should return false', () => {
			dndStore.isDragging = true
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			expect(
				dndStore.isDraggingItem('lNode', mockFunction.uuid, 'eq-uuid')
			).toBe(false)
		})

		it('GIVEN active drag with mismatched sourceFunctionUuid WHEN isDraggingItem is called THEN should return false', () => {
			dndStore.isDragging = true
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			expect(
				dndStore.isDraggingItem(
					'equipmentFunction',
					'other-uuid',
					'eq-uuid'
				)
			).toBe(false)
		})

		it('GIVEN active drag with mismatched parentUuid WHEN isDraggingItem is called THEN should return false', () => {
			dndStore.isDragging = true
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}

			expect(
				dndStore.isDraggingItem(
					'equipmentFunction',
					mockFunction.uuid,
					'other-uuid'
				)
			).toBe(false)
		})
	})

	describe('currentDraggedItem', () => {
		it('GIVEN dragged item is set WHEN currentDraggedItem is accessed THEN should return the dragged item', () => {
			// GIVEN dragged item is set
			const draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				parentUuid: 'eq-uuid',
				functionScopeUuid: mockFunction.uuid,
				equipmentUuid: 'eq-uuid'
			}
			dndStore.draggedItem = draggedItem

			// WHEN currentDraggedItem is accessed
			const result = dndStore.currentDraggedItem

			// THEN should return the dragged item
			expect(result).toStrictEqual(draggedItem)
		})
	})
})
