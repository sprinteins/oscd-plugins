import type { SetAttributes } from '@openscd/oscd-api'
import { beforeEach, describe, expect, it } from 'vitest'
import type { LNodeTemplate } from '@/headless/common-types'
import {
	buildUpdatesForClearingBayLNodeConnections,
	hasRemainingConnectionsAfterClearing
} from './bay-connections.helper'

const IED_NAME = 'IED1'

function makeElement(xml: string): Element {
	return new DOMParser().parseFromString(xml, 'application/xml')
		.documentElement
}

// Helpers to discriminate edit shapes without type-casting noise
function hasAttributes(
	edit: unknown
): edit is { element: Element; attributes: Record<string, unknown> } {
	return (
		typeof edit === 'object' &&
		edit !== null &&
		'attributes' in edit &&
		'element' in edit
	)
}

function hasNode(edit: unknown): edit is { node: Node } {
	return (
		typeof edit === 'object' &&
		edit !== null &&
		'node' in edit &&
		!('element' in edit)
	)
}

describe('hasRemainingConnectionsAfterClearing', () => {
	it('GIVEN a bay with no LNodes WHEN called THEN returns false', () => {
		const bay = makeElement('<Bay/>')
		expect(hasRemainingConnectionsAfterClearing(bay, new Set())).toBe(false)
	})

	it('GIVEN a bay with one LNode with iedName AND that LNode is in clearedLNodes WHEN called THEN returns false', () => {
		const bay = makeElement('<Bay><LNode iedName="IED1"/></Bay>')
		const lnode = bay.querySelector('LNode')
		if (!lnode) throw new Error('Test setup failure: LNode not found')
		expect(
			hasRemainingConnectionsAfterClearing(bay, new Set([lnode]))
		).toBe(false)
	})

	it('GIVEN a bay with two LNodes with iedName AND only one is cleared WHEN called THEN returns true', () => {
		const bay = makeElement(
			'<Bay><LNode iedName="IED1"/><LNode iedName="IED2"/></Bay>'
		)
		const firstLNode = bay.querySelector('LNode')
		if (!firstLNode)
			throw new Error('Test setup failure: first LNode not found')
		expect(
			hasRemainingConnectionsAfterClearing(bay, new Set([firstLNode]))
		).toBe(true)
	})
})

