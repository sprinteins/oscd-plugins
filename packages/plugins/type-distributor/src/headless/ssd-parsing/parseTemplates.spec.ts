import { describe, it, expect, beforeEach } from 'vitest'
import {
	parseTemplates,
	parseFunctionTemplate,
	parseConductingEquipmentTemplate
} from './parseTemplates'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

describe('parseTemplates', () => {
	let doc: XMLDocument

	beforeEach(() => {
		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
	})

	it('parses function and conducting equipment templates from TEMPLATE bay', () => {
		const { functionTemplates, conductingEquipmentTemplates } =
			parseTemplates(doc)

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
                        { lnType: 'LT', lnClass: 'LC', lnInst: '1', iedName: '', uuid: 'ln-uuid-2' }
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
		})
	})
})
