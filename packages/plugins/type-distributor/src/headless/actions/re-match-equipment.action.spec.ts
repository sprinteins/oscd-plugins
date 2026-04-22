import type { XMLEditor } from '@openscd/oscd-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'
import type { BayType, ConductingEquipmentTemplate } from '../common-types'
import type { EquipmentMatch } from '../domain/matching'
import { reMatchEquipment } from './re-match-equipment.action'

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
	}
}))

const PARSER = new DOMParser()

function parseXml(xml: string): XMLDocument {
	return PARSER.parseFromString(xml, 'application/xml') as unknown as XMLDocument
}

const TEMPLATE_A_UUID = 'template-a-uuid'
const TEMPLATE_B_UUID = 'template-b-uuid'
const BAY_TYPE_UUID = 'bay-type-1'
const EQ_FUNC_UUID_OLD = 'aabbccdd-0000-0000-0000-000000000000'
const EQ_FUNC_UUID_OLD_PREFIX = 'aabbccdd'

const OLD_INST = `CB1_Protection_${EQ_FUNC_UUID_OLD_PREFIX}`

function buildDoc() {
	return parseXml(`
		<SCL>
			<Substation>
				<VoltageLevel>
					<Bay name="Bay1" templateUuid="${BAY_TYPE_UUID}">
						<ConductingEquipment name="CB1" type="CBR"
							uuid="ce-uuid-1"
							templateUuid="bt-ce-1"
							originUuid="${TEMPLATE_A_UUID}">
							<EqFunction name="Protection" uuid="${EQ_FUNC_UUID_OLD}">
								<LNode lnClass="PTRC" lnType="T1" lnInst="1"
									iedName="IED1" ldInst="${OLD_INST}" />
							</EqFunction>
						</ConductingEquipment>
					</Bay>
				</VoltageLevel>
			</Substation>
			<IED name="IED1">
				<AccessPoint name="AP1">
					<Server>
						<LDevice inst="${OLD_INST}" ldName="IED1_${OLD_INST}">
							<LN lnClass="PTRC" lnType="T1" lnInst="1" />
						</LDevice>
					</Server>
				</AccessPoint>
			</IED>
		</SCL>
	`)
}

