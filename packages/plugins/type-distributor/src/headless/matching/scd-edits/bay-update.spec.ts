import { describe, it, expect } from 'vitest'
import { updateBay } from './bay-update'
import type { BayType } from '../../common-types/ssd-types'
import type { SetAttributes } from '@openscd/oscd-api'

describe('updateBay', () => {
	describe('GIVEN an SCD Bay element with existing uuid', () => {
		describe('WHEN updateBay is called', () => {
			it('THEN should preserve the existing uuid', () => {
				//NOTE - When switching BayTypes it should update so this will need to be removed later or put in a different place
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					'<Bay xmlns="http://www.iec.ch/61850/2003/SCL" uuid="existing-uuid-123"></Bay>',
					'application/xml'
				)
				const scdBay = mockDocument.documentElement

				const bayType: BayType = {
					uuid: 'bay-type-uuid-456',
					name: 'TestBay',
					conductingEquipments: [],
					functions: []
				}

				// WHEN
				const result: SetAttributes = updateBay(scdBay, bayType)

				// THEN
				expect(result.element).toBe(scdBay)
				expect(result.attributes?.uuid).toBe('existing-uuid-123')
				expect(result.attributes?.templateUuid).toBe('bay-type-uuid-456')
			})
		})
	})

	describe('GIVEN an SCD Bay element without uuid', () => {
		describe('WHEN updateBay is called', () => {
			it('THEN should generate a new uuid', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					'<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>',
					'application/xml'
				)
				const scdBay = mockDocument.documentElement

				const bayType: BayType = {
					uuid: 'bay-type-uuid-456',
					name: 'TestBay',
					conductingEquipments: [],
					functions: []
				}

				// WHEN
				const result: SetAttributes = updateBay(scdBay, bayType)

				// THEN
				expect(result.element).toBe(scdBay)
				expect(result.attributes?.uuid).toBeTruthy()
				expect(result.attributes?.uuid).toMatch(
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
				)
				expect(result.attributes?.templateUuid).toBe('bay-type-uuid-456')
			})
		})
	})

	describe('GIVEN a BayType with specific uuid', () => {
		describe('WHEN updateBay is called', () => {
			it('THEN should set templateUuid to BayType uuid', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					'<Bay xmlns="http://www.iec.ch/61850/2003/SCL" uuid="bay-uuid"></Bay>',
					'application/xml'
				)
				const scdBay = mockDocument.documentElement

				const bayType: BayType = {
					uuid: 'unique-bay-type-uuid',
					name: 'ProtectionBay',
					desc: 'Protection bay description',
					conductingEquipments: [],
					functions: []
				}

				// WHEN
				const result: SetAttributes = updateBay(scdBay, bayType)

				// THEN
				expect(result.attributes?.templateUuid).toBe(
					'unique-bay-type-uuid'
				)
			})
		})
	})

	describe('GIVEN various bay configurations', () => {
		describe('WHEN updateBay is called', () => {
			it('THEN should always return a SetAttributes object with empty attributesNS', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					'<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>',
					'application/xml'
				)
				const scdBay = mockDocument.documentElement

				const bayType: BayType = {
					uuid: 'bay-type-uuid',
					name: 'TestBay',
					conductingEquipments: [],
					functions: []
				}

				// WHEN
				const result: SetAttributes = updateBay(scdBay, bayType)

				// THEN
				expect(result.attributesNS).toEqual({})
			})

			it('THEN should return correct structure for SetAttributes', () => {
				// GIVEN
				const mockDocument = new DOMParser().parseFromString(
					'<Bay xmlns="http://www.iec.ch/61850/2003/SCL" uuid="bay-123"></Bay>',
					'application/xml'
				)
				const scdBay = mockDocument.documentElement

				const bayType: BayType = {
					uuid: 'type-789',
					name: 'TestBay',
					conductingEquipments: [],
					functions: []
				}

				// WHEN
				const result: SetAttributes = updateBay(scdBay, bayType)

				// THEN
				expect(result).toHaveProperty('element')
				expect(result).toHaveProperty('attributes')
				expect(result).toHaveProperty('attributesNS')
				expect(result.attributes).toHaveProperty('uuid')
				expect(result.attributes).toHaveProperty('templateUuid')
			})
		})
	})
})
