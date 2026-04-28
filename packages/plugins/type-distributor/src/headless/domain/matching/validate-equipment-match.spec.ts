import { describe, expect, it } from 'vitest'
import type {
	BayType,
	ConductingEquipmentTemplate
} from '@/headless/common-types'
import { createTestDocument } from '@/headless/test-helpers'
import { validateEquipmentMatch } from './validate-equipment-match'

const ceTemplate1: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid-1',
	name: 'Breaker',
	virtual: false,
	type: 'CBR',
	terminals: [],
	eqFunctions: []
}

const ceTemplate2: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid-2',
	virtual: false,
	name: 'Switch',
	type: 'DIS',
	terminals: [],
	eqFunctions: []
}

const ceTemplateCBR2: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid-3',
	name: 'AnotherBreaker',
	type: 'CBR',
	virtual: false,
	terminals: [],
	eqFunctions: []
}

function makeBayType(
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
): BayType {
	return {
		uuid: 'bt-uuid',
		name: 'TestBayType',
		conductingEquipments: conductingEquipmentTemplates.map((t) => ({
			uuid: `ce-bt-${t.uuid}`,
			templateUuid: t.uuid,
			virtual: false
		})),
		generalEquipments: [],
		functions: []
	}
}

function makeScdBay(equipmentXml: string): Element {
	const doc = createTestDocument(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay name="Bay1">${equipmentXml}</Bay></VoltageLevel></Substation></SCL>`
	)
	// biome-ignore lint/style/noNonNullAssertion: test fixture
	return doc.querySelector('Bay')!
}

describe('validateEquipmentMatch', () => {
	describe('GIVEN a perfect count match with unambiguous types', () => {
		it('WHEN SCD and BayType have the same equipment counts per type THEN isValid is true and canAutoMatch is true', () => {
			const scdBay = makeScdBay(`
				<ConductingEquipment name="Q1" type="CBR"/>
				<ConductingEquipment name="Q2" type="DIS"/>
			`)
			const bayType = makeBayType([ceTemplate1, ceTemplate2])

			const result = validateEquipmentMatch({
				scdBay,
				bayType,
				conductingEquipmentTemplates: [ceTemplate1, ceTemplate2]
			})

			expect(result.isValid).toBe(true)
			expect(result.canAutoMatch).toBe(true)
			expect(result.countMismatchErrors).toHaveLength(0)
		})
	})

	describe('GIVEN a count mismatch', () => {
		it('WHEN SCD has more equipment of a type than BayType THEN isValid is false with mismatch errors', () => {
			const scdBay = makeScdBay(`
				<ConductingEquipment name="Q1" type="CBR"/>
				<ConductingEquipment name="Q2" type="CBR"/>
			`)
			const bayType = makeBayType([ceTemplate1])

			const result = validateEquipmentMatch({
				scdBay,
				bayType,
				conductingEquipmentTemplates: [ceTemplate1]
			})

			expect(result.isValid).toBe(false)
			expect(result.countMismatchErrors?.length).toBeGreaterThan(0)
			expect(result.countMismatchErrors?.[0]).toContain('CBR')
		})

		it('WHEN BayType has a type not present in SCD THEN isValid is false with a missing-in-SCD error', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR"/>`
			)
			const bayType = makeBayType([ceTemplate1, ceTemplate2])

			const result = validateEquipmentMatch({
				scdBay,
				bayType,
				conductingEquipmentTemplates: [ceTemplate1, ceTemplate2]
			})

			expect(result.isValid).toBe(false)
			expect(
				result.countMismatchErrors?.some((e) => e.includes('DIS'))
			).toBe(true)
		})
	})

	describe('GIVEN ambiguous types (same type, different names)', () => {
		it('WHEN two templates share a type but have different names THEN requiresManualMatching is true', () => {
			const scdBay = makeScdBay(`
				<ConductingEquipment name="Q1" type="CBR"/>
				<ConductingEquipment name="Q2" type="CBR"/>
			`)
			const bayType = makeBayType([ceTemplate1, ceTemplateCBR2])

			const result = validateEquipmentMatch({
				scdBay,
				bayType,
				conductingEquipmentTemplates: [ceTemplate1, ceTemplateCBR2]
			})

			expect(result.isValid).toBe(false)
			expect(result.requiresManualMatching).toBe(true)
			expect(result.ambiguousTypes).toBeDefined()
			expect(result.ambiguousTypes?.length).toBeGreaterThan(0)
			expect(result.ambiguousTypes?.[0].typeCode).toBe('CBR')
			expect(result.canAutoMatch).toBe(false)
		})
	})

	describe('GIVEN a bayType with no equipment', () => {
		it('WHEN SCD bay also has no equipment THEN isValid is true', () => {
			const scdBay = makeScdBay('')
			const bayType = makeBayType([])

			const result = validateEquipmentMatch({
				scdBay,
				bayType,
				conductingEquipmentTemplates: []
			})

			expect(result.isValid).toBe(true)
		})
	})
})