const templateA: ConductingEquipmentTemplate = {
	uuid: TEMPLATE_A_UUID,
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

const templateB: ConductingEquipmentTemplate = {
	uuid: TEMPLATE_B_UUID,
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

const bayType: BayType = {
	uuid: BAY_TYPE_UUID,
	name: 'TestBayType',
	conductingEquipments: [
		{ uuid: 'bt-ce-1', templateUuid: TEMPLATE_A_UUID, virtual: false },
		{ uuid: 'bt-ce-2', templateUuid: TEMPLATE_B_UUID, virtual: false }
	],
	functions: []
}

describe('reMatchEquipment', () => {
	let doc: XMLDocument
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		doc = buildDoc()
		mockEditor = { commit: vi.fn() }

		vi.mocked(getDocumentAndEditor).mockReturnValue({
			doc,
			editor: mockEditor as unknown as XMLEditor
		})

		ssdImportStore.bayTypes = [bayType]
		ssdImportStore.conductingEquipmentTemplates = [templateA, templateB]
		bayStore.assignedBayTypeUuid = BAY_TYPE_UUID
		bayStore.equipmentMatches = []
		equipmentMatchingStore.manualMatches.clear()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no scdBay WHEN called THEN throws', () => {
		bayStore.scdBay = null
		expect(() => reMatchEquipment('Bay1')).toThrow('No bay selected')
	})

	it('GIVEN no assignedBayTypeUuid WHEN called THEN throws', () => {
		bayStore.scdBay = doc.querySelector('Bay')!
		bayStore.assignedBayTypeUuid = null
		expect(() => reMatchEquipment('Bay1')).toThrow('Bay has no assigned bay type')
	})

	it('GIVEN an unknown bayTypeUuid WHEN called THEN throws', () => {
		bayStore.scdBay = doc.querySelector('Bay')!
		bayStore.assignedBayTypeUuid = 'unknown-uuid'
		expect(() => reMatchEquipment('Bay1')).toThrow('BayType "unknown-uuid" not found')
	})

	it('GIVEN no iedName on bay LNodes WHEN called THEN throws', () => {
		doc = parseXml(`
			<SCL>
				<Substation><VoltageLevel><Bay name="Bay1">
					<ConductingEquipment name="CB1" type="CBR"
						uuid="ce-uuid-1" templateUuid="bt-ce-1" originUuid="${TEMPLATE_A_UUID}">
						<EqFunction name="Protection" uuid="${EQ_FUNC_UUID_OLD}">
							<LNode lnClass="PTRC" lnType="T1" lnInst="1" />
						</EqFunction>
					</ConductingEquipment>
				</Bay></VoltageLevel></Substation>
			</SCL>
		`)
		bayStore.scdBay = doc.querySelector('Bay')!
		expect(() => reMatchEquipment('Bay1')).toThrow('No iedName found on bay LNodes')
	})

	describe('GIVEN a valid setup where template did not change', () => {
		beforeEach(() => {
			const scdBay = doc.querySelector('Bay')!
			const ceEl = doc.querySelector('ConductingEquipment')!
			bayStore.scdBay = scdBay
			bayStore.equipmentMatches = [
				{
					scdElement: ceEl,
					bayTypeEquipment: bayType.conductingEquipments[0],
					templateEquipment: templateA
				}
			]
			// manualMatches maps CE key to same template → no change
			equipmentMatchingStore.manualMatches.set('ce-uuid-1', TEMPLATE_A_UUID)
		})

		it('WHEN called THEN does not commit any edits', () => {
			reMatchEquipment('Bay1')
			expect(mockEditor.commit).not.toHaveBeenCalled()
		})
	})

	describe('GIVEN a valid setup where the CE template is swapped to templateB', () => {
		beforeEach(() => {
			const scdBay = doc.querySelector('Bay')!
			const ceEl = doc.querySelector('ConductingEquipment')!
			bayStore.scdBay = scdBay
			bayStore.equipmentMatches = [
				{
					scdElement: ceEl,
					bayTypeEquipment: bayType.conductingEquipments[0],
					templateEquipment: templateA
				}
			]
			// manualMatches maps CE to templateB → swap
			equipmentMatchingStore.manualMatches.set('ce-uuid-1', TEMPLATE_B_UUID)
		})

		it('WHEN called THEN commits edits with the bay name in the title', () => {
			reMatchEquipment('Bay1')
			expect(mockEditor.commit).toHaveBeenCalledWith(
				expect.any(Array),
				{ title: 'Re-match equipment in Bay "Bay1"' }
			)
		})

		it('WHEN called THEN commits edits that include a Bay LNode ldInst update', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const ldInstUpdate = edits.find(
				(e: any) =>
					'attributes' in e &&
					e.attributes?.ldInst !== undefined &&
					!('inst' in e.attributes)
			)
			expect(ldInstUpdate).toBeDefined()
		})

		it('WHEN called THEN commits edits that include a LDevice rename', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const lDeviceRename = edits.find(
				(e: any) =>
					'attributes' in e && 'inst' in (e.attributes ?? {})
			)
			expect(lDeviceRename).toBeDefined()
			expect(lDeviceRename.attributes.inst).not.toBe(OLD_INST)
		})

		it('WHEN called THEN commits edits that include a Remove for the old EqFunction', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const removes = edits.filter(
				(e: any) => 'node' in e && !('parent' in e)
			)
			// old LN in LDevice + old EqFunction
			expect(removes.length).toBeGreaterThanOrEqual(1)
		})

		it('WHEN called THEN commits edits that include an Insert for the new EqFunction', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const eqFunctionInsert = edits.find(
				(e: any) =>
					'parent' in e &&
					(e as any).node?.tagName === 'EqFunction'
			)
			expect(eqFunctionInsert).toBeDefined()
			expect(eqFunctionInsert.node.getAttribute('name')).toBe('Protection')
		})

		it('WHEN called THEN commits edits that update CE templateUuid/originUuid', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const ceUpdate = edits.find(
				(e: any) =>
					'attributes' in e &&
					'templateUuid' in (e.attributes ?? {})
			)
			expect(ceUpdate).toBeDefined()
			expect(ceUpdate.attributes.originUuid).toBe(TEMPLATE_B_UUID)
		})
	})

	describe('GIVEN a CE whose EqFunction has never been assigned (no LDevice in IED)', () => {
		beforeEach(() => {
			doc = parseXml(`
				<SCL>
					<Substation>
						<VoltageLevel>
							<Bay name="Bay1" templateUuid="${BAY_TYPE_UUID}">
								<ConductingEquipment name="CB1" type="CBR"
									uuid="ce-uuid-1"
									templateUuid="bt-ce-1"
									originUuid="${TEMPLATE_A_UUID}">
									<EqFunction name="Protection" uuid="${EQ_FUNC_UUID_OLD}">
										<LNode lnClass="PTRC" lnType="T1" lnInst="1"
											iedName="IED1" ldInst="${OLD_INST}" />
									</EqFunction>
								</ConductingEquipment>
								<ConductingEquipment name="CB2" type="CBR"
									uuid="ce-uuid-2"
									templateUuid="bt-ce-2"
									originUuid="${TEMPLATE_B_UUID}">
									<EqFunction name="Protection" uuid="unassigned-eqfunc-uuid">
										<LNode lnClass="PTRC" lnType="T1" lnInst="1" />
									</EqFunction>
								</ConductingEquipment>
							</Bay>
						</VoltageLevel>
					</Substation>
					<IED name="IED1">
						<AccessPoint name="AP1">
							<Server>
								<LDevice inst="${OLD_INST}" ldName="IED1_${OLD_INST}">
									<LN lnClass="PTRC" lnType="T1" lnInst="1" />
								</LDevice>
							</Server>
						</AccessPoint>
					</IED>
				</SCL>
			`)
			const scdBay = doc.querySelector('Bay')!
			const ceEl1 = doc.querySelectorAll('ConductingEquipment')[0]!
			const ceEl2 = doc.querySelectorAll('ConductingEquipment')[1]!
			bayStore.scdBay = scdBay
			bayStore.equipmentMatches = [
				{
					scdElement: ceEl1,
					bayTypeEquipment: bayType.conductingEquipments[0],
					templateEquipment: templateA
				},
				{
					scdElement: ceEl2,
					bayTypeEquipment: bayType.conductingEquipments[1],
					templateEquipment: templateB
				}
			]
			// swap: ce-uuid-1 → templateB, ce-uuid-2 → templateA
			equipmentMatchingStore.manualMatches.set('ce-uuid-1', TEMPLATE_B_UUID)
			equipmentMatchingStore.manualMatches.set('ce-uuid-2', TEMPLATE_A_UUID)

			vi.mocked(getDocumentAndEditor).mockReturnValue({
				doc,
				editor: mockEditor as unknown as XMLEditor
			})
		})

		it('WHEN called THEN does not throw', () => {
			expect(() => reMatchEquipment('Bay1')).not.toThrow()
		})

		it('WHEN called THEN still commits CE attribute updates', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const ceUpdates = edits.filter(
				(e: any) =>
					'attributes' in e && 'templateUuid' in (e.attributes ?? {})
			)
			expect(ceUpdates.length).toBeGreaterThanOrEqual(1)
		})

		it('WHEN called THEN still inserts new EqFunction elements', () => {
			reMatchEquipment('Bay1')

			const [edits] = mockEditor.commit.mock.calls[0] as [any[], any]
			const eqFunctionInserts = edits.filter(
				(e: any) => 'parent' in e && e.node?.tagName === 'EqFunction'
			)
			expect(eqFunctionInserts.length).toBeGreaterThanOrEqual(1)
		})
	})
})
