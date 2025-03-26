// HELPERS
import {
	getNewNameWithOccurrence,
	getElementsWithSameNameBase
} from '@/headless/stores/type-elements/type-naming.helper'

export function setNameAttribute(currentImportedElement: Element) {
	const currentName = currentImportedElement.getAttribute('name')
	if (!currentName) return

	const elementsWithSameName = getElementsWithSameNameBase({
		valueToTest: currentName,
		removeOccurrencePartToTestedValue: false
	})

	if (elementsWithSameName.length === 0) return

	const newName = getNewNameWithOccurrence({
		element: currentImportedElement,
		suffix: 'Imported',
		skipFirstOccurrence: true
	})
	return currentImportedElement.setAttribute('name', newName)
}
