import { v4 as uuidv4 } from 'uuid'
// STORES
import { typeElementsStore } from '@/headless/stores'
// TYPES
import type { AvailableTypeFamily, TypeElement } from '@/headless/stores'

/**
 * Generates a new name for a cloned element with an occurrence number appended.
 *
 * @param params - The parameters for generating the new name.
 * @param params.elementToClone - The element to clone and generate a new name for.
 * @param params.family - The family type of the element.
 * @returns The new name with an occurrence number appended.
 */
export function getNewNameWithOccurrence(params: {
	element: Element
	family?: AvailableTypeFamily
	suffix: string
	skipFirstOccurrence?: boolean
}) {
	const oldName = params.element.getAttribute('name')
	let newName = oldName || uuidv4()

	newName = oldName?.includes(params.suffix)
		? oldName
		: `${oldName}_${params.suffix}`

	const numberOfCharactersToRemove =
		getNumberOfCharactersToRemoveOccurrencePart({
			elementName: newName,
			hasUnderscore: !newName?.endsWith(params.suffix)
		})

	const nameOccurrence = getTypeNextOccurrence({
		family: params.family,
		valueToTest: newName?.substring(0, numberOfCharactersToRemove),
		removeOccurrencePartToTestedValue: true
	})

	if (params.skipFirstOccurrence && nameOccurrence === 1) return newName

	const newSuffixedNameWithOccurrence = `${newName}_${nameOccurrence}`
	const newSuffixedNameCleanedFormOldOccurrenceAndWithNewOccurrence = `${newName?.substring(0, numberOfCharactersToRemove)}_${nameOccurrence}`

	return newName?.endsWith(params.suffix)
		? newSuffixedNameWithOccurrence
		: newSuffixedNameCleanedFormOldOccurrenceAndWithNewOccurrence
}

/**
 * Retrieves the next occurrence number for a type element with the same name base.
 *
 * @param params - The parameters for the function.
 * @param params.family - The family of the type element, excluding 'lNodeType'.
 * @param params.valueToTest - The value to test against existing type elements.
 * @param params.removeOccurrencePartToTestedValue - A boolean indicating whether to remove the occurrence part from the tested value.
 * @returns The next occurrence number for a type element with the same name base.
 */
export function getTypeNextOccurrence(params: {
	family?: AvailableTypeFamily
	valueToTest: string
	removeOccurrencePartToTestedValue: boolean
}): number {
	const filteredElements = getElementsWithSameNameBase(params)
	const currentHighestOccurrence =
		getHighestOccurrenceNumberOfElementsWithSameNameBase(filteredElements)

	return currentHighestOccurrence + 1
}

/**
 * Retrieves elements with the same name base.
 *
 * @param params - The parameters for the function.
 * @param params.family - The family of the type element
 * @param params.valueToTest - The value to test against existing type elements.
 * @param params.removeOccurrencePartToTestedValue - A boolean indicating whether to remove the occurrence part from the tested value.
 * @returns An array of type elements with the same name base.
 */
export function getElementsWithSameNameBase(params: {
	family?: AvailableTypeFamily
	valueToTest: string
	removeOccurrencePartToTestedValue: boolean
}) {
	let elementsToFilter: TypeElement<AvailableTypeFamily>[] = []

	if (params.family)
		elementsToFilter = Object.values(
			typeElementsStore.typeElementsPerFamily[params.family]
		)
	else
		elementsToFilter = Object.values(
			typeElementsStore.typeElementsPerFamily
		).flatMap((typeElements) => Object.values(typeElements))

	return elementsToFilter.filter((typeElement) => {
		if (params.removeOccurrencePartToTestedValue) {
			const numberOfCharactersToRemove =
				getNumberOfCharactersToRemoveOccurrencePart({
					elementName: typeElement.attributes?.name,
					hasUnderscore: true
				})

			return (
				typeElement.attributes?.name?.substring(
					0,
					numberOfCharactersToRemove
				) === params.valueToTest
			)
		}

		return typeElement.attributes?.name === params.valueToTest
	})
}

/**
 * Gets the highest occurrence number of elements with the same name base.
 *
 * This function iterates over an array of `TypeElement` objects and finds the highest numerical suffix
 * in the `name` attribute of the elements. The numerical suffix is expected to be at the end of the name.
 *
 * @template GenericFamily - A type that extends `AvailableTypeFamily` excluding 'lNodeType'.
 * @param elements - An array of `TypeElement` objects to be processed.
 * @returns The highest numerical suffix found in the `name` attributes of the elements.
 */
function getHighestOccurrenceNumberOfElementsWithSameNameBase<
	GenericFamily extends AvailableTypeFamily
>(elements: TypeElement<GenericFamily>[]): number {
	return elements.reduce((highest, element) => {
		const name = element.attributes?.name
		if (!name) return highest

		const matches = name.match(/\d+$/)
		if (!matches) return highest

		const number = Number.parseInt(matches[0], 10)
		return number > highest ? number : highest
	}, 0)
}

/**
 * Calculates the number of characters to remove from the end of a string based on the presence of a numeric suffix and an optional underscore.
 *
 * @param params - The parameters for the function.
 * @param params.currentName - The name string to evaluate. If null or undefined, the function returns 0.
 * @param params.hasUnderscore - A boolean indicating whether an underscore should be considered in the calculation.
 * @returns The number of characters to remove from the end of the string.
 */
export function getNumberOfCharactersToRemoveOccurrencePart(params: {
	elementName: string | null | undefined
	hasUnderscore: boolean
}): number {
	if (!params.elementName) return 0
	const currentElementNameLength = params.elementName.length || 0
	const currentElementNameOccurrenceAsStringLength =
		params.elementName.match(/\d+$/)?.[0].length || 0

	const extraUnderscoreCharacter = (params.hasUnderscore && 1) || 0

	return (
		currentElementNameLength -
		currentElementNameOccurrenceAsStringLength -
		extraUnderscoreCharacter
	)
}

export function computeNameWithOptionalSuffix(
	family: 'function' | 'bay',
	inputValue: string | undefined,
	defaultPrefix: string,
	nextOcc: number
): string {
	const typed = inputValue?.trim()
	if (typed) {
		const explicitSuffix = /.+_\d+$/.test(typed)
		if (explicitSuffix) {
			const exists = Object.values(
				typeElementsStore.typeElementsPerFamily[family]
			).some(
				(el) =>
					(el as TypeElement<typeof family>).parameters?.label ===
						typed ||
					(el as TypeElement<typeof family>).attributes?.name ===
						typed
			)
			if (!exists) return typed
		}
		return `${typed}_${nextOcc}`
	}
	return `${defaultPrefix}_${nextOcc}`
}