describe('buildUpdatesForClearingBayLNodeConnections', () => {
	describe('GIVEN templates that produce no LNode matches', () => {
		it('WHEN lNodeTemplates is empty THEN returns an empty array', () => {
			const bay = makeElement('<Bay/>')
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})

		it('WHEN template has no ldInst THEN returns an empty array', () => {
			const bay = makeElement('<Bay/>')
			const template: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'XCBR1',
				lnInst: '1'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})

		it('WHEN template has an invalid ldInst format THEN returns an empty array', () => {
			// 'SingleWord' has only one part → parseLDeviceInst throws
			const bay = makeElement('<Bay/>')
			const template: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'XCBR1',
				lnInst: '1',
				ldInst: 'SingleWord'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})

		it('WHEN template has a LD0 ldInst THEN returns an empty array', () => {
			const bay = makeElement('<Bay/>')
			const template: LNodeTemplate = {
				lnClass: 'LLN0',
				lnType: 'LLN0Type',
				lnInst: '',
				ldInst: 'LD0'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})

		it('WHEN template has a valid ldInst but no matching Function exists in bay THEN returns an empty array', () => {
			const bay = makeElement('<Bay/>')
			const template: LNodeTemplate = {
				lnClass: 'PDIS',
				lnType: 'PDIS1',
				lnInst: '1',
				ldInst: 'Protection_550e8400'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})

		it('WHEN Function is found but the LNode iedName does not match THEN returns an empty array', () => {
			const bay = makeElement(`
				<Bay>
					<Function uuid="550e8400abc">
						<LNode lnClass="PDIS" lnType="PDIS1" lnInst="1" iedName="OTHER_IED"/>
					</Function>
				</Bay>
			`)
			const template: LNodeTemplate = {
				lnClass: 'PDIS',
				lnType: 'PDIS1',
				lnInst: '1',
				ldInst: 'Protection_550e8400'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})

		it('WHEN Function is found but the LNode lnClass does not match THEN returns an empty array', () => {
			const bay = makeElement(`
				<Bay>
					<Function uuid="550e8400abc">
						<LNode lnClass="XCBR" lnType="PDIS1" lnInst="1" iedName="IED1"/>
					</Function>
				</Bay>
			`)
			const template: LNodeTemplate = {
				lnClass: 'PDIS',
				lnType: 'PDIS1',
				lnInst: '1',
				ldInst: 'Protection_550e8400'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			expect(edits).toHaveLength(0)
		})
	})

	describe('GIVEN a Function-based LNode connection to clear with no remaining connections', () => {
		let bay: Element
		let func: Element
		let lnode: Element
		const template: LNodeTemplate = {
			lnClass: 'PDIS',
			lnType: 'PDIS1',
			lnInst: '1',
			ldInst: 'Protection_550e8400'
		}

		beforeEach(() => {
			bay = makeElement(`
				<Bay>
					<Function uuid="550e8400abc">
						<LNode lnClass="PDIS" lnType="PDIS1" lnInst="1" iedName="IED1"/>
					</Function>
				</Bay>
			`)
			const _func = bay.querySelector('Function')
			const _lnode = bay.querySelector('LNode')
			if (!_func || !_lnode)
				throw new Error(
					'Test setup failure: Function or LNode not found'
				)
			func = _func
			lnode = _lnode
		})

		it('THEN includes a SetAttributes edit clearing iedName and ldInst on the LNode', () => {
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const lnodeEdit = edits.find(
				(e) => hasAttributes(e) && e.element === lnode
			)
			expect(lnodeEdit).toBeDefined()
			expect((lnodeEdit as SetAttributes).attributes).toEqual({
				iedName: null,
				ldInst: null
			})
		})

		it('THEN includes a SetAttributes edit clearing uuid and templateUuid on the bay', () => {
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const bayEdit = edits.find(
				(e) => hasAttributes(e) && e.element === bay
			)
			expect(bayEdit).toBeDefined()
			expect((bayEdit as SetAttributes).attributes).toEqual({
				uuid: null,
				templateUuid: null
			})
		})

		it('THEN includes a Remove edit for the Function element', () => {
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const removeEdit = edits.find((e) => hasNode(e) && e.node === func)
			expect(removeEdit).toBeDefined()
		})
	})

	describe('GIVEN an EqFunction-based LNode with the ConductingEquipment found in bay', () => {
		let bay: Element
		let conductingEquipment: Element
		let eqFunction: Element
		let lnode: Element
		const template: LNodeTemplate = {
			lnClass: 'XCBR',
			lnType: 'XCBR1',
			lnInst: '1',
			ldInst: 'CB1_CBFunction_b4e3f901'
		}

		beforeEach(() => {
			bay = makeElement(`
				<Bay>
					<ConductingEquipment name="CB1" uuid="eq-uuid" templateUuid="tpl-uuid" originUuid="orig-uuid">
						<EqFunction uuid="b4e3f901abc">
							<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
						</EqFunction>
					</ConductingEquipment>
				</Bay>
			`)
			const _conductingEquipment = bay.querySelector(
				'ConductingEquipment'
			)
			const _eqFunction = bay.querySelector('EqFunction')
			const _lnode = bay.querySelector('LNode')
			if (!_conductingEquipment || !_eqFunction || !_lnode)
				throw new Error(
					'Test setup failure: ConductingEquipment, EqFunction, or LNode not found'
				)
			conductingEquipment = _conductingEquipment
			eqFunction = _eqFunction
			lnode = _lnode
		})

		it('THEN includes a SetAttributes edit clearing iedName and ldInst on the LNode', () => {
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const lnodeEdit = edits.find(
				(e) => hasAttributes(e) && e.element === lnode
			)
			expect(lnodeEdit).toBeDefined()
			expect((lnodeEdit as SetAttributes).attributes).toEqual({
				iedName: null,
				ldInst: null
			})
		})

		it('WHEN CE has uuid attributes AND no remaining connections THEN includes a SetAttributes edit for the CE', () => {
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const ceEdit = edits.find(
				(e) => hasAttributes(e) && e.element === conductingEquipment
			)
			expect(ceEdit).toBeDefined()
			expect((ceEdit as SetAttributes).attributes).toEqual({
				uuid: null,
				templateUuid: null,
				originUuid: null
			})
		})

		it('WHEN no remaining connections THEN includes a Remove edit for the EqFunction', () => {
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const removeEdit = edits.find(
				(e) => hasNode(e) && e.node === eqFunction
			)
			expect(removeEdit).toBeDefined()
		})
	})

	describe('GIVEN an EqFunction-based LNode located by UUID prefix (equipment name not used for scoping)', () => {
		it('WHEN ldInst has an equipment name segment THEN finds EqFunction by UUID prefix bay-wide', () => {
			// equipmentName in parsed ldInst is non-null (signals EqFunction type)
			// but the lookup is purely UUID-prefix based, so CE name is irrelevant
			const bay = makeElement(`
				<Bay>
					<EqFunction uuid="b4e3f901abc">
						<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
					</EqFunction>
				</Bay>
			`)
			const lnode = bay.querySelector('LNode')
			const template: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'XCBR1',
				lnInst: '1',
				ldInst: 'AnyEquipName_CBFunction_b4e3f901'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const lnodeEdit = edits.find(
				(e) => hasAttributes(e) && e.element === lnode
			)
			expect(lnodeEdit).toBeDefined()
		})

		it('GIVEN CE name with illegal chars that were stripped in inst WHEN called THEN still finds LNode by UUID prefix', () => {
			// Bay CE name is "CB-1"; inst was generated with sanitized name "CB1"
			// queryMatchingBayLNode must find the EqFunction by UUID prefix, not by CE name
			const bay = makeElement(`
				<Bay>
					<ConductingEquipment name="CB-1" uuid="eq-uuid" templateUuid="tpl-uuid" originUuid="orig-uuid">
						<EqFunction uuid="b4e3f901abc">
							<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
						</EqFunction>
					</ConductingEquipment>
				</Bay>
			`)
			const lnode = bay.querySelector('LNode')
			const template: LNodeTemplate = {
				lnClass: 'XCBR',
				lnType: 'XCBR1',
				lnInst: '1',
				ldInst: 'CB1_CBFunction_b4e3f901'
			}
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [template],
				iedName: IED_NAME
			})
			const lnodeEdit = edits.find(
				(e) => hasAttributes(e) && e.element === lnode
			)
			expect(lnodeEdit).toBeDefined()
		})
	})

	describe('GIVEN a CE without any uuid-related attributes', () => {
		it('WHEN called THEN does NOT include a SetAttributes edit for the CE', () => {
			const bay = makeElement(`
				<Bay>
					<ConductingEquipment name="CB1">
						<EqFunction uuid="b4e3f901abc">
							<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
						</EqFunction>
					</ConductingEquipment>
				</Bay>
			`)
			const conductingEquipment = bay.querySelector('ConductingEquipment')
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [
					{
						lnClass: 'XCBR',
						lnType: 'XCBR1',
						lnInst: '1',
						ldInst: 'CB1_CBFunction_b4e3f901'
					}
				],
				iedName: IED_NAME
			})
			const ceEdit = edits.find(
				(e) => hasAttributes(e) && e.element === conductingEquipment
			)
			expect(ceEdit).toBeUndefined()
		})

		it('WHEN called THEN still includes a Remove edit for the CE EqFunction', () => {
			const bay = makeElement(`
				<Bay>
					<ConductingEquipment name="CB1">
						<EqFunction uuid="b4e3f901abc">
							<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
						</EqFunction>
					</ConductingEquipment>
				</Bay>
			`)
			const eqFunction = bay.querySelector('EqFunction')
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [
					{
						lnClass: 'XCBR',
						lnType: 'XCBR1',
						lnInst: '1',
						ldInst: 'CB1_CBFunction_b4e3f901'
					}
				],
				iedName: IED_NAME
			})
			const removeEdit = edits.find(
				(e) => hasNode(e) && e.node === eqFunction
			)
			expect(removeEdit).toBeDefined()
		})
	})

	describe('GIVEN remaining LNode connections after a partial clear', () => {
		it('WHEN called THEN does NOT include bay cleanup edits', () => {
			// Bay has two LNodes with iedName; only the PDIS one is matched by template.
			// The XCBR LNode with iedName remains → hasRemainingConnections = true
			const bay = makeElement(`
				<Bay>
					<Function uuid="550e8400abc">
						<LNode lnClass="PDIS" lnType="PDIS1" lnInst="1" iedName="IED1"/>
					</Function>
					<Function uuid="ffffffff000">
						<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
					</Function>
				</Bay>
			`)
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [
					{
						lnClass: 'PDIS',
						lnType: 'PDIS1',
						lnInst: '1',
						ldInst: 'Protection_550e8400'
					}
				],
				iedName: IED_NAME
			})
			const bayEdit = edits.find(
				(e) => hasAttributes(e) && e.element === bay
			)
			expect(bayEdit).toBeUndefined()
		})

		it('WHEN called THEN still includes a SetAttributes edit for the matched LNode', () => {
			const bay = makeElement(`
				<Bay>
					<Function uuid="550e8400abc">
						<LNode lnClass="PDIS" lnType="PDIS1" lnInst="1" iedName="IED1"/>
					</Function>
					<Function uuid="ffffffff000">
						<LNode lnClass="XCBR" lnType="XCBR1" lnInst="1" iedName="IED1"/>
					</Function>
				</Bay>
			`)
			const pdisLNode = bay.querySelector(
				'Function LNode[lnClass="PDIS"]'
			)
			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [
					{
						lnClass: 'PDIS',
						lnType: 'PDIS1',
						lnInst: '1',
						ldInst: 'Protection_550e8400'
					}
				],
				iedName: IED_NAME
			})
			const lnodeEdit = edits.find(
				(e) => hasAttributes(e) && e.element === pdisLNode
			)
			expect(lnodeEdit).toBeDefined()
		})
	})

	describe('GIVEN a bay with a GeneralEquipment element and a matched LNode', () => {
		it('WHEN no remaining connections THEN includes a Remove edit for the GeneralEquipment', () => {
			const bay = makeElement(`
				<Bay>
					<Function uuid="550e8400abc">
						<LNode lnClass="PDIS" lnType="PDIS1" lnInst="1" iedName="IED1"/>
					</Function>
					<GeneralEquipment name="Valves_1" type="VLV"/>
				</Bay>
			`)
			const ge = bay.querySelector('GeneralEquipment')
			if (!ge)
				throw new Error(
					'Test setup failure: GeneralEquipment not found'
				)

			const edits = buildUpdatesForClearingBayLNodeConnections({
				selectedBay: bay,
				lNodeTemplates: [
					{
						lnClass: 'PDIS',
						lnType: 'PDIS1',
						lnInst: '1',
						ldInst: 'Protection_550e8400'
					}
				],
				iedName: IED_NAME
			})

			const removeGE = edits.find((e) => hasNode(e) && e.node === ge)
			expect(removeGE).toBeDefined()
		})
	})
})
