import { describe, expect, it } from 'vitest'
import { groupEquipmentByType } from './equipment-grouping'

function makeElement(type: string | null, name = 'elem'): Element {
	const parser = new DOMParser()
	const doc = parser.parseFromString(
		`<ConductingEquipment name="${name}"${type ? ` type="${type}"` : ''}/>`,
		'application/xml'
	)
	return doc.documentElement
}

describe('groupEquipmentByType', () => {
	it('WHEN an empty list is provided THEN it returns an empty record', () => {
		expect(groupEquipmentByType([])).toEqual({})
	})

	it('WHEN all elements have distinct types THEN each type maps to one element', () => {
		const cbr = makeElement('CBR', 'Breaker1')
		const dis = makeElement('DIS', 'Switch1')
		const result = groupEquipmentByType([cbr, dis])
		expect(Object.keys(result)).toHaveLength(2)
		expect(result.CBR).toEqual([cbr])
		expect(result.DIS).toEqual([dis])
	})

	it('WHEN multiple elements share a type THEN they are grouped together', () => {
		const cbr1 = makeElement('CBR', 'Breaker1')
		const cbr2 = makeElement('CBR', 'Breaker2')
		const result = groupEquipmentByType([cbr1, cbr2])
		expect(result.CBR).toEqual([cbr1, cbr2])
	})

	it('WHEN an element has no type attribute THEN it is omitted from the result', () => {
		const noType = makeElement(null, 'Ghost')
		const cbr = makeElement('CBR', 'Breaker1')
		const result = groupEquipmentByType([noType, cbr])
		expect(result.CBR).toEqual([cbr])
		expect(Object.keys(result)).toHaveLength(1)
	})
})
