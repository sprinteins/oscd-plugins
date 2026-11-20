import { expect, it } from 'vitest'
import { getTypeStructure } from './structure'

it('GIVEN a type with children WHEN its structure is requested THEN it returns child names and types', () => {
	const element = new DOMParser().parseFromString(
		`<DOType id="do-a">
			<DA name="stVal" bType="BOOLEAN" />
			<SDO name="sub" type="do-b" />
			<EnumVal ord="0">Open</EnumVal>
		</DOType>`,
		'application/xml'
	).documentElement

	expect(
		getTypeStructure({
			element: { id: 'do-a', element },
			hash: 'hash',
			usages: []
		})
	).toEqual([
		{ name: 'stVal', type: 'BOOLEAN' },
		{ name: 'sub', type: 'SDO' },
		{ name: 'Open', type: 'EnumVal' }
	])
})

it('GIVEN no type WHEN its structure is requested THEN it returns no entries', () => {
	expect(getTypeStructure(undefined)).toEqual([])
})
