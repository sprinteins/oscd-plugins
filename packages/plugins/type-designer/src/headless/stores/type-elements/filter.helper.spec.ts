import { describe, expect, it } from 'vitest'
import { getFilteredTypeElementByIds } from './filter.helper'

const typeElements = {
	transformer1: {
		parameters: {
			label: 'Power Transformer',
		},
	},
	breaker1: {
		parameters: {
			label: 'Circuit Breaker',
		},
	},
	disconnector1: {
		parameters: {
			label: 'Disconnector',
		},
	},
	transformer2: {
		parameters: {
			label: 'Voltage Transformer',
		},
	},
} as unknown as Parameters<typeof getFilteredTypeElementByIds>[1]

describe('getFilteredTypeElementByIds', () => {
	it.each([
		{
			description: 'an empty filter',
			filter: '',
			expectedKeys: [
				'transformer1',
				'breaker1',
				'disconnector1',
				'transformer2',
			],
		},
		{
			description: 'an exact filter',
			filter: 'Circuit Breaker',
			expectedKeys: ['breaker1'],
		},
		{
			description: 'a partial filter',
			filter: 'transformer',
			expectedKeys: ['transformer1', 'transformer2'],
		},
		{
			description: 'a case-insensitive filter',
			filter: 'pOwEr',
			expectedKeys: ['transformer1'],
		},
		{
			description: 'a filter without a matching element',
			filter: 'battery',
			expectedKeys: [],
		},
	])('GIVEN $description WHEN type elements are filtered THEN the matching type elements are returned', ({
		filter,
		expectedKeys,
	}) => {
		const result = getFilteredTypeElementByIds(filter, typeElements)

		expect(Object.keys(result)).toEqual(expectedKeys)
	})

	it('GIVEN a collection of type elements WHEN the collection is filtered THEN the original collection remains unchanged', () => {
		getFilteredTypeElementByIds('transformer', typeElements)

		expect(Object.keys(typeElements)).toEqual([
			'transformer1',
			'breaker1',
			'disconnector1',
			'transformer2',
		])
	})
})