import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	resolveMatchingContext,
	validateEquipmentMatch
} from '@/headless/domain/matching'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { validateBayType } from './validate-bay-type.action'

const mockAssignedLNodesStore = vi.hoisted(() => ({
	hasConnections: false
}))

vi.mock('@/headless/stores', () => ({
	ssdImportStore: {
		selectedBayType: null as string | null,
		bayTypes: [],
		conductingEquipmentTemplates: []
	},
	equipmentMatchingStore: {
		setValidationResult: vi.fn()
	},
	bayStore: {
		scdBay: null,
		assignedBayTypeUuid: null as string | null
	},
	assignedLNodesStore: {
		get hasConnections() {
			return mockAssignedLNodesStore.hasConnections
		}
	}
}))

vi.mock('@/headless/domain/matching', () => ({
	resolveMatchingContext: vi.fn(),
	validateEquipmentMatch: vi.fn()
}))

describe('validateBayType', () => {
	const mockScdBay = document.createElement('Bay')
	const mockBayType = {
		uuid: 'bt-1',
		name: 'TestBayType',
		conductingEquipments: [],
		functions: []
	}

	const mockValidationResult = {
		isValid: true,
		errors: [],
		countMismatchErrors: [],
		requiresManualMatching: false
	}

	beforeEach(() => {
		vi.mocked(resolveMatchingContext).mockReturnValue({
			scdBay: mockScdBay,
			bayType: mockBayType
		})
		vi.mocked(validateEquipmentMatch).mockReturnValue(mockValidationResult)
		vi.mocked(equipmentMatchingStore.setValidationResult).mockReset()

		ssdImportStore.selectedBayType = 'bt-1'
		bayStore.assignedBayTypeUuid = null
		mockAssignedLNodesStore.hasConnections = false
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GIVEN LNode connections exist AND a different bay type is already assigned', () => {
		beforeEach(() => {
			mockAssignedLNodesStore.hasConnections = true
			bayStore.assignedBayTypeUuid = 'bt-2'
			ssdImportStore.selectedBayType = 'bt-1'
		})

		it('WHEN validateBayType is called THEN returns an error result', () => {
			const result = validateBayType()

			expect(result.isValid).toBe(false)
			expect(result.errors).toContain(
				'Cannot change Bay Type - LNode connections exist'
			)
		})

		it('WHEN validateBayType is called THEN does not invoke validateEquipmentMatch', () => {
			validateBayType()

			expect(validateEquipmentMatch).not.toHaveBeenCalled()
		})

		it('WHEN validateBayType is called THEN stores the error result', () => {
			validateBayType()

			expect(
				equipmentMatchingStore.setValidationResult
			).toHaveBeenCalledWith(
				expect.objectContaining({ isValid: false }),
				true
			)
		})
	})

	describe('GIVEN LNode connections exist but the SAME bay type is selected', () => {
		beforeEach(() => {
			mockAssignedLNodesStore.hasConnections = true
			bayStore.assignedBayTypeUuid = 'bt-1'
			ssdImportStore.selectedBayType = 'bt-1'
		})

		it('WHEN validateBayType is called THEN delegates to validateEquipmentMatch', () => {
			validateBayType()

			expect(validateEquipmentMatch).toHaveBeenCalled()
		})
	})

	describe('GIVEN no LNode connections', () => {
		beforeEach(() => {
			mockAssignedLNodesStore.hasConnections = false
		})

		it('WHEN validateBayType is called THEN delegates to validateEquipmentMatch', () => {
			validateBayType()

			expect(validateEquipmentMatch).toHaveBeenCalled()
		})

		it('WHEN validateBayType is called THEN returns the validation result', () => {
			const result = validateBayType()

			expect(result).toEqual(mockValidationResult)
		})

		it('WHEN validateBayType is called THEN stores the validation result', () => {
			validateBayType()

			expect(
				equipmentMatchingStore.setValidationResult
			).toHaveBeenCalledWith(mockValidationResult, true)
		})
	})
})
