import type { XMLEditor } from '@openscd/oscd-editor'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FunctionTemplate, LNodeTemplate } from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { bayStore, ssdImportStore } from '@/headless/stores'
import {
	buildUpdatesForBayLNode,
	resolveFunctionElementUuid
} from './bay-edits'

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: {
		xmlDocument: null,
		editor: null
	}
}))

describe('buildUpdatesForBayLNode', () => {
	let mockDocument: Document
	let mockEditor: { commit: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		// Reset bay store — set to null first to force $derived scdBay re-evaluation
		bayStore.selectedBay = null

		mockDocument = new DOMParser().parseFromString(
			`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<Substation>
					<VoltageLevel>
						<Bay name="TestBay">
							<Function name="TopLevelFunc">
								<LNode lnClass="XSWI" lnType="XSWI_Type1" lnInst="1"/>
							</Function>
							<Function name="TestFunc">
								<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
								<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1" iedName="AlreadyAssigned"/>
								<LNode lnClass="XSWI" lnType="XSWI_Type1" lnInst="1"/>
								<LNode lnClass="CSWI" lnType="CSWI_Type1" lnInst="1"/>
							</Function>
							<ConductingEquipment name="Breaker1">
								<EqFunction name="ProtectionFunc">
									<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
									<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="2" iedName="ExistingIED"/>
								</EqFunction>
							</ConductingEquipment>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		mockEditor = {
			commit: vi.fn()
		}

		pluginGlobalStore.xmlDocument = mockDocument
		pluginGlobalStore.editor = mockEditor as unknown as XMLEditor
		bayStore.selectedBay = 'TestBay'
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('with equipment UUID', () => {
		it('GIVEN equipment UUID and matching LNode WHEN buildUpdatesForBayLNode is called THEN should create edit for EqFunction LNode', () => {
			// GIVEN equipment UUID and matching LNode
			const breaker = mockDocument.querySelector(
				'ConductingEquipment[name="Breaker1"]'
			)
			if (!breaker) {
				throw new Error(
					'Test setup failed: Breaker1 not found in mock document'
				)
			}

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'ProtectionFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentUuid: 'eq-uuid',
				equipmentMatches: [
					{
						scdElement: breaker,
						bayTypeEquipment: {
							uuid: 'eq-uuid',
							templateUuid: 'template-uuid',
							virtual: false
						},
						templateEquipment: {
							uuid: 'eq-uuid',
							name: 'Breaker1',
							type: 'CBR',
							terminals: [],
							eqFunctions: []
						}
					}
				]
			})

			// THEN should create edit for EqFunction LNode
			expect(edits).toHaveLength(1)
			expect(edits[0].element.tagName).toBe('LNode')
			expect(edits[0].attributes).toEqual({ iedName: 'IED1' })
			expect(edits[0].element.getAttribute('lnType')).toBe('XCBR_Type1')
			expect(edits[0].element.getAttribute('lnInst')).toBe('1')
		})

		it('GIVEN equipment UUID not in matches WHEN buildUpdatesForBayLNode is called THEN should return empty array', () => {
			// GIVEN equipment UUID not in matches (derived returns [] when no bay type is assigned)
			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'ProtectionFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentUuid: 'non-existent-uuid',
				equipmentMatches: []
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})

	describe('without equipment UUID', () => {
		it('GIVEN no equipment UUID and matching Function LNode WHEN buildUpdatesForBayLNode is called THEN should create edit for top-level Function', () => {
			// GIVEN no equipment UUID and matching Function LNode
			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TopLevelFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should create edit for top-level Function
			expect(edits).toHaveLength(1)
			expect(edits[0].element.tagName).toBe('LNode')
			expect(edits[0].attributes).toEqual({ iedName: 'IED1' })
			expect(edits[0].element.getAttribute('lnType')).toBe('XSWI_Type1')
		})

		it('GIVEN no equipment UUID and Function not found WHEN buildUpdatesForBayLNode is called THEN should return empty array', () => {
			// GIVEN no equipment UUID and Function not found
			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XSWI',
					lnType: 'XSWI_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'NonExistentFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})

	describe('LNode matching preferences', () => {
		it('GIVEN multiple LNode matches with one unassigned WHEN buildUpdatesForBayLNode is called THEN should prefer unassigned LNode', () => {
			// GIVEN multiple LNode matches with one unassigned
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1" iedName="AlreadyAssigned"/>
							<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should prefer unassigned LNode
			expect(edits).toHaveLength(1)
			expect(edits[0].element.getAttribute('iedName')).toBeNull()
		})

		it('GIVEN all LNode matches already assigned WHEN buildUpdatesForBayLNode is called THEN should return empty array', () => {
			// GIVEN all LNode matches already assigned
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1" iedName="IED1"/>
							<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1" iedName="IED2"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})

	describe('multiple LNodes', () => {
		it('GIVEN multiple LNodes in template WHEN buildUpdatesForBayLNode is called THEN should create edit for each unassigned match', () => {
			// GIVEN multiple LNodes in template
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
							<LNode lnClass="XSWI" lnType="XSWI_Type1" lnInst="1"/>
							<LNode lnClass="CSWI" lnType="CSWI_Type1" lnInst="1"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				},
				{
					lnClass: 'XSWI',
					lnType: 'XSWI_Type1',
					lnInst: '1'
				},
				{
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should create edit for each unassigned match
			expect(edits).toHaveLength(3)
			expect(edits[0].element.getAttribute('lnType')).toBe('XCBR_Type1')
			expect(edits[1].element.getAttribute('lnType')).toBe('XSWI_Type1')
			expect(edits[2].element.getAttribute('lnType')).toBe('CSWI_Type1')
		})

		it('GIVEN some LNodes with no match WHEN buildUpdatesForBayLNode is called THEN should create edits only for matching LNodes', () => {
			// GIVEN some LNodes with no match
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Bay name="TestBay">
						<Function name="TestFunc">
							<LNode lnClass="XCBR" lnType="XCBR_Type1" lnInst="1"/>
						</Function>
					</Bay>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				},
				{
					lnClass: 'XSWI',
					lnType: 'NonExistent_Type',
					lnInst: '99'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should create edits only for matching LNodes
			expect(edits).toHaveLength(1)
			expect(edits[0].element.getAttribute('lnType')).toBe('XCBR_Type1')
		})
	})

	describe('edge cases', () => {
		it('GIVEN empty lNodes array WHEN buildUpdatesForBayLNode is called THEN should return empty array', () => {
			// GIVEN empty lNodes array
			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: []
			}

			// WHEN buildUpdatesForBayLNode is called
			const edits = buildUpdatesForBayLNode({
				lNodes: [],
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})

		it('GIVEN no document loaded WHEN buildUpdatesForBayLNode is called without equipmentUuid THEN should return empty array', () => {
			// GIVEN no document loaded
			pluginGlobalStore.xmlDocument = undefined
			bayStore.selectedBay = null

			const lNodes: LNodeTemplate[] = [
				{
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				}
			]

			const sourceFunction: FunctionTemplate = {
				uuid: 'func-uuid',
				name: 'TestFunc',
				lnodes: lNodes
			}

			// WHEN buildUpdatesForBayLNode is called without equipmentUuid
			const edits = buildUpdatesForBayLNode({
				lNodes,
				iedName: 'IED1',
				sourceFunction,
				equipmentMatches: []
			})

			// THEN should return empty array
			expect(edits).toEqual([])
		})
	})
})

describe('resolveFunctionElementUuid', () => {
	describe('GIVEN geEquipmentUuid is set', () => {
		beforeEach(() => {
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation><VoltageLevel><Bay name="TestBay">
						<GeneralEquipment templateUuid="ge-template-1" originUuid="ge-origin-1">
							<EqFunction name="ProtectionFunc" uuid="ge-eqf-1" />
						</GeneralEquipment>
					</Bay></VoltageLevel></Substation>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'
			ssdImportStore.generalEquipmentTemplates = [
				{
					uuid: 'ge-origin-1',
					name: 'ProtectionEquipment',
					type: 'MOT',
					eqFunctions: [{ uuid: 'f-1', name: 'ProtectionFunc', lnodes: [] }]
				}
			]
		})

		afterEach(() => {
			ssdImportStore.generalEquipmentTemplates = []
		})

		it('WHEN GeneralEquipment and EqFunction exist THEN returns EqFunction uuid', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-template-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-template-1',
				sourceFunction: {
					uuid: 'f-1',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBe('ge-eqf-1')
		})

		it('WHEN no document loaded THEN returns undefined', () => {
			pluginGlobalStore.xmlDocument = undefined
			bayStore.selectedBay = null
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-template-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-template-1',
				sourceFunction: {
					uuid: 'f-1',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBeUndefined()
		})

		it('WHEN GeneralEquipment is missing originUuid THEN returns undefined', () => {
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation><VoltageLevel><Bay name="TestBay">
						<GeneralEquipment templateUuid="ge-template-1">
							<EqFunction name="ProtectionFunc" uuid="ge-eqf-1" />
						</GeneralEquipment>
					</Bay></VoltageLevel></Substation>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-template-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-template-1',
				sourceFunction: {
					uuid: 'f-1',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBeUndefined()
		})

		it('WHEN originUuid template not found in SSD store THEN returns undefined', () => {
			ssdImportStore.generalEquipmentTemplates = []
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-template-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-template-1',
				sourceFunction: {
					uuid: 'f-1',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBeUndefined()
		})

		it('WHEN sourceFunction uuid not found in template eqFunctions THEN returns undefined', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-template-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-template-1',
				sourceFunction: {
					uuid: 'unknown-uuid',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBeUndefined()
		})
	})

	describe('GIVEN geEquipmentUuid is set and GE has duplicate EqFunction names', () => {
		beforeEach(() => {
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation><VoltageLevel><Bay name="TestBay">
						<GeneralEquipment templateUuid="ge-inst-1" originUuid="ge-tmpl-1">
							<EqFunction name="ValveFn" uuid="ge-eqf-1" />
							<EqFunction name="ValveFn" uuid="ge-eqf-2" />
						</GeneralEquipment>
					</Bay></VoltageLevel></Substation>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'
			ssdImportStore.generalEquipmentTemplates = [
				{
					uuid: 'ge-tmpl-1',
					name: 'Valves',
					type: 'VLV',
					eqFunctions: [
						{ uuid: 'tpl-eq-1', name: 'ValveFn', lnodes: [] },
						{ uuid: 'tpl-eq-2', name: 'ValveFn', lnodes: [] }
					]
				}
			]
		})

		afterEach(() => {
			ssdImportStore.generalEquipmentTemplates = []
		})

		it('WHEN sourceFunction is the first EqFunction template THEN returns uuid of first SCD EqFunction', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-inst-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-inst-1',
				sourceFunction: {
					uuid: 'tpl-eq-1',
					name: 'ValveFn',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBe('ge-eqf-1')
		})

		it('WHEN sourceFunction is the second EqFunction template THEN returns uuid of second SCD EqFunction', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: 'ge-inst-1',
				equipmentUuid: undefined,
				parentUuid: 'ge-inst-1',
				sourceFunction: {
					uuid: 'tpl-eq-2',
					name: 'ValveFn',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBe('ge-eqf-2')
		})
	})

	describe('GIVEN equipmentUuid is set', () => {
		it('WHEN equipmentUuid not in matches THEN returns undefined', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: undefined,
				equipmentUuid: 'non-existent',
				parentUuid: 'some-parent',
				sourceFunction: {
					uuid: 'f-1',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches: []
			})
			expect(result).toBeUndefined()
		})

		it('WHEN template index matches THEN returns corresponding SCD EqFunction uuid', () => {
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<ConductingEquipment name="Breaker1">
						<EqFunction name="ProtectionFunc" uuid="scd-eqf-1"/>
						<EqFunction name="ProtectionFunc" uuid="scd-eqf-2"/>
					</ConductingEquipment>
				</SCL>`,
				'application/xml'
			)
			const scdElement = doc.querySelector(
				'ConductingEquipment'
			) as Element
			const equipmentMatches: EquipmentMatch[] = [
				{
					scdElement,
					bayTypeEquipment: {
						uuid: 'eq-uuid',
						templateUuid: 'template-uuid',
						virtual: false
					},
					templateEquipment: {
						uuid: 'template-uuid',
						name: 'Breaker1',
						type: 'CBR',
						terminals: [],
						eqFunctions: [{ uuid: 'tpl-1' }, { uuid: 'tpl-2' }]
					}
				}
			]
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: undefined,
				equipmentUuid: 'eq-uuid',
				parentUuid: 'some-parent',
				sourceFunction: {
					uuid: 'tpl-2',
					name: 'ProtectionFunc',
					lnodes: []
				},
				equipmentMatches
			})
			expect(result).toBe('scd-eqf-2')
		})
	})

	describe('GIVEN neither geEquipmentUuid nor equipmentUuid is set', () => {
		beforeEach(() => {
			const doc = new DOMParser().parseFromString(
				`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
					<Substation><VoltageLevel><Bay name="TestBay">
						<Function templateUuid="func-template-1" uuid="func-uuid-1" />
					</Bay></VoltageLevel></Substation>
				</SCL>`,
				'application/xml'
			)
			pluginGlobalStore.xmlDocument = doc
			bayStore.selectedBay = null
			bayStore.selectedBay = 'TestBay'
		})

		it('WHEN bay Function exists THEN returns Function uuid', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: undefined,
				equipmentUuid: undefined,
				parentUuid: 'func-template-1',
				sourceFunction: { uuid: 'f-1', name: 'SomeFunc', lnodes: [] },
				equipmentMatches: []
			})
			expect(result).toBe('func-uuid-1')
		})

		it('WHEN no matching Function exists THEN returns undefined', () => {
			const result = resolveFunctionElementUuid({
				geEquipmentUuid: undefined,
				equipmentUuid: undefined,
				parentUuid: 'non-existent',
				sourceFunction: { uuid: 'f-1', name: 'SomeFunc', lnodes: [] },
				equipmentMatches: []
			})
			expect(result).toBeUndefined()
		})
	})
})
