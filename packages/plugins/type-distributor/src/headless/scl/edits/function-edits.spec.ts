import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
	BayType,
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { createTestDocument } from '@/headless/test-helpers'
import {
	buildInsertsForEqFunction,
	buildInsertsForFunction
} from './function-edits'

vi.mock('uuid', () => ({ v4: () => 'mocked-uuid' }))

afterEach(() => {
	vi.restoreAllMocks()
})

// ─── Fixtures ────────────────────────────────────────────────────────────────

const lnodeTemplate = {
	lnClass: 'XCBR',
	lnType: 'TestXCBR',
	lnInst: '1'
}

const funcTemplate: FunctionTemplate = {
	uuid: 'fn-tmpl-uuid',
	name: 'CBFunction',
	lnodes: [lnodeTemplate]
}

const bayType: BayType = {
	uuid: 'bt-uuid',
	name: 'TestBayType',
	conductingEquipments: [],
	generalEquipments: [],
	functions: [{ uuid: 'fn-bt-uuid', templateUuid: 'fn-tmpl-uuid' }]
}

const ceTemplate: ConductingEquipmentTemplate = {
	uuid: 'tmpl-uuid',
	name: 'Breaker',
	type: 'CBR',
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfn-uuid',
			name: 'Protection',
			lnodes: [lnodeTemplate]
		}
	]
}

function makeScdBay(inner = ''): { doc: Document; scdBay: Element } {
	const doc = createTestDocument(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay name="Bay1">${inner}</Bay></VoltageLevel></Substation></SCL>`
	)
	// biome-ignore lint/style/noNonNullAssertion: test fixture
	const scdBay = doc.querySelector('Bay')!
	return { doc, scdBay }
}

// ─── buildInsertsForFunction ──────────────────────────────────────────────────

describe('buildInsertsForFunction', () => {
	describe('GIVEN a bayType with one function whose template is found', () => {
		it('WHEN called THEN it returns one Insert edit for the Function element containing LNode children', () => {
			const { doc, scdBay } = makeScdBay()

			const edits = buildInsertsForFunction({
				doc,
				bayType,
				scdBay,
				functionTemplates: [funcTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const insert = edits[0]
			expect(insert.parent).toBe(scdBay)
			const funcEl = insert.node as Element
			expect(funcEl.tagName).toBe('Function')
			expect(funcEl.getAttribute('name')).toBe('CBFunction')
			expect(funcEl.getAttribute('templateUuid')).toBe('fn-bt-uuid')
			expect(funcEl.getAttribute('originUuid')).toBe('fn-tmpl-uuid')
			expect(funcEl.querySelectorAll('LNode').length).toBe(1)
		})

		it('WHEN the bay has a ConnectivityNode THEN Insert uses it as reference', () => {
			const { doc, scdBay } = makeScdBay('<ConnectivityNode name="CN1"/>')

			const edits = buildInsertsForFunction({
				doc,
				bayType,
				scdBay,
				functionTemplates: [funcTemplate],
				existingPrefixes: new Set()
			})

			expect(edits[0].reference).not.toBeNull()
		})
	})

	describe('GIVEN a bayType with a function whose template is missing', () => {
		it('WHEN called THEN it skips that function and returns no edits', () => {
			const { doc, scdBay } = makeScdBay()

			const edits = buildInsertsForFunction({
				doc,
				bayType,
				scdBay,
				functionTemplates: [],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(0)
		})
	})

	describe('GIVEN a bayType with no functions', () => {
		it('WHEN called THEN it returns an empty array', () => {
			const { doc, scdBay } = makeScdBay()

			const edits = buildInsertsForFunction({
				doc,
				bayType: { ...bayType, functions: [] },
				scdBay,
				functionTemplates: [funcTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(0)
		})
	})
})

// ─── buildInsertsForEqFunction ────────────────────────────────────────────────

describe('buildInsertsForEqFunction', () => {
	describe('GIVEN a match with one eqFunction containing a lnode', () => {
		it('WHEN called THEN it creates an EqFunction element with an LNode child', () => {
			const doc = createTestDocument(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay>
					<ConductingEquipment name="Q1" type="CBR"/>
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

			const edits = buildInsertsForEqFunction({
				doc,
				matches: [match],
				prefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const insert = edits[0]
			expect(insert.parent).toBe(scdElement)
			const eqFuncEl = insert.node as Element
			expect(eqFuncEl.tagName).toBe('EqFunction')
			expect(eqFuncEl.getAttribute('name')).toBe('Protection')
			expect(eqFuncEl.querySelectorAll('LNode').length).toBe(1)
		})
	})

	describe('GIVEN a match with no eqFunctions', () => {
		it('WHEN called THEN it returns an empty array', () => {
			const doc = createTestDocument(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay>
					<ConductingEquipment name="Q1" type="CBR"/>
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
				templateEquipment: { ...ceTemplate, eqFunctions: [] }
			}

			const edits = buildInsertsForEqFunction({
				doc,
				matches: [match],
				prefixes: new Set()
			})

			expect(edits).toHaveLength(0)
		})
	})

	describe('GIVEN an empty matches list', () => {
		it('WHEN called THEN it returns an empty array', () => {
			const doc = createTestDocument('<SCL/>')
			expect(
				buildInsertsForEqFunction({
					doc,
					matches: [],
					prefixes: new Set()
				})
			).toHaveLength(0)
		})
	})
})
