import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { dndStore } from './dnd.store.svelte'
import * as dropHandler from './drop-handler'
import { buildEditsForBayLNode } from '@/headless/ied'

vi.mock('./drop-handler', () => ({
	getBayTypeApplicationState: vi.fn(),
	applyBayTypeIfNeeded: vi.fn(),
	buildEditsForIed: vi.fn(),
	generateCommitTitle: vi.fn(),
	commitEdits: vi.fn()
}))

vi.mock('@/headless/ied', () => ({
	buildEditsForBayLNode: vi.fn()
}))

describe('dndStore', () => {
	const mockAccessPoint = document.createElement('AccessPoint')
	const mockLNodes = [
		{
			lnClass: 'XCBR',
			lnType: 'XCBR_Type1',
			lnInst: '1',
			iedName: undefined,
			lDeviceName: 'LD0'
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
				sourceFunction: mockFunction
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
				sourceFunction: mockFunction
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
		it('GIVEN dragged item with empty lNodes WHEN handleDrop is called THEN should exit early and reset state', () => {
			// GIVEN dragged item with empty lNodes
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: [],
				sourceFunction: mockFunction
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
				sourceFunction: mockFunction
			}

			const mockIedEdits = [
				{ element: mockAccessPoint, attributes: {}, attributesNS: {} }
			]
			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: false,
				hasSelectedBay: false,
				requiresManualMatching: false,
				hasValidAutoSelection: false,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.applyBayTypeIfNeeded).mockReturnValue(false)
			vi.mocked(dropHandler.buildEditsForIed).mockReturnValue(
				mockIedEdits
			)
			vi.mocked(dropHandler.generateCommitTitle).mockReturnValue(
				'Test Commit'
			)

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should build IED edits only and commit
			expect(dropHandler.buildEditsForIed).toHaveBeenCalledWith(
				mockFunction,
				mockLNodes,
				mockAccessPoint,
				undefined
			)
			expect(buildEditsForBayLNode).not.toHaveBeenCalled()
			expect(dropHandler.commitEdits).toHaveBeenCalledWith(
				mockIedEdits,
				'Test Commit',
				false
			)
			expect(dndStore.draggedItem).toBeNull()
		})

		it('GIVEN valid dragged item and bay type applied WHEN handleDrop is called THEN should build both IED and bay edits', () => {
			// GIVEN valid dragged item and bay type applied
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction,
				equipmentUuid: 'eq-uuid'
			}

			const mockIedEdits = [
				{ element: mockAccessPoint, attributes: {}, attributesNS: {} }
			]
			const mockBayEdits = [
				{
					element: document.createElement('LNode'),
					attributes: { iedName: 'TestIED' },
					attributesNS: {}
				}
			]

			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: true,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.applyBayTypeIfNeeded).mockReturnValue(false)
			vi.mocked(dropHandler.buildEditsForIed).mockReturnValue(
				mockIedEdits
			)
			vi.mocked(buildEditsForBayLNode).mockReturnValue(mockBayEdits)
			vi.mocked(dropHandler.generateCommitTitle).mockReturnValue(
				'Test Commit with Bay'
			)

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should build both IED and bay edits
			expect(dropHandler.buildEditsForIed).toHaveBeenCalledWith(
				mockFunction,
				mockLNodes,
				mockAccessPoint,
				'eq-uuid'
			)
			expect(buildEditsForBayLNode).toHaveBeenCalledWith({
				lNodes: mockLNodes,
				iedName: 'TestIED',
				sourceFunction: mockFunction,
				equipmentUuid: 'eq-uuid'
			})
			expect(dropHandler.commitEdits).toHaveBeenCalledWith(
				[...mockIedEdits, ...mockBayEdits],
				'Test Commit with Bay',
				false
			)
		})

		it('GIVEN bay type needs applying WHEN handleDrop is called THEN should apply bay type and use squash flag', () => {
			// GIVEN bay type needs applying
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction
			}

			const mockIedEdits = [
				{ element: mockAccessPoint, attributes: {}, attributesNS: {} }
			]
			const mockBayEdits = [
				{
					element: document.createElement('LNode'),
					attributes: { iedName: 'TestIED' },
					attributesNS: {}
				}
			]

			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.applyBayTypeIfNeeded).mockReturnValue(true)
			vi.mocked(dropHandler.buildEditsForIed).mockReturnValue(
				mockIedEdits
			)
			vi.mocked(buildEditsForBayLNode).mockReturnValue(mockBayEdits)
			vi.mocked(dropHandler.generateCommitTitle).mockReturnValue(
				'Apply Bay Type'
			)

			// WHEN handleDrop is called
			dndStore.handleDrop(mockAccessPoint, 'TestIED')

			// THEN should apply bay type and use squash flag
			expect(dropHandler.applyBayTypeIfNeeded).toHaveBeenCalled()
			expect(buildEditsForBayLNode).toHaveBeenCalled()
			expect(dropHandler.commitEdits).toHaveBeenCalledWith(
				[...mockIedEdits, ...mockBayEdits],
				'Apply Bay Type',
				true
			)
		})

		it('GIVEN no edits generated WHEN handleDrop is called THEN should not call commitEdits', () => {
			// GIVEN no edits generated
			dndStore.draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction
			}

			vi.mocked(dropHandler.getBayTypeApplicationState).mockReturnValue({
				hasAssignedBayType: false,
				hasSelectedBay: false,
				requiresManualMatching: false,
				hasValidAutoSelection: false,
				hasPendingManualSelection: false
			})
			vi.mocked(dropHandler.applyBayTypeIfNeeded).mockReturnValue(false)
			vi.mocked(dropHandler.buildEditsForIed).mockReturnValue([])

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
				sourceFunction: mockFunction
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

	describe('currentDraggedItem', () => {
		it('GIVEN dragged item is set WHEN currentDraggedItem is accessed THEN should return the dragged item', () => {
			// GIVEN dragged item is set
			const draggedItem = {
				type: 'equipmentFunction' as const,
				lNodes: mockLNodes,
				sourceFunction: mockFunction
			}
			dndStore.draggedItem = draggedItem

			// WHEN currentDraggedItem is accessed
			const result = dndStore.currentDraggedItem

			// THEN should return the dragged item
			expect(result).toStrictEqual(draggedItem)
		})
	})
})
