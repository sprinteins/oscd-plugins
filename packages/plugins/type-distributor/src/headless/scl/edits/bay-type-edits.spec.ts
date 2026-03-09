import { describe, it, expect, vi, afterEach } from 'vitest'
import {
	buildEditForBayUpdate,
	buildEditsForEquipmentUpdates
} from './bay-type-edits'
import type {
	BayType,
	ConductingEquipmentTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { createTestDocument } from '@/headless/test-helpers'

vi.mock('uuid', () => ({ v4: () => 'mocked-uuid' }))

afterEach(() => {
	vi.restoreAllMocks()
})

const bayType: BayType = {
	uuid: 'bt-uuid',
	name: 'TestBayType',
	conductingEquipments: [],
	functions: []
}

const ceTemplate: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid',
	name: 'Breaker',
	type: 'CBR',
	terminals: [],
	eqFunctions: []
}

function makeEquipmentMatch(xml: string): EquipmentMatch {
	const doc = createTestDocument(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay><ConductingEquipment ${xml}/></Bay></VoltageLevel></Substation></SCL>`
	)
	// biome-ignore lint/style/noNonNullAssertion: test fixture
	const scdElement = doc.querySelector('ConductingEquipment')!
	return {
		scdElement,
		bayTypeEquipment: {
			uuid: 'ce-bt-uuid',
			templateUuid: 'tmpl-uuid',
			virtual: false
		},
		templateEquipment: ceTemplate
	}
}

describe('buildEditForBayUpdate', () => {
	describe('GIVEN a Bay element without an existing uuid', () => {
		it('WHEN called THEN it returns a SetAttributes edit with a new uuid and the bayType uuid', () => {
			const doc = createTestDocument(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay name="Bay1"/></VoltageLevel></Substation></SCL>`
			)
			// biome-ignore lint/style/noNonNullAssertion: test fixture
			const scdBay = doc.querySelector('Bay')!

			const edit = buildEditForBayUpdate(scdBay, bayType)

			expect(edit.element).toBe(scdBay)
			expect(edit.attributes?.templateUuid).toBe('bt-uuid')
			expect(edit.attributes?.uuid).toBe('mocked-uuid')
		})
	})

	describe('GIVEN a Bay element with an existing uuid', () => {
		it('WHEN called THEN it preserves the existing uuid', () => {
			const doc = createTestDocument(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay name="Bay1" uuid="existing-uuid"/></VoltageLevel></Substation></SCL>`
			)
			// biome-ignore lint/style/noNonNullAssertion: test fixture
			const scdBay = doc.querySelector('Bay')!

			const edit = buildEditForBayUpdate(scdBay, bayType)

			expect(edit.attributes?.uuid).toBe('existing-uuid')
		})
	})
})

describe('buildEditsForEquipmentUpdates', () => {
	describe('GIVEN a match without existing uuid and no terminals', () => {
		it('WHEN called THEN it returns one SetAttributes edit with uuid, templateUuid and originUuid', () => {
			const match = makeEquipmentMatch('name="Q1" type="CBR"')

			const edits = buildEditsForEquipmentUpdates([match])

			expect(edits).toHaveLength(1)
			const edit = edits[0] as { attributes: Record<string, string> }
			expect(edit.attributes.uuid).toBe('mocked-uuid')
			expect(edit.attributes.templateUuid).toBe('ce-bt-uuid')
			expect(edit.attributes.originUuid).toBe('tmpl-uuid')
		})
	})

	describe('GIVEN a match with an existing uuid', () => {
		it('WHEN called THEN it preserves the existing uuid', () => {
			const match = makeEquipmentMatch(
				'name="Q1" type="CBR" uuid="existing-eq-uuid"'
			)

			const edits = buildEditsForEquipmentUpdates([match])

			const edit = edits[0] as { attributes: Record<string, string> }
			expect(edit.attributes.uuid).toBe('existing-eq-uuid')
		})
	})

	describe('GIVEN a match with terminals that lack uuids', () => {
		it('WHEN called THEN it produces additional SetAttributes edits for each terminal', () => {
			const doc = createTestDocument(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay>
					<ConductingEquipment name="Q1" type="CBR">
						<Terminal name="T1"/>
						<Terminal name="T2"/>
					</ConductingEquipment>
				</Bay></VoltageLevel></Substation></SCL>`
			)
			// biome-ignore lint/style/noNonNullAssertion: test fixture
			const scdElement = doc.querySelector('ConductingEquipment')!
			const match: EquipmentMatch = {
				scdElement,
				bayTypeEquipment: {
					uuid: 'ce-bt-uuid',
					templateUuid: 'tmpl-uuid',
					virtual: false
				},
				templateEquipment: ceTemplate
			}

			const edits = buildEditsForEquipmentUpdates([match])

			// 1 for the equipment + 2 for the terminals
			expect(edits).toHaveLength(3)
		})
	})

	describe('GIVEN a match with terminals that already have uuids', () => {
		it('WHEN called THEN it does not add extra uuid edits for those terminals', () => {
			const doc = createTestDocument(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay>
					<ConductingEquipment name="Q1" type="CBR">
						<Terminal name="T1" uuid="term-uuid-1"/>
					</ConductingEquipment>
				</Bay></VoltageLevel></Substation></SCL>`
			)
			// biome-ignore lint/style/noNonNullAssertion: test fixture
			const scdElement = doc.querySelector('ConductingEquipment')!
			const match: EquipmentMatch = {
				scdElement,
				bayTypeEquipment: {
					uuid: 'ce-bt-uuid',
					templateUuid: 'tmpl-uuid',
					virtual: false
				},
				templateEquipment: ceTemplate
			}

			const edits = buildEditsForEquipmentUpdates([match])

			// Only the equipment SetAttributes edit, terminal already has uuid
			expect(edits).toHaveLength(1)
		})
	})

	describe('GIVEN an empty matches list', () => {
		it('WHEN called THEN it returns an empty array', () => {
			expect(buildEditsForEquipmentUpdates([])).toHaveLength(0)
		})
	})
})
