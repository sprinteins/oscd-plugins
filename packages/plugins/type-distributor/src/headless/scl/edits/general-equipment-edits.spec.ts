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
	generalEquipments: [
		{ uuid: 'ge-bt-uuid', templateUuid: 'ge-tmpl-uuid', virtual: undefined }
	],
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

	describe('GIVEN a GeneralEquipment instance with virtual=true', () => {
		it('WHEN called THEN the GeneralEquipment element has virtual="true"', () => {
			const { doc, scdBay } = makeScdBay()
			const virtualBayType: BayType = {
				...bayTypeWithGE,
				generalEquipments: [
					{
						uuid: 'ge-bt-uuid',
						templateUuid: 'ge-tmpl-uuid',
						virtual: true
					}
				]
			}

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: virtualBayType,
				scdBay,
				generalEquipmentTemplates: [geTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const ge = edits[0].node as Element
			expect(ge.getAttribute('virtual')).toBe('true')
		})
	})

	describe('GIVEN a GeneralEquipment instance with virtual=false explicitly', () => {
		it('WHEN called THEN virtual="false" is written explicitly', () => {
			const { doc, scdBay } = makeScdBay()
			const explicitFalseBayType: BayType = {
				...bayTypeWithGE,
				generalEquipments: [
					{
						uuid: 'ge-bt-uuid',
						templateUuid: 'ge-tmpl-uuid',
						virtual: false
					}
				]
			}

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: explicitFalseBayType,
				scdBay,
				generalEquipmentTemplates: [geTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const ge = edits[0].node as Element
			expect(ge.getAttribute('virtual')).toBe('false')
		})
	})

	describe('GIVEN a GeneralEquipment template with virtual=true and instance with no virtual', () => {
		it('WHEN called THEN the GeneralEquipment element has virtual="true" (template default used)', () => {
			const { doc, scdBay } = makeScdBay()
			const virtualTemplate: GeneralEquipmentTemplate = {
				...geTemplate,
				virtual: true
			}

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: bayTypeWithGE,
				scdBay,
				generalEquipmentTemplates: [virtualTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const ge = edits[0].node as Element
			expect(ge.getAttribute('virtual')).toBe('true')
		})
	})

	describe('GIVEN a GeneralEquipment template with virtual=true and instance with virtual=false', () => {
		it('WHEN called THEN virtual="false" is written (instance overrides template)', () => {
			const { doc, scdBay } = makeScdBay()
			const virtualTemplate: GeneralEquipmentTemplate = {
				...geTemplate,
				virtual: true
			}
			const overrideBayType: BayType = {
				...bayTypeWithGE,
				generalEquipments: [
					{
						uuid: 'ge-bt-uuid',
						templateUuid: 'ge-tmpl-uuid',
						virtual: false
					}
				]
			}

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: overrideBayType,
				scdBay,
				generalEquipmentTemplates: [virtualTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const ge = edits[0].node as Element
			expect(ge.getAttribute('virtual')).toBe('false')
		})
	})

	it('GIVEN neither template nor instance sets virtual WHEN called THEN virtual attribute is absent', () => {
		const { doc, scdBay } = makeScdBay()

		const edits = buildInsertsForGeneralEquipment({
			doc,
			bayType: bayTypeWithGE,
			scdBay,
			generalEquipmentTemplates: [geTemplate],
			existingPrefixes: new Set()
		})

		expect(edits).toHaveLength(1)
		const ge = edits[0].node as Element
		expect(ge.getAttribute('virtual')).toBeNull()
	})

	describe('GIVEN a GeneralEquipment template with virtual=false and instance with no virtual', () => {
		it('WHEN called THEN virtual="false" is written (template default used)', () => {
			const { doc, scdBay } = makeScdBay()
			const falseTemplate: GeneralEquipmentTemplate = {
				...geTemplate,
				virtual: false
			}

			const edits = buildInsertsForGeneralEquipment({
				doc,
				bayType: bayTypeWithGE,
				scdBay,
				generalEquipmentTemplates: [falseTemplate],
				existingPrefixes: new Set()
			})

			expect(edits).toHaveLength(1)
			const ge = edits[0].node as Element
			expect(ge.getAttribute('virtual')).toBe('false')
		})
	})
})
