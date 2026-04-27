import type {
	Insert,
	Remove,
	SetAttributes,
	XMLEditor
} from '@openscd/oscd-editor'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'
import type { BayType, ConductingEquipmentTemplate } from '../common-types'
import type { EquipmentMatch } from '../domain/matching'
import { getScdEquipmentMatchKey } from '../domain/matching'
import { reMatchEquipment } from './re-match-equipment.action'

type EditorEdit = Insert | Remove | SetAttributes

vi.mock('@/headless/utils', () => ({
	getDocumentAndEditor: vi.fn()
}))

vi.mock('@/headless/stores', () => ({
	bayStore: {
		scdBay: null as Element | null,
		assignedBayTypeUuid: null as string | null,
		equipmentMatches: [] as EquipmentMatch[]
	},
	equipmentMatchingStore: {
		manualMatches: new Map<string, string>()
	},
	ssdImportStore: {
		bayTypes: [] as BayType[],
		conductingEquipmentTemplates: [] as ConductingEquipmentTemplate[]
	},
	assignedLNodesStore: {
		rebuild: vi.fn()
	}
}))

// ─── helpers ─────────────────────────────────────────────────────────────────

const PARSER = new DOMParser()

function parseXml(xml: string): XMLDocument {
	return PARSER.parseFromString(
		xml,
		'application/xml'
	) as unknown as XMLDocument
}

function findEl(
	doc: XMLDocument,
	tagName: string,
	attr: string,
	value: string
): Element {
	const el = Array.from(doc.getElementsByTagNameNS('*', tagName)).find(
		(e) => e.getAttribute(attr) === value
	)
	if (!el)
		throw new Error(`Element <${tagName} ${attr}="${value}"> not found`)
	return el
}

// ─── Scenario A: single CBR, PTRC → PDIS reassignment ────────────────────────

const CBR_BAY_TYPE_UUID = 'bay-type-1'
const CBR_TEMPLATE_A_UUID = 'template-a-uuid'
const CBR_TEMPLATE_B_UUID = 'template-b-uuid'
const CBR_EQ_FUNC_UUID = 'aabbccdd-0000-0000-0000-000000000000'
const CBR_OLD_LDEVICE_INST = 'CB1_Protection_aabbccdd'

const cbrTemplateA: ConductingEquipmentTemplate = {
	uuid: CBR_TEMPLATE_A_UUID,
	name: 'CB1',
	type: 'CBR',
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfunc-template-a',
			name: 'Protection',
			lnodes: [{ lnClass: 'PTRC', lnType: 'T1', lnInst: '1' }]
		}
	]
}

const cbrTemplateB: ConductingEquipmentTemplate = {
	uuid: CBR_TEMPLATE_B_UUID,
	name: 'CB2',
	type: 'CBR',
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfunc-template-b',
			name: 'Protection',
			lnodes: [{ lnClass: 'PDIS', lnType: 'T2', lnInst: '1' }]
		}
	]
}

const cbrBayType: BayType = {
	uuid: CBR_BAY_TYPE_UUID,
	name: 'TestBayType',
	conductingEquipments: [
		{ uuid: 'bt-ce-1', templateUuid: CBR_TEMPLATE_A_UUID, virtual: false },
		{ uuid: 'bt-ce-2', templateUuid: CBR_TEMPLATE_B_UUID, virtual: false }
	],
	generalEquipments: [],
	functions: []
}

function buildDocSingleCe(): XMLDocument {
	return parseXml(`
		<SCL>
			<Substation>
				<VoltageLevel>
					<Bay name="Bay1" templateUuid="${CBR_BAY_TYPE_UUID}">
						<ConductingEquipment name="CB1" type="CBR"
							uuid="ce-uuid-1"
							templateUuid="bt-ce-1"
							originUuid="${CBR_TEMPLATE_A_UUID}">
							<EqFunction name="Protection" uuid="${CBR_EQ_FUNC_UUID}">
								<LNode lnClass="PTRC" lnType="T1" lnInst="1"
									iedName="IED1" ldInst="${CBR_OLD_LDEVICE_INST}"/>
							</EqFunction>
						</ConductingEquipment>
					</Bay>
				</VoltageLevel>
			</Substation>
			<IED name="IED1">
				<AccessPoint name="AP1">
					<Server>
						<LDevice inst="${CBR_OLD_LDEVICE_INST}" ldName="IED1_${CBR_OLD_LDEVICE_INST}">
							<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
							<LN lnClass="PTRC" lnType="T1" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>
			</IED>
		</SCL>
	`)
}

