import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateEquipmentMatch } from './validation'
import type { BayType, ConductingEquipmentTemplate } from '@/headless/types'
import { ssdImportStore } from '@/headless/stores'

vi.mock('@/headless/stores', () => ({
	ssdImportStore: {
		getConductingEquipmentTemplate: vi.fn(),
		bayTypes: []
	},
	bayTypesStore: {},
	equipmentMatchingStore: {},
	bayStore: {}
}))

const parseBay = (xml: string): Element =>
	new DOMParser().parseFromString(xml, 'application/xml').documentElement

const createBayType = (
	conductingEquipments: Array<{
		uuid: string
		templateUuid: string
		virtual?: boolean
	}>
): BayType => ({
	uuid: 'bay1',
	name: 'BayType1',
	conductingEquipments: conductingEquipments.map((equipment) => ({
		...equipment,
		virtual: equipment.virtual ?? false
	})),
	functions: []
})

const createTemplate = (
	uuid: string,
	type: string,
	name: string
): ConductingEquipmentTemplate => ({
	uuid,
	type,
	name,
	terminals: [],
	eqFunctions: []
})

const mockTemplates = (templates: ConductingEquipmentTemplate[]): void => {
	const byUuid = new Map(
		templates.map((template) => [template.uuid, template])
	)
	vi.mocked(ssdImportStore.getConductingEquipmentTemplate).mockImplementation(
		(uuid: string): ConductingEquipmentTemplate | undefined =>
			byUuid.get(uuid)
	)
}

