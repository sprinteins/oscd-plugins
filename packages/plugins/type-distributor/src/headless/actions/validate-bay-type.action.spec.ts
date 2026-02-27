import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateBayTypeSelection } from './validate-bay-type.action'
import {
	ssdImportStore,
	equipmentMatchingStore,
	bayStore
} from '@/headless/stores'
import type { BayType } from '@/headless/common-types'
import { validateEquipmentMatch } from '@/headless/domain/validation'

vi.mock('@/headless/stores', () => ({
	ssdImportStore: {
		bayTypes: [],
		selectedBayType: null,
		conductingEquipmentTemplates: []
	},
	equipmentMatchingStore: {
		setValidationResult: vi.fn()
	},
	bayStore: {
		scdBay: null,
		assignedBayTypeUuid: null
	},
	assignedLNodesStore: {
		hasConnections: false
	}
}))

vi.mock('@/headless/domain/validation', () => ({
	validateEquipmentMatch: vi.fn()
}))

describe('validateBayTypeSelection', () => {
	let mockScdBay: Element
	let mockBayType: BayType

	beforeEach(() => {
		vi.clearAllMocks()

		mockScdBay = new DOMParser().parseFromString(
			`<Bay xmlns="http://www.iec.ch/61850/2003/SCL" name="Bay1">
				<ConductingEquipment name="CB1" type="CBR"/>
			</Bay>`,
			'application/xml'
		).documentElement

		mockBayType = {
			uuid: 'baytype-uuid-1',
			name: 'BayType1',
			conductingEquipments: [
				{
					uuid: 'ce1',
					templateUuid: 'template1',
					virtual: false
				}
			],
			functions: []
		}
	})

	describe('GIVEN all required data is available', () => {
		describe('WHEN validateBayTypeSelection is called with valid data', () => {
			it('THEN should validate equipment match and update store', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				const mockValidationResult = {
					isValid: true,
					errors: [],
					canAutoMatch: true
				}

				vi.mocked(validateEquipmentMatch).mockReturnValue(
					mockValidationResult
				)

				// WHEN
				const result = validateBayTypeSelection('Bay1')

				// THEN
				expect(validateEquipmentMatch).toHaveBeenCalledWith(
					mockScdBay,
					mockBayType,
					[]
				)
				expect(
					equipmentMatchingStore.setValidationResult
				).toHaveBeenCalledWith(mockValidationResult, true)
				expect(result).toEqual(mockValidationResult)
			})
		})

		describe('WHEN validation fails due to mismatches', () => {
			it('THEN should return validation errors and update store', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				const mockValidationResult = {
					isValid: false,
					errors: [
						'ConductingEquipment type "CBR": SCD has 1, BayType has 2'
					],
					canAutoMatch: false
				}

				vi.mocked(validateEquipmentMatch).mockReturnValue(
					mockValidationResult
				)

				// WHEN
				const result = validateBayTypeSelection('Bay1')

				// THEN
				expect(validateEquipmentMatch).toHaveBeenCalledWith(
					mockScdBay,
					mockBayType,
					[]
				)
				expect(
					equipmentMatchingStore.setValidationResult
				).toHaveBeenCalledWith(mockValidationResult, true)
				expect(result.isValid).toBe(false)
				expect(result.errors).toHaveLength(1)
			})
		})
	})

	describe('GIVEN no BayType is selected', () => {
		describe('WHEN validateBayTypeSelection is called', () => {
			it('THEN should throw error about missing BayType selection', () => {
				// GIVEN
				ssdImportStore.selectedBayType = null
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				// WHEN / THEN
				expect(() => validateBayTypeSelection('Bay1')).toThrow(
					'No BayType selected'
				)
				expect(validateEquipmentMatch).not.toHaveBeenCalled()
				expect(
					equipmentMatchingStore.setValidationResult
				).not.toHaveBeenCalled()
			})
		})
	})

	describe('GIVEN selected BayType does not exist in store', () => {
		describe('WHEN validateBayTypeSelection is called', () => {
			it('THEN should throw error about BayType not found', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'non-existent-uuid'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				// WHEN / THEN
				expect(() => validateBayTypeSelection('Bay1')).toThrow(
					'BayType "non-existent-uuid" not found'
				)
				expect(validateEquipmentMatch).not.toHaveBeenCalled()
				expect(
					equipmentMatchingStore.setValidationResult
				).not.toHaveBeenCalled()
			})
		})
	})

	describe('GIVEN no Bay is selected in SCD', () => {
		describe('WHEN validateBayTypeSelection is called', () => {
			it('THEN should throw error about missing Bay in SCD', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = null

				// WHEN / THEN
				expect(() => validateBayTypeSelection('Bay1')).toThrow(
					'No Bay selected in SCD'
				)
				expect(validateEquipmentMatch).not.toHaveBeenCalled()
				expect(
					equipmentMatchingStore.setValidationResult
				).not.toHaveBeenCalled()
			})
		})
	})

	describe('GIVEN multiple BayTypes in store', () => {
		describe('WHEN correct BayType is selected', () => {
			it('THEN should find and validate the correct BayType', () => {
				// GIVEN
				const secondBayType: BayType = {
					uuid: 'baytype-uuid-2',
					name: 'BayType2',
					conductingEquipments: [],
					functions: []
				}

				ssdImportStore.selectedBayType = 'baytype-uuid-2'
				ssdImportStore.bayTypes = [mockBayType, secondBayType]
				bayStore.scdBay = mockScdBay

				const mockValidationResult = {
					isValid: true,
					errors: [],
					canAutoMatch: true
				}

				vi.mocked(validateEquipmentMatch).mockReturnValue(
					mockValidationResult
				)

				// WHEN
				const result = validateBayTypeSelection('Bay1')

				// THEN
				expect(validateEquipmentMatch).toHaveBeenCalledWith(
					mockScdBay,
					secondBayType,
					[]
				)
				expect(result).toEqual(mockValidationResult)
			})
		})
	})

	describe('GIVEN validation result requires manual matching', () => {
		describe('WHEN ambiguous types are detected', () => {
			it('THEN should return validation result with manual matching flag', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = [mockBayType]
				bayStore.scdBay = mockScdBay

				const mockValidationResult = {
					isValid: false,
					errors: [
						'Manual matching required: Multiple equipment templates with the same type but different names found.'
					],
					requiresManualMatching: true,
					ambiguousTypes: [
						{
							typeCode: 'CBR',
							templateNames: [
								'CircuitBreaker1',
								'CircuitBreaker2'
							]
						}
					],
					canAutoMatch: false
				}

				vi.mocked(validateEquipmentMatch).mockReturnValue(
					mockValidationResult
				)

				// WHEN
				const result = validateBayTypeSelection('Bay1')

				// THEN
				expect(result.requiresManualMatching).toBe(true)
				expect(result.ambiguousTypes).toHaveLength(1)
				expect(
					equipmentMatchingStore.setValidationResult
				).toHaveBeenCalledWith(mockValidationResult, true)
			})
		})
	})

	describe('GIVEN empty bayTypes array', () => {
		describe('WHEN selected BayType UUID is set but array is empty', () => {
			it('THEN should throw error about BayType not found', () => {
				// GIVEN
				ssdImportStore.selectedBayType = 'baytype-uuid-1'
				ssdImportStore.bayTypes = []
				bayStore.scdBay = mockScdBay

				// WHEN / THEN
				expect(() => validateBayTypeSelection('Bay1')).toThrow(
					'BayType "baytype-uuid-1" not found'
				)
			})
		})
	})
})