// ─── Scenario B: two DIS, full template swap ──────────────────────────────────

const SWAP_BAY_TYPE_UUID = '0f77531c-cd29-4dfe-b070-dfc1803af9ed'

const QC9_UUID = 'f8ad7fef-d2cc-46d1-8ac6-c5292cc76da5'
const QB91_UUID = '015f1cad-54a9-42f1-b1d8-61205caf10d6'

// BayType ConductingEquipment UUIDs (templateUuid on the CE element)
const BT_CE_QC9_UUID = '615085c8-5db2-46cf-9beb-88d90262a643'
const BT_CE_QB91_UUID = '1ecc0aa5-d5f4-4451-8ec3-b5e24763aa79'

// ConductingEquipmentTemplate UUIDs (originUuid on the CE element)
const TEMPLATE_QC9_UUID = '9e122308-39a6-46f1-a455-b816f4dc708d'
const TEMPLATE_QB91_UUID = '0aece9bd-0d45-4566-b258-6df5e955aade'

const QC9_EQ_FUNC_UUID = 'a0d0d78e-81da-41b8-a480-b89217ed7a40'
const QB91_EQ_FUNC_UUID = 'ce34b98c-305b-4240-8fd4-a9a499b2eb84'
const QC9_OLD_LDEVICE_INST = 'QC9_DisconnectorFunction_a0d0d78e'
const QB91_OLD_LDEVICE_INST = 'QB91_DisconnectorFunction_ce34b98c'

const swapTemplateQC9: ConductingEquipmentTemplate = {
	uuid: TEMPLATE_QC9_UUID,
	name: '-QC9',
	type: 'DIS',
	virtual: false,
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfunc-template-qc9',
			name: 'DisconnectorFunction',
			lnodes: [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI$oscd$_5114e81752706b92',
					lnInst: '1'
				}
			]
		}
	]
}

const swapTemplateQB91: ConductingEquipmentTemplate = {
	uuid: TEMPLATE_QB91_UUID,
	name: '-QB91',
	type: 'DIS',
	virtual: false,
	terminals: [],
	eqFunctions: [
		{
			uuid: 'eqfunc-template-qb91',
			name: 'DisconnectorFunction',
			lnodes: [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI$oscd$_5114e81752706b92',
					lnInst: '1'
				}
			]
		}
	]
}

const swapBayType: BayType = {
	uuid: SWAP_BAY_TYPE_UUID,
	name: 'Q01A_',
	conductingEquipments: [
		{
			uuid: BT_CE_QC9_UUID,
			templateUuid: TEMPLATE_QC9_UUID,
			virtual: false
		},
		{
			uuid: BT_CE_QB91_UUID,
			templateUuid: TEMPLATE_QB91_UUID,
			virtual: false
		}
	],
	generalEquipments: [],
	functions: []
}

