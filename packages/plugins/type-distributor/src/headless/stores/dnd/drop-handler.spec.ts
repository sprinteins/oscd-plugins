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
		validationResult: null as null | {
			isValid?: boolean
			requiresManualMatching?: boolean
		},
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
		it('GIVEN state with assigned bay type WHEN shouldApplyBayType THEN returns false', () => {
			// GIVEN
			const state = {
				hasAssignedBayType: true,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			}

			// WHEN
			const result = shouldApplyBayType(state)

			// THEN
			expect(result).toBe(false)
		})

		it('GIVEN state with no bay selected WHEN shouldApplyBayType THEN returns false', () => {
			// GIVEN
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: false,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: true
			}

			// WHEN
			const result = shouldApplyBayType(state)

			// THEN
			expect(result).toBe(false)
		})

		it('GIVEN valid auto selection state WHEN shouldApplyBayType THEN returns true', () => {
			// GIVEN
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			}

			// WHEN
			const result = shouldApplyBayType(state)

			// THEN
			expect(result).toBe(true)
		})

		it('GIVEN pending manual selection state WHEN shouldApplyBayType THEN returns true', () => {
			// GIVEN
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: true,
				hasValidAutoSelection: false,
				hasPendingManualSelection: true
			}

			// WHEN
			const result = shouldApplyBayType(state)

			// THEN
			expect(result).toBe(true)
		})
	})

	describe('getBayTypeApplicationState', () => {
		it('GIVEN selected bay type with valid auto selection WHEN getBayTypeApplicationState THEN derives correct state', () => {
			// GIVEN
			bayTypesStore.selectedBayType = 'bt-1'
			bayStore.assignedBayType = null
			bayStore.selectedBay = 'Bay-1'
			equipmentMatchingStore.validationResult = {
				isValid: true,
				requiresManualMatching: false,
				errors: []
			}

			// WHEN
			const result = getBayTypeApplicationState()

			// THEN
			expect(result).toStrictEqual({
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			})
		})

		it('GIVEN pending manual selection requirement WHEN getBayTypeApplicationState THEN derives correct state', () => {
			// GIVEN
			bayStore.pendingBayTypeApply = 'bt-2'
			bayStore.selectedBay = 'Bay-2'
			equipmentMatchingStore.validationResult = {
				isValid: false,
				requiresManualMatching: true,
				errors: []
			}

			// WHEN
			const result = getBayTypeApplicationState()

			// THEN
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
		it('GIVEN state where bay type should not apply WHEN applyBayTypeIfNeeded THEN returns false', () => {
			// GIVEN
			const state = {
				hasAssignedBayType: true,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			}

			// WHEN
			const didApply = applyBayTypeIfNeeded(state)

			// THEN
			expect(didApply).toBe(false)
			expect(applyBayTypeSelection).not.toHaveBeenCalled()
		})

		it('GIVEN state requires selected bay but store is missing WHEN applyBayTypeIfNeeded THEN throws error', () => {
			// GIVEN
			bayStore.selectedBay = null
			bayStore.pendingBayTypeApply = 'bt-3'
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: true,
				hasValidAutoSelection: false,
				hasPendingManualSelection: true
			}

			// WHEN / THEN
			expect(() => applyBayTypeIfNeeded(state)).toThrowError(
				'[DnD] No bay type selected to apply to bay'
			)
		})

		it('GIVEN pending manual selection WHEN applyBayTypeIfNeeded THEN applies and clears validation', () => {
			// GIVEN
			bayStore.selectedBay = 'Bay-3'
			bayStore.pendingBayTypeApply = 'bt-3'
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: true,
				hasValidAutoSelection: false,
				hasPendingManualSelection: true
			}

			// WHEN
			const didApply = applyBayTypeIfNeeded(state)

			// THEN
			expect(didApply).toBe(true)
			expect(bayTypesStore.selectedBayType).toBe('bt-3')
			expect(applyBayTypeSelection).toHaveBeenCalledWith('Bay-3')
			expect(bayStore.assignedBayType).toBe('bt-3')
			expect(bayStore.pendingBayTypeApply).toBeNull()
			expect(
				equipmentMatchingStore.clearValidationResult
			).toHaveBeenCalled()
		})

		it('GIVEN valid auto selection WHEN applyBayTypeIfNeeded THEN applies successfully', () => {
			// GIVEN
			bayStore.selectedBay = 'Bay-4'
			bayTypesStore.selectedBayType = 'bt-4'
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			}

			// WHEN
			const didApply = applyBayTypeIfNeeded(state)

			// THEN
			expect(didApply).toBe(true)
			expect(applyBayTypeSelection).toHaveBeenCalledWith('Bay-4')
			expect(bayStore.assignedBayType).toBe('bt-4')
			expect(bayStore.pendingBayTypeApply).toBeNull()
		})
	})

	describe('generateCommitTitle', () => {
		it('GIVEN didApplyBayType = false WHEN generateCommitTitle THEN returns base title format', () => {
			// GIVEN
			const didApplyBayType = false

			// WHEN
			const commitTitle = generateCommitTitle(
				mockLNodes,
				mockFunction.name,
				'targetSied',
				didApplyBayType
			)

			// THEN
			expect(commitTitle).toBe(
				'Assign XCBR from TestFunction to IED targetSied'
			)
		})

		it('GIVEN didApplyBayType = true WHEN generateCommitTitle THEN returns title with bay type info', () => {
			// GIVEN
			const didApplyBayType = true

			// WHEN
			const commitTitle = generateCommitTitle(
				mockLNodes,
				mockFunction.name,
				'targetSied',
				didApplyBayType
			)

			// THEN
			expect(commitTitle).toBe(
				'Assign BayType "Unknown" to Bay "Unknown" + Assign XCBR from TestFunction to IED targetSied'
			)
		})
	})
})
