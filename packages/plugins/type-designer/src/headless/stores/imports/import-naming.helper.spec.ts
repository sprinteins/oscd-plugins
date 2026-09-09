import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mockGetElementsWithSameNameBase,
	mockGetNewNameWithOccurrence,
} = vi.hoisted(() => ({
	mockGetElementsWithSameNameBase: vi.fn(),
	mockGetNewNameWithOccurrence: vi.fn(),
}))

vi.mock(
	'@/headless/stores/type-elements/type-naming.helper',
	() => ({
		getElementsWithSameNameBase: mockGetElementsWithSameNameBase,
		getNewNameWithOccurrence: mockGetNewNameWithOccurrence,
	}),
)

import { setNameAttribute } from './import-naming.helper'

function createImportedElement(name?: string): Element {
	const xmlDocument = document.implementation.createDocument(
		null,
		'SCL',
		null,
	)

	const element = xmlDocument.createElement('Bay')

	if (name) {
		element.setAttribute('name', name)
	}

	return element
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('setNameAttribute', () => {
	it('GIVEN an imported element without a name attribute WHEN its name is processed THEN the element remains unchanged', () => {
		const element = createImportedElement()

		const result = setNameAttribute(element)

		expect(result).toBeUndefined()
		expect(mockGetElementsWithSameNameBase).not.toHaveBeenCalled()
		expect(mockGetNewNameWithOccurrence).not.toHaveBeenCalled()
		expect(element.hasAttribute('name')).toBe(false)
	})

	it('GIVEN an imported element without a name conflict WHEN its name is processed THEN the original name is preserved', () => {
		const element = createImportedElement('BayType')

		mockGetElementsWithSameNameBase.mockReturnValue([])

		const result = setNameAttribute(element)

		expect(result).toBeUndefined()
		expect(mockGetElementsWithSameNameBase).toHaveBeenCalledWith({
			valueToTest: 'BayType',
			removeOccurrencePartToTestedValue: false,
		})
		expect(mockGetNewNameWithOccurrence).not.toHaveBeenCalled()
		expect(element.getAttribute('name')).toBe('BayType')
	})

	it('GIVEN an imported element with a name conflict WHEN its name is processed THEN the element is renamed', () => {
		const element = createImportedElement('BayType')

		mockGetElementsWithSameNameBase.mockReturnValue([
			{
				attributes: {
					name: 'BayType',
				},
			},
		])

		mockGetNewNameWithOccurrence.mockReturnValue(
			'BayType_Imported',
		)

		const result = setNameAttribute(element)

		expect(result).toBeUndefined()

		expect(mockGetNewNameWithOccurrence).toHaveBeenCalledWith({
			element,
			suffix: 'Imported',
			skipFirstOccurrence: true,
		})

		expect(element.getAttribute('name')).toBe('BayType_Imported')
	})

	it('GIVEN repeated import name conflicts WHEN the imported element name is processed THEN the generated occurrence name is used', () => {
		const element = createImportedElement('BayType')

		mockGetElementsWithSameNameBase.mockReturnValue([
			{
				attributes: {
					name: 'BayType',
				},
			},
			{
				attributes: {
					name: 'BayType_Imported',
				},
			},
		])

		mockGetNewNameWithOccurrence.mockReturnValue(
			'BayType_Imported_2',
		)

		setNameAttribute(element)

		expect(element.getAttribute('name')).toBe(
			'BayType_Imported_2',
		)
	})
})