// namespace-free doc so jsdom querySelector works
function buildDocTwoDis(): XMLDocument {
	return parseXml(`
		<SCL>
			<Substation name="UW_TESTSITE">
				<VoltageLevel name="C1_">
					<Bay name="Q01A_" uuid="1f1eebdd-4146-4281-a085-eb256dbba33f" templateUuid="${SWAP_BAY_TYPE_UUID}">
						<ConductingEquipment name="-QC9" type="DIS" uuid="${QC9_UUID}" templateUuid="${BT_CE_QC9_UUID}" originUuid="${TEMPLATE_QC9_UUID}">
							<Terminal name="T1" uuid="c79f3e5c-77e6-439a-9954-b40db1260bb0"/>
							<Terminal name="T2" uuid="eb30b6d1-70cc-42a8-be8b-460e664334ea"/>
							<EqFunction name="DisconnectorFunction" uuid="${QC9_EQ_FUNC_UUID}">
								<LNode lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
							</EqFunction>
						</ConductingEquipment>
						<ConductingEquipment name="-QB91" type="DIS" uuid="${QB91_UUID}" templateUuid="${BT_CE_QB91_UUID}" originUuid="${TEMPLATE_QB91_UUID}">
							<Terminal name="T1" uuid="2623bdb3-7b69-463b-81c5-f48679f7faf4"/>
							<Terminal name="T2" uuid="3805ba0f-7ad0-49c0-96f6-d9b55d27399e"/>
							<EqFunction name="DisconnectorFunction" uuid="${QB91_EQ_FUNC_UUID}">
								<LNode lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_5114e81752706b92" iedName="Test"/>
							</EqFunction>
						</ConductingEquipment>
					</Bay>
				</VoltageLevel>
			</Substation>
			<IED name="Test">
				<AccessPoint name="A">
					<Server>
						<LDevice inst="${QC9_OLD_LDEVICE_INST}" ldName="Test_${QC9_OLD_LDEVICE_INST}">
							<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
							<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>
				<AccessPoint name="B">
					<Server>
						<LDevice inst="${QB91_OLD_LDEVICE_INST}" ldName="Test_${QB91_OLD_LDEVICE_INST}">
							<LN0 lnClass="LLN0" lnType="ID" lnInst=""/>
							<LN lnClass="XSWI" lnType="XSWI$oscd$_5114e81752706b92" lnInst="1"/>
						</LDevice>
					</Server>
				</AccessPoint>
			</IED>
		</SCL>
	`)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('reMatchEquipment', () => {
	let doc: XMLDocument
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	function mockEdits(): EditorEdit[] {
		const call = mockEditor.commit.mock.calls[0] as unknown[] | undefined
		return (call?.[0] ?? []) as EditorEdit[]
	}

	beforeEach(() => {
		doc = buildDocSingleCe()
		mockEditor = { commit: vi.fn() }

		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc,
			editor: mockEditor as unknown as XMLEditor
		})

		ssdImportStore.bayTypes = [cbrBayType]
		ssdImportStore.conductingEquipmentTemplates = [
			cbrTemplateA,
			cbrTemplateB
		]
		bayStore.assignedBayTypeUuid = CBR_BAY_TYPE_UUID
		bayStore.equipmentMatches = []
		equipmentMatchingStore.manualMatches.clear()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	// ── guards ──────────────────────────────────────────────────────────────

	it('GIVEN no scdBay WHEN called THEN throws "No bay selected"', () => {
		bayStore.scdBay = null
		expect(() => reMatchEquipment('Bay1')).toThrow('No bay selected')
	})

	it('GIVEN no assignedBayTypeUuid WHEN called THEN throws', () => {
		bayStore.scdBay = doc.querySelector('Bay')
		if (!bayStore.scdBay)
			throw new Error('Test setup failed: Bay element not found')
		bayStore.assignedBayTypeUuid = null
		expect(() => reMatchEquipment('Bay1')).toThrow(
			'Bay has no assigned bay type'
		)
	})

	it('GIVEN an unknown bayTypeUuid WHEN called THEN throws', () => {
		bayStore.scdBay = doc.querySelector('Bay')
		if (!bayStore.scdBay)
			throw new Error('Test setup failed: Bay element not found')
		bayStore.assignedBayTypeUuid = 'unknown-uuid'
		expect(() => reMatchEquipment('Bay1')).toThrow(
			'BayType "unknown-uuid" not found'
		)
	})

	// ── CE not yet assigned to an IED ────────────────────────────────────────

	it('GIVEN CE LNodes have no iedName WHEN called THEN new EqFunction LNodes have no iedName', () => {
		doc = parseXml(`
			<SCL>
				<Substation><VoltageLevel>
					<Bay name="Bay1" templateUuid="${CBR_BAY_TYPE_UUID}">
						<ConductingEquipment name="CB1" type="CBR"
							uuid="ce-uuid-1" templateUuid="bt-ce-1" originUuid="${CBR_TEMPLATE_A_UUID}">
							<EqFunction name="Protection" uuid="${CBR_EQ_FUNC_UUID}">
								<LNode lnClass="PTRC" lnType="T1" lnInst="1"/>
							</EqFunction>
						</ConductingEquipment>
					</Bay>
				</VoltageLevel></Substation>
			</SCL>
		`)
		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc,
			editor: mockEditor as unknown as XMLEditor
		})
		const ceEl = doc.querySelector('ConductingEquipment')
		if (!ceEl)
			throw new Error(
				'Test setup failed: ConductingEquipment element not found'
			)
		bayStore.scdBay = doc.querySelector('Bay')
		if (!bayStore.scdBay)
			throw new Error('Test setup failed: Bay element not found')
		bayStore.equipmentMatches = [
			{
				scdElement: ceEl,
				bayTypeEquipment: cbrBayType.conductingEquipments[0],
				templateEquipment: cbrTemplateA
			}
		]
		equipmentMatchingStore.manualMatches.set(
			getScdEquipmentMatchKey(ceEl, 0),
			CBR_TEMPLATE_B_UUID
		)

		reMatchEquipment('Bay1')

		const edits = mockEdits()
		const eqFuncInsert = (edits as Insert[]).find((e) => {
			const ed = e as EditorEdit
			return (
				'parent' in ed &&
				(ed.node as Element | undefined)?.tagName === 'EqFunction'
			)
		}) as { parent: Element; node: Element } | undefined
		expect(eqFuncInsert).toBeDefined()
		if (!eqFuncInsert) throw new Error('expected eqFuncInsert')
		const lnodes = Array.from(
			(eqFuncInsert.node as Element).querySelectorAll('LNode')
		)
		for (const ln of lnodes) {
			expect((ln as Element).getAttribute('iedName')).toBeNull()
		}
	})

	// ── no template change → no edits ───────────────────────────────────────

	describe('GIVEN template assignment did not change', () => {
		beforeEach(() => {
			const ceEl = doc.querySelector('ConductingEquipment')
			if (!ceEl)
				throw new Error(
					'Test setup failed: ConductingEquipment element not found'
				)
			bayStore.scdBay = doc.querySelector('Bay')
			if (!bayStore.scdBay)
				throw new Error('Test setup failed: Bay element not found')
			bayStore.equipmentMatches = [
				{
					scdElement: ceEl,
					bayTypeEquipment: cbrBayType.conductingEquipments[0],
					templateEquipment: cbrTemplateA
				}
			]
			equipmentMatchingStore.manualMatches.set(
				'ce-uuid-1',
				CBR_TEMPLATE_A_UUID
			)
		})

		it('WHEN called THEN does not commit any edits', () => {
			reMatchEquipment('Bay1')
			expect(mockEditor.commit).not.toHaveBeenCalled()
		})
	})

	// ── single CE reassigned to a different template ─────────────────────────

	describe('GIVEN single CBR CE is reassigned from templateA (PTRC) to templateB (PDIS)', () => {
		beforeEach(() => {
			const ceEl = doc.querySelector('ConductingEquipment')
			if (!ceEl)
				throw new Error(
					'Test setup failed: ConductingEquipment element not found'
				)
			bayStore.scdBay = doc.querySelector('Bay')
			if (!bayStore.scdBay)
				throw new Error('Test setup failed: Bay element not found')
			bayStore.equipmentMatches = [
				{
					scdElement: ceEl,
					bayTypeEquipment: cbrBayType.conductingEquipments[0],
					templateEquipment: cbrTemplateA
				}
			]
			equipmentMatchingStore.manualMatches.set(
				'ce-uuid-1',
				CBR_TEMPLATE_B_UUID
			)
		})

		it('WHEN called THEN commits with the correct bay name title', () => {
			reMatchEquipment('Bay1')
			expect(mockEditor.commit).toHaveBeenCalledWith(expect.any(Array), {
				title: 'Re-match equipment in Bay "Bay1"'
			})
		})

		describe('WHEN called', () => {
			let edits: unknown[]

			beforeEach(() => {
				reMatchEquipment('Bay1')
				edits = mockEdits()
			})

			it('THEN renames the LDevice to a new inst', () => {
				const rename = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return 'attributes' in ed && !!attrs && 'inst' in attrs
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(rename).toBeDefined()
				if (!rename || !rename.attributes)
					throw new Error('expected rename attributes')
				expect(String(rename.attributes.inst)).not.toBe(
					CBR_OLD_LDEVICE_INST
				)
			})

			it('THEN the LN0 of the LDevice is NOT removed', () => {
				const lDevice = doc.querySelector(
					`LDevice[inst="${CBR_OLD_LDEVICE_INST}"]`
				)
				if (!lDevice)
					throw new Error(
						`Test setup failed: LDevice inst "${CBR_OLD_LDEVICE_INST}" not found`
					)
				const ln0 = lDevice.querySelector('LN0')
				if (!ln0)
					throw new Error('Test setup failed: LN0 element not found')
				const remove = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						!('parent' in ed) &&
						'node' in ed &&
						(ed.node as Node) === ln0
					)
				})
				expect(remove).toBeUndefined()
			})

			it('THEN removes the old EqFunction', () => {
				const removes = (edits as EditorEdit[]).filter((e) => {
					const ed = e as EditorEdit
					return 'node' in ed && !('parent' in ed)
				})
				expect(removes.length).toBeGreaterThanOrEqual(1)
			})

			it('THEN inserts a new EqFunction named "Protection"', () => {
				const eqFuncInsert = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						'parent' in ed &&
						(ed.node as Element | undefined)?.tagName ===
							'EqFunction'
					)
				}) as { node: Element } | undefined
				expect(eqFuncInsert).toBeDefined()
				if (!eqFuncInsert) throw new Error('expected eqFuncInsert')
				expect(eqFuncInsert.node.getAttribute('name')).toBe(
					'Protection'
				)
			})

			it('THEN updates CE templateUuid and originUuid to templateB', () => {
				const ceEl = doc.querySelector('ConductingEquipment')
				if (!ceEl)
					throw new Error(
						'Test setup failed: ConductingEquipment element not found'
					)
				const ceUpdate = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === ceEl &&
						!!attrs &&
						'templateUuid' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(ceUpdate).toBeDefined()
				if (!ceUpdate || !ceUpdate.attributes)
					throw new Error('expected ceUpdate attributes')
				expect(String(ceUpdate.attributes.originUuid)).toBe(
					CBR_TEMPLATE_B_UUID
				)
			})

			it('THEN new EqFunction LNodes carry iedName from the assigned IED', () => {
				const eqFuncInsert = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						'parent' in ed &&
						(ed.node as Element | undefined)?.tagName ===
							'EqFunction'
					)
				}) as { node: Element } | undefined
				if (!eqFuncInsert) throw new Error('expected eqFuncInsert')
				const lnodes = Array.from(
					(eqFuncInsert.node as Element).querySelectorAll('LNode')
				)
				expect(lnodes.length).toBeGreaterThan(0)
				for (const ln of lnodes) {
					expect((ln as Element).getAttribute('iedName')).toBe('IED1')
				}
			})
		})
	})

	// ── two CEs, one with no LDevice (partial IED assignment) ───────────────

	describe('GIVEN two CEs where one has no LDevice yet (partial IED assignment)', () => {
		beforeEach(() => {
			doc = parseXml(`
				<SCL>
					<Substation><VoltageLevel>
						<Bay name="Bay1" templateUuid="${CBR_BAY_TYPE_UUID}">
							<ConductingEquipment name="CB1" type="CBR"
								uuid="ce-uuid-1" templateUuid="bt-ce-1" originUuid="${CBR_TEMPLATE_A_UUID}">
								<EqFunction name="Protection" uuid="${CBR_EQ_FUNC_UUID}">
									<LNode lnClass="PTRC" lnType="T1" lnInst="1"
										iedName="IED1" ldInst="${CBR_OLD_LDEVICE_INST}"/>
								</EqFunction>
							</ConductingEquipment>
							<ConductingEquipment name="CB2" type="CBR"
								uuid="ce-uuid-2" templateUuid="bt-ce-2" originUuid="${CBR_TEMPLATE_B_UUID}">
								<EqFunction name="Protection" uuid="unassigned-eqfunc-uuid">
									<LNode lnClass="PTRC" lnType="T1" lnInst="1"/>
								</EqFunction>
							</ConductingEquipment>
						</Bay>
					</VoltageLevel></Substation>
					<IED name="IED1">
						<AccessPoint name="AP1">
							<Server>
								<LDevice inst="${CBR_OLD_LDEVICE_INST}" ldName="IED1_${CBR_OLD_LDEVICE_INST}">
									<LN lnClass="PTRC" lnType="T1" lnInst="1"/>
								</LDevice>
							</Server>
						</AccessPoint>
					</IED>
				</SCL>
			`)
			vi.mocked(getDocumentAndEditor).mockReturnValue({
				doc,
				editor: mockEditor as unknown as XMLEditor
			})
			const ceEls = Array.from(
				doc.querySelectorAll('ConductingEquipment')
			)
			if (ceEls.length < 2)
				throw new Error(
					'Test setup failed: expected two ConductingEquipment elements'
				)
			const ceEl1 = ceEls[0]
			const ceEl2 = ceEls[1]
			bayStore.scdBay = doc.querySelector('Bay')
			if (!bayStore.scdBay)
				throw new Error('Test setup failed: Bay element not found')
			bayStore.equipmentMatches = [
				{
					scdElement: ceEl1,
					bayTypeEquipment: cbrBayType.conductingEquipments[0],
					templateEquipment: cbrTemplateA
				},
				{
					scdElement: ceEl2,
					bayTypeEquipment: cbrBayType.conductingEquipments[1],
					templateEquipment: cbrTemplateB
				}
			]
			equipmentMatchingStore.manualMatches.set(
				'ce-uuid-1',
				CBR_TEMPLATE_B_UUID
			)
			equipmentMatchingStore.manualMatches.set(
				'ce-uuid-2',
				CBR_TEMPLATE_A_UUID
			)
		})

		it('WHEN called THEN does not throw', () => {
			expect(() => reMatchEquipment('Bay1')).not.toThrow()
		})

		it('WHEN called THEN commits CE attribute updates for both CEs', () => {
			reMatchEquipment('Bay1')
			const edits = mockEdits()
			const ceUpdates = (edits as EditorEdit[]).filter((e) => {
				const ed = e as EditorEdit
				const attrs = (
					'attributes' in ed ? ed.attributes : undefined
				) as Partial<Record<string, string | null>> | undefined
				return 'attributes' in ed && !!attrs && 'templateUuid' in attrs
			})
			expect(ceUpdates.length).toBeGreaterThanOrEqual(1)
		})

		it('WHEN called THEN inserts new EqFunction elements', () => {
			reMatchEquipment('Bay1')
			const edits = mockEdits()
			const eqFunctionInserts = (edits as EditorEdit[]).filter((e) => {
				const ed = e as EditorEdit
				return (
					'parent' in ed &&
					(ed.node as Element | undefined)?.tagName === 'EqFunction'
				)
			})
			expect(eqFunctionInserts.length).toBeGreaterThanOrEqual(1)
		})
	})

	// ── two DIS CEs, full template swap (iedName travels with the type) ──────

	describe('GIVEN two DIS CEs whose template assignments are fully swapped', () => {
		beforeEach(() => {
			doc = buildDocTwoDis()
			vi.mocked(getDocumentAndEditor).mockReturnValue({
				doc,
				editor: mockEditor as unknown as XMLEditor
			})

			ssdImportStore.bayTypes = [swapBayType]
			ssdImportStore.conductingEquipmentTemplates = [
				swapTemplateQC9,
				swapTemplateQB91
			]

			const qc9El = findEl(doc, 'ConductingEquipment', 'uuid', QC9_UUID)
			const qb91El = findEl(doc, 'ConductingEquipment', 'uuid', QB91_UUID)

			bayStore.scdBay = doc.querySelector('Bay')
			if (!bayStore.scdBay)
				throw new Error('Test setup failed: Bay element not found')
			bayStore.assignedBayTypeUuid = SWAP_BAY_TYPE_UUID
			bayStore.equipmentMatches = [
				{
					scdElement: qc9El,
					bayTypeEquipment: swapBayType.conductingEquipments[0],
					templateEquipment: swapTemplateQC9
				},
				{
					scdElement: qb91El,
					bayTypeEquipment: swapBayType.conductingEquipments[1],
					templateEquipment: swapTemplateQB91
				}
			]

			// Swap: -QC9 receives QB91's type, -QB91 receives QC9's type
			equipmentMatchingStore.manualMatches.set(
				QC9_UUID,
				TEMPLATE_QB91_UUID
			)
			equipmentMatchingStore.manualMatches.set(
				QB91_UUID,
				TEMPLATE_QC9_UUID
			)
		})

		it('WHEN called THEN does not throw', () => {
			expect(() => reMatchEquipment('Q01A_')).not.toThrow()
		})

		it('WHEN called THEN commits with the correct bay name title', () => {
			reMatchEquipment('Q01A_')
			expect(mockEditor.commit).toHaveBeenCalledWith(expect.any(Array), {
				title: 'Re-match equipment in Bay "Q01A_"'
			})
		})

		describe('WHEN called', () => {
			let edits: unknown[]

			beforeEach(() => {
				reMatchEquipment('Q01A_')
				edits = mockEdits()
			})

			it("THEN -QC9 receives QB91's bayType CE uuid as templateUuid", () => {
				const qc9El = findEl(
					doc,
					'ConductingEquipment',
					'uuid',
					QC9_UUID
				)
				const update = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === qc9El &&
						!!attrs &&
						'templateUuid' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(update).toBeDefined()
				if (!update || !update.attributes)
					throw new Error('expected update attributes')
				expect(String(update.attributes.templateUuid)).toBe(
					BT_CE_QB91_UUID
				)
			})

			it("THEN -QC9 receives QB91's template uuid as originUuid", () => {
				const qc9El = findEl(
					doc,
					'ConductingEquipment',
					'uuid',
					QC9_UUID
				)
				const update = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === qc9El &&
						!!attrs &&
						'templateUuid' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(update).toBeDefined()
				if (!update || !update.attributes)
					throw new Error('expected update attributes')
				expect(String(update.attributes.originUuid)).toBe(
					TEMPLATE_QB91_UUID
				)
			})

			it("THEN -QB91 receives QC9's bayType CE uuid as templateUuid", () => {
				const qb91El = findEl(
					doc,
					'ConductingEquipment',
					'uuid',
					QB91_UUID
				)
				const update = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === qb91El &&
						!!attrs &&
						'templateUuid' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(update).toBeDefined()
				if (!update || !update.attributes)
					throw new Error('expected update attributes')
				expect(String(update.attributes.templateUuid)).toBe(
					BT_CE_QC9_UUID
				)
			})

			it("THEN -QB91 receives QC9's template uuid as originUuid", () => {
				const qb91El = findEl(
					doc,
					'ConductingEquipment',
					'uuid',
					QB91_UUID
				)
				const update = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === qb91El &&
						!!attrs &&
						'templateUuid' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(update).toBeDefined()
				if (!update || !update.attributes)
					throw new Error('expected update attributes')
				expect(String(update.attributes.originUuid)).toBe(
					TEMPLATE_QC9_UUID
				)
			})

			it('THEN inserts a new EqFunction for each CE', () => {
				const inserts = (edits as EditorEdit[]).filter((e) => {
					const ed = e as EditorEdit
					return (
						'parent' in ed &&
						(ed.node as Element | undefined)?.tagName ===
							'EqFunction'
					)
				})
				expect(inserts).toHaveLength(2)
			})

			it('THEN removes the old EqFunction of -QC9', () => {
				const qc9EqFunc = findEl(
					doc,
					'EqFunction',
					'uuid',
					QC9_EQ_FUNC_UUID
				)
				const remove = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						!('parent' in ed) &&
						'node' in ed &&
						(ed.node as Node) === qc9EqFunc
					)
				})
				expect(remove).toBeDefined()
			})

			it('THEN removes the old EqFunction of -QB91', () => {
				const qb91EqFunc = findEl(
					doc,
					'EqFunction',
					'uuid',
					QB91_EQ_FUNC_UUID
				)
				const remove = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						!('parent' in ed) &&
						'node' in ed &&
						(ed.node as Node) === qb91EqFunc
					)
				})
				expect(remove).toBeDefined()
			})

			it('THEN renames the QB91 LDevice to a QC9-prefixed inst (type travels to QC9 CE)', () => {
				const qb91LDevice = findEl(
					doc,
					'LDevice',
					'inst',
					QB91_OLD_LDEVICE_INST
				)
				const rename = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === qb91LDevice &&
						!!attrs &&
						'inst' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(rename).toBeDefined()
				if (!rename || !rename.attributes)
					throw new Error('expected rename attributes')
				expect(String(rename.attributes.inst)).toMatch(
					/^QC9_DisconnectorFunction_[0-9a-f]{8}$/
				)
				expect(String(rename.attributes.inst)).not.toBe(
					QB91_OLD_LDEVICE_INST
				)
			})

			it('THEN renames the QC9 LDevice to a QB91-prefixed inst (type travels to QB91 CE)', () => {
				const qc9LDevice = findEl(
					doc,
					'LDevice',
					'inst',
					QC9_OLD_LDEVICE_INST
				)
				const rename = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					const attrs = (
						'attributes' in ed ? ed.attributes : undefined
					) as Partial<Record<string, string | null>> | undefined
					return (
						'attributes' in ed &&
						ed.element === qc9LDevice &&
						!!attrs &&
						'inst' in attrs
					)
				}) as
					| { attributes?: Partial<Record<string, string | null>> }
					| undefined
				expect(rename).toBeDefined()
				if (!rename || !rename.attributes)
					throw new Error('expected rename attributes')
				expect(String(rename.attributes.inst)).toMatch(
					/^QB91_DisconnectorFunction_[0-9a-f]{8}$/
				)
				expect(String(rename.attributes.inst)).not.toBe(
					QC9_OLD_LDEVICE_INST
				)
			})

			it('THEN does NOT remove LN0 from the QC9 LDevice', () => {
				const qc9LDevice = findEl(
					doc,
					'LDevice',
					'inst',
					QC9_OLD_LDEVICE_INST
				)
				const ln0 = qc9LDevice.querySelector('LN0')
				if (!ln0)
					throw new Error('Test setup failed: LN0 element not found')
				const remove = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						!('parent' in ed) &&
						'node' in ed &&
						(ed.node as Node) === ln0
					)
				})
				expect(remove).toBeUndefined()
			})

			it('THEN does NOT remove LN0 from the QB91 LDevice', () => {
				const qb91LDevice = findEl(
					doc,
					'LDevice',
					'inst',
					QB91_OLD_LDEVICE_INST
				)
				const ln0 = qb91LDevice.querySelector('LN0')
				if (!ln0)
					throw new Error('Test setup failed: LN0 element not found')
				const remove = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						!('parent' in ed) &&
						'node' in ed &&
						(ed.node as Node) === ln0
					)
				})
				expect(remove).toBeUndefined()
			})

			it('THEN new LNodes in QC9 EqFunction carry iedName="Test" (from QB91 type source)', () => {
				const qc9El = findEl(
					doc,
					'ConductingEquipment',
					'uuid',
					QC9_UUID
				)
				const eqFuncInsert = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						'parent' in ed &&
						(ed.node as Element | undefined)?.tagName ===
							'EqFunction' &&
						ed.parent === qc9El
					)
				}) as { node?: Element } | undefined
				expect(eqFuncInsert).toBeDefined()
				if (!eqFuncInsert || !eqFuncInsert.node)
					throw new Error('expected eqFuncInsert.node')
				const lnodes = Array.from(
					(eqFuncInsert.node as Element).querySelectorAll('LNode')
				)
				expect(lnodes.length).toBeGreaterThan(0)
				for (const ln of lnodes) {
					expect((ln as Element).getAttribute('iedName')).toBe('Test')
				}
			})

			it('THEN new LNodes in QB91 EqFunction carry iedName="Test" (from QC9 type source)', () => {
				const qb91El = findEl(
					doc,
					'ConductingEquipment',
					'uuid',
					QB91_UUID
				)
				const eqFuncInsert = (edits as EditorEdit[]).find((e) => {
					const ed = e as EditorEdit
					return (
						'parent' in ed &&
						(ed.node as Element | undefined)?.tagName ===
							'EqFunction' &&
						ed.parent === qb91El
					)
				}) as { node?: Element } | undefined
				expect(eqFuncInsert).toBeDefined()
				if (!eqFuncInsert || !eqFuncInsert.node)
					throw new Error('expected eqFuncInsert.node')
				const lnodes = Array.from(
					(eqFuncInsert.node as Element).querySelectorAll('LNode')
				)
				expect(lnodes.length).toBeGreaterThan(0)
				for (const ln of lnodes) {
					expect((ln as Element).getAttribute('iedName')).toBe('Test')
				}
			})
		})
	})
})
