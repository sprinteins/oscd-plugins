import { describe, it, expect } from 'vitest'
import {
	getScdEquipmentMatchKey,
	matchEquipmentForInitialApply,
	matchEquipmentForPersistedBay
} from './match-equipment'
import type {
	BayType,
	ConductingEquipmentTemplate
} from '@/headless/common-types'
import { createTestDocument } from '@/headless/test-helpers'

const ceTemplate1: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid-1',
	name: 'Breaker',
	type: 'CBR',
	terminals: [],
	eqFunctions: []
}

const ceTemplate2: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid-2',
	name: 'Switch',
	type: 'DIS',
	terminals: [],
	eqFunctions: []
}

const conductingEquipmentTemplates = [ceTemplate1, ceTemplate2]

const bayType: BayType = {
	uuid: 'bt-uuid-1',
	name: 'TestBayType',
	conductingEquipments: [
		{ uuid: 'ce-bt-1', templateUuid: 'tmpl-uuid-1', virtual: false },
		{ uuid: 'ce-bt-2', templateUuid: 'tmpl-uuid-2', virtual: false }
	],
	functions: []
}

function makeScdBay(xml: string): Element {
	const doc = createTestDocument(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay name="Bay1">${xml}</Bay></VoltageLevel></Substation></SCL>`
	)
	// biome-ignore lint/style/noNonNullAssertion: test fixture
	return doc.querySelector('Bay')!
}

describe('getScdEquipmentMatchKey', () => {
	it('WHEN element has a uuid THEN returns the uuid', () => {
		const doc = createTestDocument(
			'<ConductingEquipment uuid="elem-uuid" name="Breaker1"/>'
		)
		expect(getScdEquipmentMatchKey(doc.documentElement, 0)).toBe(
			'elem-uuid'
		)
	})

	it('WHEN element has no uuid but has a name THEN returns the name', () => {
		const doc = createTestDocument('<ConductingEquipment name="Breaker1"/>')
		expect(getScdEquipmentMatchKey(doc.documentElement, 0)).toBe('Breaker1')
	})

	it('WHEN element has neither uuid nor name THEN returns index-based key', () => {
		const doc = createTestDocument('<ConductingEquipment/>')
		expect(getScdEquipmentMatchKey(doc.documentElement, 3)).toBe('index:3')
	})
})

describe('matchEquipmentForInitialApply', () => {
	describe('GIVEN a bay with equipment that have templateUuid attributes', () => {
		it('WHEN templateUuid matches BayType equipment THEN it returns a match', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR" templateUuid="ce-bt-1"/>`
			)

			const matches = matchEquipmentForInitialApply({
				scdBay,
				bayType,
				conductingEquipmentTemplates
			})

			expect(matches).toHaveLength(1)
			expect(matches[0].bayTypeEquipment.uuid).toBe('ce-bt-1')
			expect(matches[0].templateEquipment).toBe(ceTemplate1)
		})

		it('WHEN no templateUuid is present THEN falls through to type-based matching', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR"/>`
			)

			const matches = matchEquipmentForInitialApply({
				scdBay,
				bayType,
				conductingEquipmentTemplates
			})

			expect(matches).toHaveLength(1)
			expect(matches[0].templateEquipment.type).toBe('CBR')
		})
	})

	describe('GIVEN manual matches are provided', () => {
		it('WHEN a manual match maps to a valid template uuid THEN it uses that mapping', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR"/>`
			)
			const manualMatches = new Map([['Q1', 'tmpl-uuid-1']])

			const matches = matchEquipmentForInitialApply({
				scdBay,
				bayType,
				conductingEquipmentTemplates,
				manualMatches
			})

			expect(matches).toHaveLength(1)
			expect(matches[0].templateEquipment).toBe(ceTemplate1)
		})

		it('WHEN a manual match references a non-existent template THEN it throws', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR"/>`
			)
			const manualMatches = new Map([['Q1', 'tmpl-uuid-GHOST']])

			expect(() =>
				matchEquipmentForInitialApply({
					scdBay,
					bayType,
					conductingEquipmentTemplates,
					manualMatches
				})
			).toThrow()
		})
	})

	describe('GIVEN no matching bayType equipment by type', () => {
		it('WHEN type-based fallback also fails THEN it throws', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CAP"/>`
			)

			expect(() =>
				matchEquipmentForInitialApply({
					scdBay,
					bayType,
					conductingEquipmentTemplates
				})
			).toThrow(/No matching BayType equipment/)
		})
	})

	describe('GIVEN an empty bay', () => {
		it('WHEN there are no ConductingEquipment children THEN it returns an empty array', () => {
			const scdBay = makeScdBay('')

			const matches = matchEquipmentForInitialApply({
				scdBay,
				bayType,
				conductingEquipmentTemplates
			})

			expect(matches).toHaveLength(0)
		})
	})
})

describe('matchEquipmentForPersistedBay', () => {
	describe('GIVEN equipment with valid templateUuid attributes', () => {
		it('WHEN all equipment have matching templateUuids THEN it returns all matches', () => {
			const scdBay = makeScdBay(`
				<ConductingEquipment name="Q1" type="CBR" templateUuid="ce-bt-1"/>
				<ConductingEquipment name="Q2" type="DIS" templateUuid="ce-bt-2"/>
			`)

			const matches = matchEquipmentForPersistedBay({
				scdBay,
				bayType,
				conductingEquipmentTemplates
			})

			expect(matches).toHaveLength(2)
			expect(matches[0].bayTypeEquipment.uuid).toBe('ce-bt-1')
			expect(matches[1].bayTypeEquipment.uuid).toBe('ce-bt-2')
		})
	})

	describe('GIVEN equipment with a missing templateUuid', () => {
		it('WHEN templateUuid attribute is absent THEN it throws', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR"/>`
			)

			expect(() =>
				matchEquipmentForPersistedBay({
					scdBay,
					bayType,
					conductingEquipmentTemplates
				})
			).toThrow(/Missing templateUuid/)
		})
	})

	describe('GIVEN equipment with an unknown templateUuid', () => {
		it('WHEN templateUuid does not exist in BayType THEN it throws', () => {
			const scdBay = makeScdBay(
				`<ConductingEquipment name="Q1" type="CBR" templateUuid="ce-bt-GHOST"/>`
			)

			expect(() =>
				matchEquipmentForPersistedBay({
					scdBay,
					bayType,
					conductingEquipmentTemplates
				})
			).toThrow(/No matching BayType equipment/)
		})
	})
})
