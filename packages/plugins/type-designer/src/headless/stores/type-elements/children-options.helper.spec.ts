import { describe, expect, it, vi } from 'vitest'

const { mockConstants } = vi.hoisted(() => ({
	mockConstants: {
		TYPE_FAMILY: {
			bay: 'bay',
			generalEquipment: 'generalEquipment',
			conductingEquipment: 'conductingEquipment',
			function: 'function',
			lNodeType: 'lNodeType',
		},
		CONDUCTING_EQUIPMENTS: {
			singleTerminalEquipment: {
				type: 'SingleTerminalEquipment',
				numberOfTerminals: 1,
			},
			doubleTerminalEquipment: {
				type: 'DoubleTerminalEquipment',
				numberOfTerminals: 2,
			},
		},
	},
}))

vi.mock('@/headless/constants', () => mockConstants)

import { getChildrenOptions } from './children-options.helper'

function createConductingEquipment(
	type?: string,
	terminalCount = 0,
): Element {
	const xmlDocument = document.implementation.createDocument(
		null,
		'SCL',
		null,
	)

	const element = xmlDocument.createElement('ConductingEquipment')

	if (type) {
		element.setAttribute('type', type)
	}

	for (let index = 0; index < terminalCount; index += 1) {
		element.append(xmlDocument.createElement('Terminal'))
	}

	return element
}

describe('getChildrenOptions', () => {
	const familiesWithoutChildrenOptions = [
	'bay',
	'generalEquipment',
	'function',
	'lNodeType',
] as const

	it.each(familiesWithoutChildrenOptions)(
		'returns no children options for the "%s" family',
		(family) => {
			const result = getChildrenOptions({
				family: family as never,
				element: document.createElement('TestElement'),
			})

			expect(result[family]).toBeUndefined()
			expect(result.conductingEquipment).toBeUndefined()
		},
	)

	it('returns one terminal as the only option for known single-terminal equipment', () => {
		const element = createConductingEquipment(
			'SingleTerminalEquipment',
			1,
		)

		const result = getChildrenOptions({
			family: mockConstants.TYPE_FAMILY.conductingEquipment as never,
			element,
		})

		expect(
			result.conductingEquipment
		).toEqual({
			currentTerminalsElements: [element.children[0]],
			currentValue: 1,
			options: [
				{
					label: 'One',
					value: 1,
				},
			],
		})
	})

	it('returns two terminals as the only option for known double-terminal equipment', () => {
		const element = createConductingEquipment(
			'DoubleTerminalEquipment',
			2,
		)

		const result = getChildrenOptions({
			family: mockConstants.TYPE_FAMILY.conductingEquipment as never,
			element,
		})

		expect(
			result.conductingEquipment,
		).toMatchObject({
			currentValue: 2,
			options: [
				{
					label: 'Two',
					value: 2,
				},
			],
		})
	})

	it('counts only Terminal children', () => {
		const element = createConductingEquipment(
			'DoubleTerminalEquipment',
			2,
		)
		element.append(document.createElement('OtherChild'))

		const result = getChildrenOptions({
			family: mockConstants.TYPE_FAMILY.conductingEquipment as never,
			element,
		})

		expect(
			result.conductingEquipment,
		).toMatchObject({
			currentValue: 2,
		})
	})

	it('allows one and two terminals for unknown conducting equipment', () => {
		const element = createConductingEquipment('UnknownEquipment', 0)

		const result = getChildrenOptions({
			family: mockConstants.TYPE_FAMILY.conductingEquipment as never,
			element,
		})

		expect(
			result.conductingEquipment,
		).toMatchObject({
			currentValue: 0,
			options: [
				{
					label: 'One',
					value: 1,
				},
				{
					label: 'Two',
					value: 2,
				},
			],
		})
	})

	it('throws an error when conducting equipment has no type attribute', () => {
		const element = createConductingEquipment()

		expect(() =>
			getChildrenOptions({
				family: mockConstants.TYPE_FAMILY.conductingEquipment as never,
				element,
			}),
		).toThrow('No type attribute found on conducting equipment')
	})
})