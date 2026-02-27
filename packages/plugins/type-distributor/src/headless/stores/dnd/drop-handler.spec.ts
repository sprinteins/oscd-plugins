import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	applyBayType,
	generateCommitTitle,
	getBayTypeApplicationState,
	shouldApplyBayType
} from './drop-handler'
import { ssdImportStore } from '../ssd-import.store.svelte'
import { getBayTypeWithTemplates } from '../bay-types.utils'
import { bayStore } from '../bay.store.svelte'
import { equipmentMatchingStore } from '../equipment-matching.store.svelte'
import { applyBayTypeSelection } from '@/headless/matching'

vi.mock('../ssd-import.store.svelte', () => ({
	ssdImportStore: {
		selectedBayType: null as string | null
	}
}))

vi.mock('../bay-types.utils', () => ({
	getBayTypeWithTemplates: vi.fn()
}))

vi.mock('../bay.store.svelte', () => ({
	bayStore: {
		assignedBayTypeUuid: null as string | null,
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
		reset: vi.fn()
	}
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

vi.mock('@/headless/matching', () => ({
	applyBayTypeSelection: vi.fn().mockReturnValue([])
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
			ldInst: 'LD0'
		}
	]
	const mockFunction = {
		uuid: 'func-uuid',
		name: 'TestFunction',
		lnodes: mockLNodes
	}

	beforeEach(() => {
		ssdImportStore.selectedBayType = null
		bayStore.assignedBayTypeUuid = null
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
			ssdImportStore.selectedBayType = 'bt-1'
			bayStore.assignedBayTypeUuid = null
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

	describe('applyBayType', () => {
		it('GIVEN state requires selected bay but store is missing WHEN applyBayType THEN throws error', () => {
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
			expect(() => applyBayType(state)).toThrowError(
				'[DnD] No bay type selected to apply to bay'
			)
		})

		it('GIVEN pending manual selection WHEN applyBayType THEN applies and clears validation', () => {
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
			const matches = applyBayType(state)

			// THEN
			expect(matches).toEqual(expect.any(Array))
			expect(ssdImportStore.selectedBayType).toBe('bt-3')
			expect(applyBayTypeSelection).toHaveBeenCalledWith('Bay-3')
			expect(bayStore.pendingBayTypeApply).toBeNull()
			expect(
				equipmentMatchingStore.reset
			).toHaveBeenCalled()
		})

		it('GIVEN valid auto selection WHEN applyBayType THEN applies successfully', () => {
			// GIVEN
			bayStore.selectedBay = 'Bay-4'
			ssdImportStore.selectedBayType = 'bt-4'
			const state = {
				hasAssignedBayType: false,
				hasSelectedBay: true,
				requiresManualMatching: false,
				hasValidAutoSelection: true,
				hasPendingManualSelection: false
			}

			// WHEN
			const matches = applyBayType(state)

			// THEN
			expect(matches).toEqual(expect.any(Array))
			expect(applyBayTypeSelection).toHaveBeenCalledWith('Bay-4')
			expect(bayStore.pendingBayTypeApply).toBeNull()
		})
	})

	describe('generateCommitTitle', () => {
		it('GIVEN didApplyBayType is false WHEN generateCommitTitle THEN returns base title format', () => {
			// GIVEN
			const didApplyBayType = false

			// WHEN
			const commitTitle = generateCommitTitle({
				lNodes: mockLNodes,
				functionName: mockFunction.name,
				targetSIedName: 'targetSied',
				didApplyBayType
			})

			// THEN
			expect(commitTitle).toBe(
				'Assign XCBR from TestFunction to IED targetSied'
			)
		})

		it('GIVEN didApplyBayType is true WHEN generateCommitTitle THEN returns title with bay type info', () => {
			// GIVEN
			const didApplyBayType = true

			// WHEN
			const commitTitle = generateCommitTitle({
				lNodes: mockLNodes,
				functionName: mockFunction.name,
				targetSIedName: 'targetSied',
				didApplyBayType
			})

			// THEN
			expect(commitTitle).toBe(
				'Assign BayType "Unknown" to Bay "Unknown" + Assign XCBR from TestFunction to IED targetSied'
			)
		})
	})
})
