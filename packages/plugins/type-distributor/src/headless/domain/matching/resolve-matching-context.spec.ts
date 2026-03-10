import { describe, it, expect } from 'vitest'
import { resolveMatchingContext } from './resolve-matching-context'
import type { BayType } from '@/headless/common-types'

const bayTypeA: BayType = {
	uuid: 'bt-uuid-A',
	name: 'BayTypeA',
	conductingEquipments: [],
	functions: []
}

const bayTypeB: BayType = {
	uuid: 'bt-uuid-B',
	name: 'BayTypeB',
	conductingEquipments: [],
	functions: []
}

function makeBayElement(): Element {
	const doc = new DOMParser().parseFromString(
		'<Bay name="Bay1"/>',
		'application/xml'
	)
	return doc.documentElement
}

describe('resolveMatchingContext', () => {
	describe('GIVEN valid selection and data', () => {
		it('WHEN both selectedBayTypeUuid and scdBay are provided THEN it returns the matching context', () => {
			const scdBay = makeBayElement()
			const context = resolveMatchingContext({
				selectedBayTypeUuid: 'bt-uuid-A',
				bayTypes: [bayTypeA, bayTypeB],
				scdBay
			})
			expect(context.bayType).toBe(bayTypeA)
			expect(context.scdBay).toBe(scdBay)
		})
	})

	describe('GIVEN no selectedBayTypeUuid', () => {
		it('WHEN selectedBayTypeUuid is null THEN it throws "No BayType selected"', () => {
			expect(() =>
				resolveMatchingContext({
					selectedBayTypeUuid: null,
					bayTypes: [bayTypeA],
					scdBay: makeBayElement()
				})
			).toThrow('No BayType selected')
		})

		it('WHEN selectedBayTypeUuid is undefined THEN it throws "No BayType selected"', () => {
			expect(() =>
				resolveMatchingContext({
					selectedBayTypeUuid: undefined,
					bayTypes: [bayTypeA],
					scdBay: makeBayElement()
				})
			).toThrow('No BayType selected')
		})
	})

	describe('GIVEN an unknown selectedBayTypeUuid', () => {
		it('WHEN the uuid does not match any BayType THEN it throws with the uuid in the message', () => {
			expect(() =>
				resolveMatchingContext({
					selectedBayTypeUuid: 'non-existent',
					bayTypes: [bayTypeA],
					scdBay: makeBayElement()
				})
			).toThrow('BayType "non-existent" not found')
		})
	})

	describe('GIVEN no scdBay', () => {
		it('WHEN scdBay is null THEN it throws "No Bay selected in SCD"', () => {
			expect(() =>
				resolveMatchingContext({
					selectedBayTypeUuid: 'bt-uuid-A',
					bayTypes: [bayTypeA],
					scdBay: null
				})
			).toThrow('No Bay selected in SCD')
		})
	})
})
