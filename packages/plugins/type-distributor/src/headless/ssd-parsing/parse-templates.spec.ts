import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'
import { beforeEach, describe, expect, it } from 'vitest'
import {
	parseConductingEquipmentTemplate,
	parseFunctionTemplate,
	parseGeneralEquipmentTemplate,
	parseTemplates
} from './parse-templates'

describe('parseTemplates', () => {
	let doc: XMLDocument

	beforeEach(() => {
		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
	})

	it('parses function and conducting equipment templates from TEMPLATE bay', () => {
		const {
			functionTemplates,
			conductingEquipmentTemplates,
			generalEquipmentTemplates
		} = parseTemplates(doc)

		expect(functionTemplates.length).toBeGreaterThan(0)
		expect(functionTemplates.some((ft) => ft.name === 'Func_1')).toBe(true)
		expect(
			functionTemplates.some(
				(ft) => ft.uuid === 'af05ef82-fac1-42ed-8c47-57d117e7083e'
			)
		).toBe(true)

		expect(conductingEquipmentTemplates.length).toBeGreaterThanOrEqual(0)
		expect(
			conductingEquipmentTemplates.every((ce) => ce.name !== 'Valves_1')
		).toBe(true)

		// ssdMockA has 2 GeneralEquipment in TEMPLATE bay
		expect(generalEquipmentTemplates).toHaveLength(2)
		expect(
			generalEquipmentTemplates.some((ge) => ge.name === 'Valves_1')
		).toBe(true)
		expect(
			generalEquipmentTemplates.some((ge) => ge.name === 'Valves_2')
		).toBe(true)
	})

	it('only parses direct children and returns empties when TEMPLATE missing', () => {
		const parser = new DOMParser()
		const nestedDoc = parser.parseFromString(
			`<?xml version="1.0"?><SCL><Substation name="TEMPLATE"><VoltageLevel name="TEMPLATE"><Bay name="TEMPLATE"><Function name="TopLevel" uuid="top-uuid"><LNode lnType="TopType" /></Function><SubBay><Function name="Nested" uuid="nested-uuid"><LNode lnType="NestedType" /></Function></SubBay></Bay></VoltageLevel></Substation></SCL>`,
			'application/xml'
		)

		const nested = parseTemplates(nestedDoc)
		expect(nested.functionTemplates).toHaveLength(1)
		expect(nested.functionTemplates[0].name).toBe('TopLevel')

		const emptyDoc = parser.parseFromString(
			'<?xml version="1.0"?><SCL><Substation name="Other" /></SCL>',
			'application/xml'
		)
		const empty = parseTemplates(emptyDoc)
		expect(empty.functionTemplates).toHaveLength(0)
		expect(empty.conductingEquipmentTemplates).toHaveLength(0)
		expect(empty.generalEquipmentTemplates).toHaveLength(0)
	})

	describe('parseGeneralEquipmentTemplate', () => {
		it('GIVEN a GE element with EqFunction WHEN parsed THEN resolves lnodes from function template', () => {
			const parser = new DOMParser()
			const funcTemplates = [
				{
					uuid: 'fn-uuid',
					name: 'ValveFn',
					desc: 'FnDesc',
					lnodes: [
						{ lnClass: 'GGIO', lnType: 'T1', lnInst: '1', uuid: '' }
					]
				}
			]
			const geXml = `<GeneralEquipment name="Valves_1" type="VLV" uuid="ge-uuid" desc="GE Desc"><EqFunction templateUuid="fn-uuid"/></GeneralEquipment>`
			const result = parseGeneralEquipmentTemplate(
				parser.parseFromString(geXml, 'application/xml')
					.documentElement,
				funcTemplates
			)

			expect(result.name).toBe('Valves_1')
			expect(result.type).toBe('VLV')
			expect(result.uuid).toBe('ge-uuid')
			expect(result.desc).toBe('GE Desc')
			expect(result.eqFunctions).toHaveLength(1)
			expect(result.eqFunctions[0].name).toBe('ValveFn')
			expect(result.eqFunctions[0].lnodes).toHaveLength(1)
		})

		it('GIVEN a GE element with no attributes WHEN parsed THEN returns defaults', () => {
			const parser = new DOMParser()
			const result = parseGeneralEquipmentTemplate(
				parser.parseFromString('<GeneralEquipment/>', 'application/xml')
					.documentElement,
				[]
			)
			expect(result.name).toBe('Unnamed General Equipment')
			expect(result.type).toBe('')
			expect(result.eqFunctions).toHaveLength(0)
			// virtual absent in template element → undefined (not false)
			expect(result.virtual).toBeUndefined()
		})

		it('GIVEN a GE element with virtual="true" WHEN parsed THEN virtual is true', () => {
			const parser = new DOMParser()
			const result = parseGeneralEquipmentTemplate(
				parser.parseFromString(
					'<GeneralEquipment name="V1" type="VLV" uuid="ge-uuid" virtual="true"/>',
					'application/xml'
				).documentElement,
				[]
			)
			expect(result.virtual).toBe(true)
		})

		it('GIVEN a GE element with virtual="false" WHEN parsed THEN virtual is false', () => {
			const parser = new DOMParser()
			const result = parseGeneralEquipmentTemplate(
				parser.parseFromString(
					'<GeneralEquipment name="V1" type="VLV" uuid="ge-uuid" virtual="false"/>',
					'application/xml'
				).documentElement,
				[]
			)
			expect(result.virtual).toBe(false)
		})
	})

	describe('parseFunctionTemplate', () => {
		it('parses attributes and LNodes with defaults', () => {
			const parser = new DOMParser()
			const funcDoc = parser.parseFromString(
				`<Function name="TestFunc" uuid="test-uuid" desc="Test Description"><LNode lnClass="XCBR" lnType="TestType" lnInst="1" iedName="IED1" /></Function>`,
				'application/xml'
			)
			const result = parseFunctionTemplate(funcDoc.documentElement)
			expect(result).toMatchObject({
				name: 'TestFunc',
				uuid: 'test-uuid',
				desc: 'Test Description'
			})
			expect(result.lnodes[0]).toMatchObject({
				lnClass: 'XCBR',
				lnType: 'TestType',
				lnInst: '1',
				iedName: 'IED1'
			})
			const empty = parser.parseFromString(
				'<Function></Function>',
				'application/xml'
			)
			const resEmpty = parseFunctionTemplate(empty.documentElement)
			expect(resEmpty.name).toBe('Unnamed Function')
		})
	})

	describe('parseConductingEquipmentTemplate', () => {
		it('parses terminals, eqFunctions and template resolution/overrides', () => {
			const parser = new DOMParser()
			const ceXml = `<ConductingEquipment name="CB1" type="CBR" uuid="ce-uuid" desc="Circuit Breaker"><Terminal uuid="term-uuid" name="T1" connectivityNode="CN1" cNodeName="CNode1" /><EqFunction uuid="eq-func-uuid" name="MyFunc" desc="ElementDesc" /></ConductingEquipment>`
			const result = parseConductingEquipmentTemplate(
				parser.parseFromString(ceXml, 'application/xml')
					.documentElement,
				[]
			)
			expect(result).toMatchObject({
				name: 'CB1',
				type: 'CBR',
				uuid: 'ce-uuid',
				desc: 'Circuit Breaker'
			})
			expect(result.terminals).toHaveLength(1)
			expect(result.eqFunctions[0]).toMatchObject({
				name: 'MyFunc',
				desc: 'ElementDesc'
			})
			const functionTemplates = [
				{
					uuid: 'tpl-uuid',
					name: 'TemplateName',
					desc: 'TemplateDesc',
					lnodes: [
						{
							lnType: 'LT',
							lnClass: 'LC',
							lnInst: '1',
							iedName: '',
							uuid: 'ln-uuid-2'
						}
					]
				}
			]
			const ceWithTpl = parser.parseFromString(
				`<ConductingEquipment><EqFunction templateUuid="tpl-uuid" /></ConductingEquipment>`,
				'application/xml'
			)
			const resolved = parseConductingEquipmentTemplate(
				ceWithTpl.documentElement,
				functionTemplates
			)
			expect(resolved.eqFunctions[0].name).toBe('TemplateName')
		})

		it('handles missing attributes with defaults', () => {
			const parser = new DOMParser()
			const res = parseConductingEquipmentTemplate(
				parser.parseFromString(
					'<ConductingEquipment></ConductingEquipment>',
					'application/xml'
				).documentElement,
				[]
			)
			expect(res.name).toBe('Unnamed Equipment')
			expect(res.type).toBe('')
			expect(res.terminals).toHaveLength(0)
			expect(res.eqFunctions).toHaveLength(0)
			// virtual absent in template element → undefined (not false)
			expect(res.virtual).toBeUndefined()
		})

		it('GIVEN a CE element with virtual="true" WHEN parsed THEN virtual is true', () => {
			const parser = new DOMParser()
			const res = parseConductingEquipmentTemplate(
				parser.parseFromString(
					'<ConductingEquipment name="CB1" type="CBR" virtual="true"/>',
					'application/xml'
				).documentElement,
				[]
			)
			expect(res.virtual).toBe(true)
		})

		it('GIVEN a CE element with virtual="false" WHEN parsed THEN virtual is false', () => {
			const parser = new DOMParser()
			const res = parseConductingEquipmentTemplate(
				parser.parseFromString(
					'<ConductingEquipment name="CB1" type="CBR" virtual="false"/>',
					'application/xml'
				).documentElement,
				[]
			)
			expect(res.virtual).toBe(false)
		})
	})
})
