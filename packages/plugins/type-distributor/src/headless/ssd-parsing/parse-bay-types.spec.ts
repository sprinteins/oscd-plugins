import { describe, it, expect, beforeEach } from 'vitest'
import { parseBayTypes } from './parse-bay-types'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

describe('parseBayTypes', () => {
	let doc: XMLDocument

	beforeEach(() => {
		const parser = new DOMParser()
		doc = parser.parseFromString(ssdMockA, 'application/xml')
	})

	it('should parse bay types from SSD document', () => {
		const bayTypes = parseBayTypes(doc)

		expect(bayTypes).toHaveLength(3)
		expect(bayTypes[0].name).toBe('Bay_1')
		expect(bayTypes[1].name).toBe('Bay_2')
		expect(bayTypes[2].name).toBe('Bay_3')
	})

	it('should extract bay UUIDs correctly', () => {
		const bayTypes = parseBayTypes(doc)

		expect(bayTypes[0].uuid).toBe('c2b220a2-64ae-439b-bfc4-04c5307f46f1')
		expect(bayTypes[1].uuid).toBe('93a61fa3-4d46-4d8a-82e5-71ed36569c34')
		expect(bayTypes[2].uuid).toBe('70b40ce7-efeb-48a8-8b9f-947b604ff819')
	})

	it('should parse functions with template references', () => {
		const bayTypes = parseBayTypes(doc)

		expect(bayTypes[0].functions).toHaveLength(1)
		expect(bayTypes[0].functions[0].templateUuid).toBe(
			'af05ef82-fac1-42ed-8c47-57d117e7083e'
		)

		expect(bayTypes[1].functions).toHaveLength(1)
		expect(bayTypes[1].functions[0].templateUuid).toBe(
			'af05ef82-fac1-42ed-8c47-57d117e7083e'
		)
	})

	it('should handle bays with no functions', () => {
		const bayTypes = parseBayTypes(doc)

		expect(bayTypes[2].functions).toHaveLength(0)
		expect(bayTypes[2].conductingEquipments).toHaveLength(0)
	})

	it('should not include TEMPLATE bay in results', () => {
		const bayTypes = parseBayTypes(doc)

		const templateBay = bayTypes.find((bay) => bay.name === 'TEMPLATE')
		expect(templateBay).toBeUndefined()
	})

	it('should return empty array if TEMPLATE VoltageLevel not found', () => {
		const parser = new DOMParser()
		const emptyDoc = parser.parseFromString(
			'<?xml version="1.0"?><SCL><Substation name="Other"></Substation></SCL>',
			'application/xml'
		)

		const bayTypes = parseBayTypes(emptyDoc)
		expect(bayTypes).toHaveLength(0)
	})

	it('should handle missing uuid attribute gracefully', () => {
		const parser = new DOMParser()
		const docWithoutUuid = parser.parseFromString(
			`<?xml version="1.0"?>
			<SCL>
				<Substation name="TEMPLATE">
					<VoltageLevel name="TEMPLATE">
						<Bay>
							<Function templateUuid="test-uuid" />
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		const bayTypes = parseBayTypes(docWithoutUuid)
		expect(bayTypes).toHaveLength(1)
		expect(bayTypes[0].uuid).toBe('')
		expect(bayTypes[0].name).toBe('Unnamed Bay')
		expect(bayTypes[0].desc).toBeUndefined()
	})

	it('should extract bay description if present', () => {
		const parser = new DOMParser()
		const docWithDesc = parser.parseFromString(
			`<?xml version="1.0"?>
			<SCL>
				<Substation name="TEMPLATE">
					<VoltageLevel name="TEMPLATE">
						<Bay name="TestBay" uuid="test-uuid" desc="Test Description">
							<Function templateUuid="func-uuid" />
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		const bayTypes = parseBayTypes(docWithDesc)
		expect(bayTypes[0].desc).toBe('Test Description')
	})

	it('should correctly parse conducting equipment and function attributes', () => {
		const parser = new DOMParser()
		const docWithConductingEquipmentsAndFunctions = parser.parseFromString(
			`<?xml version="1.0"?>
			<SCL>
				<Substation name="TEMPLATE">
					<VoltageLevel name="TEMPLATE">
						<Bay name="Bay_1" uuid="c2b220a2-64ae-439b-bfc4-04c5307f46f1">
							<ConductingEquipment uuid="ce-uuid-1" templateUuid="ce-template-uuid-1" virtual="true" />
							<ConductingEquipment virtual="false" />
							<Function uuid="func-uuid-1" templateUuid="af05ef82-fac1-42ed-8c47-57d117e7083e" />
							<Function />
						</Bay>
					</VoltageLevel>
				</Substation>
			</SCL>`,
			'application/xml'
		)

		const bayTypes = parseBayTypes(docWithConductingEquipmentsAndFunctions)

		const bay = bayTypes.find(
			(bay) => bay.uuid === 'c2b220a2-64ae-439b-bfc4-04c5307f46f1'
		)

		if (!bay) {
			throw new Error('Bay not found in parsed results')
		}

		const conductingEquipments = bay.conductingEquipments
		const functions = bay.functions

		expect(conductingEquipments).toHaveLength(2)
		expect(functions).toHaveLength(2)

		expect(conductingEquipments[0]).toEqual({
			uuid: 'ce-uuid-1',
			templateUuid: 'ce-template-uuid-1',
			virtual: true
		})
		expect(conductingEquipments[1]).toEqual({
			uuid: '',
			templateUuid: '',
			virtual: false
		})
		expect(functions[0]).toEqual({
			uuid: 'func-uuid-1',
			templateUuid: 'af05ef82-fac1-42ed-8c47-57d117e7083e'
		})
		expect(functions[1]).toEqual({
			uuid: '',
			templateUuid: ''
		})
	})
})
