import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BayType, GeneralEquipmentTemplate } from '@/headless/common-types'
import { createTestDocument } from '@/headless/test-helpers'
import { buildInsertsForGeneralEquipment } from './general-equipment-edits'

let uuidCounter = 0
vi.mock('uuid', () => ({
	v4: () => {
		const hex = (uuidCounter++).toString(16).padStart(8, '0')
		return `${hex}-0000-0000-0000-000000000000`
	}
}))

beforeEach(() => {
	uuidCounter = 0
})

afterEach(() => {
	vi.restoreAllMocks()
})

// ─── Fixtures ────────────────────────────────────────────────────────────────

const lnodeTemplate = {
	lnClass: 'GGIO',
	lnType: 'TestGGIO',
	lnInst: '1'
}

const geTemplate: GeneralEquipmentTemplate = {
	uuid: 'ge-tmpl-uuid',
	name: 'Valves_1',
	type: 'VLV',
	eqFunctions: [
		{
			uuid: 'eq-fn-uuid',
			name: 'ValveFn',
			lnodes: [lnodeTemplate]
		}
	]
}

const bayTypeWithGE: BayType = {
	uuid: 'bt-uuid',
	name: 'TestBayType',
	conductingEquipments: [],
	generalEquipments: [{ uuid: 'ge-bt-uuid', templateUuid: 'ge-tmpl-uuid', virtual: false }],
	functions: []
}

const bayTypeNoGE: BayType = {
	uuid: 'bt-empty-uuid',
	name: 'EmptyBayType',
	conductingEquipments: [],
	generalEquipments: [],
	functions: []
}

function makeScdBay(inner = ''): { doc: Document; scdBay: Element } {
	const doc = createTestDocument(
		`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation><VoltageLevel><Bay name="Bay1">${inner}</Bay></VoltageLevel></Substation></SCL>`
	)
	// biome-ignore lint/style/noNonNullAssertion: test fixture
	const scdBay = doc.querySelector('Bay')!
	return { doc, scdBay }
}

// ─── buildInsertsForGeneralEquipment ─────────────────────────────────────────

describe('buildInsertsForGeneralEquipment', () => {
	describe('GIVEN a bayType with one GeneralEquipment whose template is found', () => {
		it('WHEN called THEN returns one Insert edit for the GeneralEquipment element with EqFunction children', () => {
			const { doc, scdBay } = makeScdBay()

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: bayTypeWithGE,
				scdBay,
				generalEquipmentTemplates: [geTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const insert = edits[0]
			expect(insert.parent).toBe(scdBay)

			const ge = insert.node as Element
			expect(ge.tagName).toBe('GeneralEquipment')
			expect(ge.getAttribute('name')).toBe('Valves_1')
			expect(ge.getAttribute('type')).toBe('VLV')
			expect(ge.getAttribute('templateUuid')).toBe('ge-bt-uuid')
			expect(ge.getAttribute('originUuid')).toBe('ge-tmpl-uuid')

			const eqFunctions = ge.querySelectorAll('EqFunction')
			expect(eqFunctions).toHaveLength(1)
			expect(eqFunctions[0].getAttribute('name')).toBe('ValveFn')

			const lnodes = eqFunctions[0].querySelectorAll('LNode')
			expect(lnodes).toHaveLength(1)
		})
	})

	describe('GIVEN a bayType with GeneralEquipment whose template is NOT found', () => {
		it('WHEN called THEN warns and returns an empty array', () => {
			const warnSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {})
			const { doc, scdBay } = makeScdBay()

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: bayTypeWithGE,
				scdBay,
				generalEquipmentTemplates: [],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(0)
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining('ge-tmpl-uuid')
			)
		})
	})

	it('GIVEN a bayType with no GeneralEquipment WHEN called THEN returns empty array', () => {
		const { doc, scdBay } = makeScdBay()

		const edits = buildInsertsForGeneralEquipment({
			doc,
			bayType: bayTypeNoGE,
			scdBay,
			generalEquipmentTemplates: [geTemplate],
			existingPrefixes: new Set()
		})

		expect(edits).toHaveLength(0)
	})

	describe('GIVEN a bay with a ConnectivityNode', () => {
		it('WHEN called THEN inserts before the ConnectivityNode', () => {
			const { doc, scdBay } = makeScdBay(
				'<ConnectivityNode name="CN1" pathName="Sub/VL/Bay1/CN1"/>'
			)
			const connectivityNode = scdBay.querySelector('ConnectivityNode')

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: bayTypeWithGE,
				scdBay,
				generalEquipmentTemplates: [geTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			expect(edits[0].reference).toBe(connectivityNode)
		})
	})

	describe('GIVEN a GeneralEquipment template with desc', () => {
		it('WHEN called THEN the GeneralEquipment element has the desc attribute', () => {
			const { doc, scdBay } = makeScdBay()
			const templateWithDesc: GeneralEquipmentTemplate = {
				...geTemplate,
				desc: 'A valve description'
			}

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: bayTypeWithGE,
				scdBay,
				generalEquipmentTemplates: [templateWithDesc],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const ge = edits[0].node as Element
			expect(ge.getAttribute('desc')).toBe('A valve description')
		})
	})
})
