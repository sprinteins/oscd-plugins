import { beforeEach, describe, expect, it } from 'vitest'
import { createTestDocument } from '@/headless/test-helpers'
import {
	isRemoveEdit,
	isSetAttributesEdit
} from '@/headless/test-helpers/type-guards'
import { buildUpdatesForClearingLNodeConnections } from './lnode-connections.edits'

describe('buildUpdatesForClearingLNodeConnections', () => {
	let document: Document
	let ln: Element

	function element(selector: string): Element {
		const result = document.querySelector(selector)
		if (!result) throw new Error(`Missing test element: ${selector}`)
		return result
	}

	function clear(lnElements = [ln]) {
		return buildUpdatesForClearingLNodeConnections({
			document,
			lnElements,
			iedName: 'IED1'
		})
	}

	beforeEach(() => {
		document = createTestDocument(`
			<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
				<IED name="IED1">
					<AccessPoint name="P1">
						<Server>
							<LDevice inst="Protection_aa11bb22">
								<LN0 lnClass="LLN0" inst="" lnType="LLN0Type"/>
								<LN lnClass="PTRC" inst="1" lnType="PTRCType"/>
							</LDevice>
						</Server>
					</AccessPoint>
				</IED>
				<Substation name="S">
					<VoltageLevel name="V">
						<Bay name="A" uuid="bay-a" templateUuid="template-a">
							<Function uuid="aa11bb22-0000-0000-0000-000000000000">
								<LNode lnClass="PTRC" lnInst="1" lnType="PTRCType" iedName="IED1"/>
								<LNode lnClass="XCBR" lnInst="1" iedName="IED2" ldInst="Other"/>
							</Function>
							<ConductingEquipment uuid="equipment" templateUuid="equipment-template" originUuid="origin">
								<EqFunction name="Generated"/>
							</ConductingEquipment>
							<ConductingEquipment name="WithoutMetadata">
								<EqFunction name="AlsoGenerated"/>
							</ConductingEquipment>
							<GeneralEquipment name="Generated"/>
						</Bay>
						<Bay name="B" templateUuid="template-b">
							<LNode lnClass="PTRC" lnInst="1" lnType="PTRCType" iedName="IED1" ldInst="Protection_aa11bb22"/>
						</Bay>
						<Bay name="Untouched" templateUuid="template-c">
							<Function name="Keep"/>
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>
		`)
		ln = element('LN')
	})

	it('GIVEN several IEDs serving a Bay WHEN one connection is deleted THEN keeps the Bay assignment and structures', () => {
		const edits = clear()
		const bay = element('Bay[name="A"]')
		expect(
			edits
				.filter(isSetAttributesEdit)
				.some((edit) => edit.element === bay)
		).toBe(false)
		expect(
			edits.filter(isRemoveEdit).some((edit) => bay.contains(edit.node))
		).toBe(false)
		expect(edits.filter(isSetAttributesEdit)).toContainEqual({
			element: element('Bay[name="A"] LNode[iedName="IED1"]'),
			attributes: { iedName: null, ldInst: null },
			attributesNS: {}
		})
	})

	it.each([
		'',
		'None',
		null
	])('GIVEN the last connection and an unassigned LNode with iedName=%s WHEN deleted THEN unassigns only affected Bays', (iedName) => {
		const unassigned = element('LNode[iedName="IED2"]')
		if (iedName === null) unassigned.removeAttribute('iedName')
		else unassigned.setAttribute('iedName', iedName)

		const edits = clear()
		const attributes = edits.filter(isSetAttributesEdit)
		expect(
			attributes
				.filter((edit) => edit.element.localName === 'Bay')
				.map((edit) => edit.element.getAttribute('name'))
		).toEqual(['A', 'B'])
		expect(attributes).toContainEqual({
			element: element('Bay[name="A"]'),
			attributes: { uuid: null, templateUuid: null },
			attributesNS: {}
		})
		expect(attributes).toContainEqual({
			element: element('ConductingEquipment[uuid]'),
			attributes: { uuid: null, templateUuid: null, originUuid: null },
			attributesNS: {}
		})
		const removed = edits.filter(isRemoveEdit).map((edit) => edit.node)
		expect(removed).toHaveLength(4)
		expect(removed).toEqual(
			expect.arrayContaining(
				Array.from(
					document.querySelectorAll(
						'Bay[name="A"] ConductingEquipment > EqFunction, Bay[name="A"] > Function, Bay[name="A"] > GeneralEquipment'
					)
				)
			)
		)
	})

	it.each([
		'Substation',
		'VoltageLevel'
	])('GIVEN duplicate direct references under %s WHEN their LN is deleted THEN clears every reference without requiring a Function UUID', (parent) => {
		const reference = element('Bay[name="B"] > LNode')
		const first = reference.cloneNode(true)
		const second = reference.cloneNode(true)
		element(parent).append(first, second)

		const cleared = clear()
			.filter(isSetAttributesEdit)
			.map((edit) => edit.element)
		expect(cleared).toContain(first)
		expect(cleared).toContain(second)
	})

	it.each([
		['iedName', 'IED2'],
		['ldInst', 'OtherDevice'],
		['lnClass', 'XCBR'],
		['lnType', 'OtherType'],
		['lnInst', '2'],
		['prefix', 'OtherPrefix']
	])('GIVEN a reference with a different %s WHEN deleting the LN THEN leaves that reference untouched', (attribute, value) => {
		const reference = element('Bay[name="B"] > LNode')
		reference.setAttribute(attribute, value)
		expect(
			clear()
				.filter(isSetAttributesEdit)
				.some((edit) => edit.element === reference)
		).toBe(false)
	})

	it('GIVEN a reference without optional lnType WHEN its LN is deleted THEN clears it using lnClass and the other identifiers', () => {
		const reference = element('Bay[name="B"] > LNode')
		reference.removeAttribute('lnType')

		const edits = clear()
		const attributeEdits = edits.filter(isSetAttributesEdit)

		expect(attributeEdits).toContainEqual({
			element: reference,
			attributes: { iedName: null, ldInst: null },
			attributesNS: {}
		})
		expect(attributeEdits).toContainEqual({
			element: element('Bay[name="B"]'),
			attributes: { uuid: null, templateUuid: null },
			attributesNS: {}
		})
	})

	it('GIVEN an explicit target without lnType and a non-generated LDevice inst WHEN deleting THEN does not guess its type', () => {
		element('LDevice').setAttribute('inst', 'ExternalLD')
		const reference = element('Bay[name="B"] > LNode')
		reference.setAttribute('ldInst', 'ExternalLD')
		ln.setAttribute('prefix', 'P')
		reference.setAttribute('prefix', 'P')
		ln.removeAttribute('lnType')
		expect(
			clear()
				.filter(isSetAttributesEdit)
				.some((edit) => edit.element === reference)
		).toBe(false)
	})

	it.each([
		'Function',
		'EqFunction'
	])('GIVEN a distributor-created reference under %s without ldInst WHEN deleting THEN resolves its generated LDevice suffix', (tag) => {
		const parent = element('Bay[name="A"] Function')
		const replacement = document.createElementNS(parent.namespaceURI, tag)
		replacement.setAttribute('uuid', parent.getAttribute('uuid') ?? '')
		replacement.append(element('Bay[name="A"] LNode[iedName="IED1"]'))
		parent.replaceWith(replacement)
		expect(
			clear()
				.filter(isSetAttributesEdit)
				.map((edit) => edit.element)
		).toContain(replacement.firstElementChild)
	})

	it.each([
		'missing-uuid',
		'different-uuid',
		'no-function'
	])('GIVEN a reference without ldInst and %s WHEN deleting THEN does not guess its target', (scenario) => {
		const parent = element('Bay[name="A"] Function')
		const reference = element('Bay[name="A"] LNode[iedName="IED1"]')
		if (scenario === 'missing-uuid') parent.removeAttribute('uuid')
		if (scenario === 'different-uuid')
			parent.setAttribute('uuid', 'ffffffff')
		if (scenario === 'no-function')
			element('Bay[name="A"]').append(reference)
		expect(
			clear()
				.filter(isSetAttributesEdit)
				.map((edit) => edit.element)
		).not.toContain(reference)
	})

	it('GIVEN an LN0 reference with omitted lnInst WHEN its LDevice is deleted THEN clears it too', () => {
		const reference = element('Bay[name="B"] > LNode')
		reference.setAttribute('lnClass', 'LLN0')
		reference.setAttribute('lnType', 'LLN0Type')
		reference.removeAttribute('lnInst')
		expect(
			clear([element('LN0'), ln])
				.filter(isSetAttributesEdit)
				.map((edit) => edit.element)
		).toContain(reference)
	})

	it('GIVEN duplicate deletion targets WHEN clearing references THEN emits only one edit per reference', () => {
		const edits = clear([ln, ln]).filter(isSetAttributesEdit)
		const nodes = edits.map((edit) => edit.element)
		expect(nodes.length).toBe(new Set(nodes).size)
	})

	it('GIVEN no deletion targets WHEN clearing references THEN leaves all Bays untouched', () => {
		expect(clear([])).toEqual([])
	})

	it('GIVEN an LN without an LDevice inst WHEN clearing references THEN treats it as unreferenced and returns no edits', () => {
		element('LDevice').removeAttribute('inst')
		expect(clear()).toEqual([])
	})
})