describe('validation', () => {
	describe('validateEquipmentMatch', () => {
		let scdBay: Element
		let bayType: BayType

		beforeEach(() => {
			vi.clearAllMocks()
		})

		describe('GIVEN a perfect match between SCD and BayType', () => {
			describe('WHEN both have identical ConductingEquipment types and counts', () => {
				it('THEN should return valid result with no errors', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="DS1" type="DIS"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'DIS', 'DS1')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(true)
					expect(result.errors).toEqual([])
					expect(result.canAutoMatch).toBe(true)
					expect(result.requiresManualMatching).toBeUndefined()
				})
			})
		})

		describe('GIVEN mismatched counts between SCD and BayType', () => {
			describe('WHEN SCD has more equipment than BayType', () => {
				it('THEN should return invalid result with count mismatch error', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="CB2" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'CBR', 'CB2')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.errors).toContain(
						'ConductingEquipment type "CBR": SCD has 2, BayType has 1'
					)
					expect(result.canAutoMatch).toBe(false)
				})
			})

			describe('WHEN SCD has fewer equipment than BayType', () => {
				it('THEN should return invalid result with count mismatch error', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'CBR', 'CB2')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.errors).toContain(
						'ConductingEquipment type "CBR": SCD has 1, BayType has 2'
					)
					expect(result.canAutoMatch).toBe(false)
				})
			})
		})

		describe('GIVEN missing equipment types', () => {
			describe('WHEN BayType has a type not present in SCD', () => {
				it('THEN should return error about missing type in SCD', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'DIS', 'DS1')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.errors).toContain(
						'ConductingEquipment type "DIS": Missing in SCD (BayType has 1)'
					)
					expect(result.canAutoMatch).toBe(false)
				})
			})
		})

		describe('GIVEN ambiguous types in BayType templates', () => {
			describe('WHEN same type has different template names', () => {
				it('THEN should return invalid result with manual matching required', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="CB2" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CircuitBreaker1'),
						createTemplate('template2', 'CBR', 'CircuitBreaker2')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.requiresManualMatching).toBe(true)
					expect(result.canAutoMatch).toBe(false)
					expect(result.errors).toContain(
						'Manual matching required: Multiple equipment templates with the same type but different names found.'
					)
					expect(result.ambiguousTypes).toEqual([
						{
							typeCode: 'CBR',
							templateNames: [
								'CircuitBreaker1',
								'CircuitBreaker2'
							]
						}
					])
				})
			})

			describe('WHEN ambiguous types exist with count mismatches', () => {
				it('THEN should return both ambiguous type error and count mismatch errors', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="CB2" type="CBR"/>
							<ConductingEquipment name="CB3" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CircuitBreaker1'),
						createTemplate('template2', 'CBR', 'CircuitBreaker2')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.requiresManualMatching).toBe(true)
					expect(result.errors).toContain(
						'Manual matching required: Multiple equipment templates with the same type but different names found.'
					)
					expect(result.errors).toContain(
						'ConductingEquipment type "CBR": SCD has 3, BayType has 2'
					)
				})
			})

			describe('WHEN same type has same template names', () => {
				it('THEN should not detect ambiguous types and validate normally', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="CB2" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CircuitBreaker'),
						createTemplate('template2', 'CBR', 'CircuitBreaker')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(true)
					expect(result.requiresManualMatching).toBeUndefined()
					expect(result.canAutoMatch).toBe(true)
					expect(result.ambiguousTypes).toBeUndefined()
				})
			})
		})

		describe('GIVEN multiple equipment types', () => {
			describe('WHEN validation succeeds for all types', () => {
				it('THEN should return valid result', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="DS1" type="DIS"/>
							<ConductingEquipment name="DS2" type="DIS"/>
							<ConductingEquipment name="CT1" type="CTR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' },
						{ uuid: 'ce3', templateUuid: 'template3' },
						{ uuid: 'ce4', templateUuid: 'template4' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'DIS', 'Disconnector'),
						createTemplate('template3', 'DIS', 'Disconnector'),
						createTemplate('template4', 'CTR', 'CT1')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(true)
					expect(result.errors).toEqual([])
					expect(result.canAutoMatch).toBe(true)
				})
			})

			describe('WHEN validation fails for multiple types', () => {
				it('THEN should return errors for all mismatched types', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="DS1" type="DIS"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' },
						{ uuid: 'ce3', templateUuid: 'template3' },
						{ uuid: 'ce4', templateUuid: 'template4' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'CBR', 'CB2'),
						createTemplate('template3', 'DIS', 'DS1'),
						createTemplate('template4', 'CTR', 'CT1')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.errors).toContain(
						'ConductingEquipment type "CBR": SCD has 1, BayType has 2'
					)
					expect(result.errors).toContain(
						'ConductingEquipment type "CTR": Missing in SCD (BayType has 1)'
					)
					expect(result.canAutoMatch).toBe(false)
				})
			})
		})

		describe('GIVEN BayType with template references that cannot be resolved', () => {
			describe('WHEN template lookup returns undefined', () => {
				it('THEN should filter out unresolved templates and validate remaining equipment', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'invalid-template' }
					])

					mockTemplates([createTemplate('template1', 'CBR', 'CB1')])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(true)
					expect(result.errors).toEqual([])
					expect(result.canAutoMatch).toBe(true)
				})
			})
		})

		describe('GIVEN empty SCD Bay', () => {
			describe('WHEN SCD has no ConductingEquipment', () => {
				it('THEN should return errors for all BayType equipment', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					mockTemplates([
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'DIS', 'DS1')
					])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(false)
					expect(result.errors).toContain(
						'ConductingEquipment type "CBR": Missing in SCD (BayType has 1)'
					)
					expect(result.errors).toContain(
						'ConductingEquipment type "DIS": Missing in SCD (BayType has 1)'
					)
				})
			})
		})

		describe('GIVEN empty BayType', () => {
			describe('WHEN BayType has no conductingEquipments', () => {
				it('THEN should return valid result if SCD also has no equipment', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>`
					)

					bayType = createBayType([])

					// WHEN
					const result = validateEquipmentMatch(scdBay, bayType)

					// THEN
					expect(result.isValid).toBe(true)
					expect(result.errors).toEqual([])
					expect(result.canAutoMatch).toBe(true)
				})
			})
		})
	})
})
