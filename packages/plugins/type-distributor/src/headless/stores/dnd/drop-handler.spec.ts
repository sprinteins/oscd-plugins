import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	applyBayTypeIfNeeded,
	generateCommitTitle,
	getBayTypeApplicationState,
	shouldApplyBayType
} from './drop-handler'
import { bayTypesStore } from '../bay-types.store.svelte'
import { bayStore } from '../bay.store.svelte'
import { equipmentMatchingStore } from '../equipment-matching.store.svelte'
import { applyBayTypeSelection } from '@/headless/matching'

vi.mock('../bay-types.store.svelte', () => ({
	bayTypesStore: {
		selectedBayType: null as string | null,
		getBayTypeWithTemplates: vi.fn()
	}
}))

vi.mock('../bay.store.svelte', () => ({
	bayStore: {
		assignedBayType: null as string | null,
		selectedBay: null as string | null,
		pendingBayTypeApply: null as string | null
	}
}))

vi.mock('../equipment-matching.store.svelte', () => ({
	equipmentMatchingStore: {
		validationResult: null as null | { isValid?: boolean; requiresManualMatching?: boolean },
		clearValidationResult: vi.fn()
	}
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

vi.mock('@/headless/matching', () => ({
	applyBayTypeSelection: vi.fn()
}))

vi.mock('@/headless/utils/get-document-and-Editor', () => ({
	getDocumentAndEditor: vi.fn()
}))

vi.mock('@/headless/ied', () => ({
	createMultipleLNodesInAccessPoint: vi.fn()
}))

describe('drop-handler', () => {
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
		bayTypesStore.selectedBayType = null
		bayStore.assignedBayType = null
		bayStore.selectedBay = null
		bayStore.pendingBayTypeApply = null
		equipmentMatchingStore.validationResult = null
		vi.clearAllMocks()
	})

	describe('shouldApplyBayType', () => {
		it('returns false when bay type already assigned', () => {
			// GIVEN a state with an assigned bay type
			expect(
				shouldApplyBayType({
					hasAssignedBayType: true,
					hasSelectedBay: true,
					requiresManualMatching: false,
					hasValidAutoSelection: true,
					hasPendingManualSelection: false
				})
			).toBe(false)
			// THEN should not apply bay type
		})

		it('returns false when no bay selected', () => {
			// GIVEN a state with no selected bay
			expect(
				shouldApplyBayType({
					hasAssignedBayType: false,
					hasSelectedBay: false,
					requiresManualMatching: false,
					hasValidAutoSelection: true,
					hasPendingManualSelection: true
				})
			).toBe(false)
			// THEN should not apply bay type
		})

		it('returns true for valid auto selection', () => {
			// GIVEN a valid auto-selection state
			expect(
				shouldApplyBayType({
					hasAssignedBayType: false,
					hasSelectedBay: true,
					requiresManualMatching: false,
					hasValidAutoSelection: true,
					hasPendingManualSelection: false
				})
			).toBe(true)
			// THEN should apply bay type
		})

		it('returns true for pending manual selection', () => {
			// GIVEN a pending manual selection state
			expect(
				shouldApplyBayType({
					hasAssignedBayType: false,
					hasSelectedBay: true,
					requiresManualMatching: true,
					hasValidAutoSelection: false,
					hasPendingManualSelection: true
				})
			).toBe(true)
			// THEN should apply bay type
		})
	})

	describe('getBayTypeApplicationState', () => {
		it('derives auto selection state when validation is valid', () => {
			// GIVEN a selected bay type with valid auto selection
			bayTypesStore.selectedBayType = 'bt-1'
			bayStore.assignedBayType = null
			bayStore.selectedBay = 'Bay-1'
			equipmentMatchingStore.validationResult = {
				isValid: true,
				requiresManualMatching: false,
        errors: []
			}

			// WHEN the application state is derived
			const result = getBayTypeApplicationState()

			// THEN it reflects a valid auto selection
			expect(result).toStrictEqual({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})
		})

		it('derives pending manual selection when required', () => {
			// GIVEN a pending manual selection requirement
			bayStore.pendingBayTypeApply = 'bt-2'
			bayStore.selectedBay = 'Bay-2'
			equipmentMatchingStore.validationResult = {
				isValid: false,
				requiresManualMatching: true,
        errors: []
			}

			// WHEN the application state is derived
			const result = getBayTypeApplicationState()

			// THEN it reflects the pending manual selection
			expect(result).toStrictEqual({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: true,
				hasValidAutoSelection: false,
				hasPendingManualSelection: true
			})
		})
	})

	describe('applyBayTypeIfNeeded', () => {
		it('returns false when should not apply', () => {
			// GIVEN a state where bay type should not be applied
			const didApply = applyBayTypeIfNeeded({
				hasAssignedBayType: true,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})

			// THEN no application occurs
			expect(didApply).toBe(false)
			expect(applyBayTypeSelection).not.toHaveBeenCalled()
		})

		it('throws when state says selected bay but store is missing', () => {
			// GIVEN a state that requires a selected bay but store is missing it
			bayStore.selectedBay = null
			bayStore.pendingBayTypeApply = 'bt-3'

			// WHEN apply is attempted
			expect(() =>
				applyBayTypeIfNeeded({
					hasAssignedBayType: false,
					hasSelectedBay: true,
					requiresManualMatching: true,
					hasValidAutoSelection: false,
					hasPendingManualSelection: true
				})
			).toThrowError('[DnD] No bay type selected to apply to bay')
			// THEN it throws a meaningful error
		})

		it('applies pending manual selection and clears validation', () => {
			// GIVEN a pending manual selection
			bayStore.selectedBay = 'Bay-3'
			bayStore.pendingBayTypeApply = 'bt-3'

			// WHEN applying the bay type
			const didApply = applyBayTypeIfNeeded({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: true,
				hasValidAutoSelection: false,
				hasPendingManualSelection: true
			})

			// THEN it updates stores and clears validation
			expect(didApply).toBe(true)
			expect(bayTypesStore.selectedBayType).toBe('bt-3')
			expect(applyBayTypeSelection).toHaveBeenCalledWith('Bay-3')
			expect(bayStore.assignedBayType).toBe('bt-3')
			expect(bayStore.pendingBayTypeApply).toBeNull()
			expect(equipmentMatchingStore.clearValidationResult).toHaveBeenCalled()
		})

		it('applies when auto selection is valid', () => {
			// GIVEN a valid auto selection
			bayStore.selectedBay = 'Bay-4'
			bayTypesStore.selectedBayType = 'bt-4'

			// WHEN applying the bay type
			const didApply = applyBayTypeIfNeeded({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})

			// THEN it applies successfully
			expect(didApply).toBe(true)
			expect(applyBayTypeSelection).toHaveBeenCalledWith('Bay-4')
			expect(bayStore.assignedBayType).toBe('bt-4')
			expect(bayStore.pendingBayTypeApply).toBeNull()
		})
	})

  describe('generateCommitTitle', () => {
    it('GIVEN didApplyBayType = false WHEN generateCommitTitle THEN return correct title', () => {
			// GIVEN a standard commit title request
			// WHEN the title is generated without applying bay type
			const commitTitle = generateCommitTitle(
				mockLNodes,
				mockFunction.name,
				'targetSied',
				false
			)
			// THEN it uses the base title format
      expect(commitTitle).toBe('Assign XCBR from TestFunction to IED targetSied')
    })

    it('GIVEN didApplyBayType = false WHEN generateCommitTitle THEN return correct title', () => {
			// GIVEN a commit title request with bay type application
			// WHEN the title is generated with bay type applied
			const commitTitle = generateCommitTitle(
				mockLNodes,
				mockFunction.name,
				'targetSied',
				true
			)
			// THEN it includes bay type and bay name placeholders
      expect(commitTitle).toBe('Assign BayType "Unknown" to Bay "Unknown" + Assign XCBR from TestFunction to IED targetSied')
    })
  })
})
