// CONSTANTS
import { TYPE_FAMILY, COLUMN_KEY_TO_TYPE_FAMILY } from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from '../type-elements/consolidate-types.helper'
import { createNewTypeBasedOnImport } from '../type-elements/type-crud-operation.helper'
import { addImportedChildElements } from './imported-refs-crud-operation.helper'
// STORES
import { importsStore, typeElementsStore } from '@/headless/stores'
// TYPES
import type {
	TypeElementByIds,
	AvailableColumnsWhereImportIsAllowed,
	AvailableImportedTypeFamily
} from '@/headless/stores'

//====== LOCAL HELPERS ======//

function loadFunction() {
	importsStore.loadedFunction.elementByIds = getAndMapTypeElements({
		family: TYPE_FAMILY.function,
		typeElements: importsStore.functionFromBayTemplateElements,
		rootElement: importsStore.importedXmlDocument?.documentElement
	})

	importsStore.loadedFunction.dependencies = getAndMapTypeElements({
		family: TYPE_FAMILY.lNodeType,
		typeElements: importsStore.lNodeTypeElements,
		rootElement: importsStore.importedXmlDocument?.documentElement
	})

	importsStore.isContainerOpen.functionType = true
	importsStore.isContainerOpen.lNodeType = true
}

function loadLNodeType() {
	importsStore.loadedLNodeType = getAndMapTypeElements({
		family: TYPE_FAMILY.lNodeType,
		typeElements: importsStore.lNodeTypeElements,
		rootElement: importsStore.importedXmlDocument?.documentElement
	})

	importsStore.isContainerOpen.lNodeType = true
}

//====== READ ======//

export function loadElements() {
	const currentTypeFamily =
		importsStore.currentImportColumnKey &&
		COLUMN_KEY_TO_TYPE_FAMILY[importsStore.currentImportColumnKey]

	if (currentTypeFamily === TYPE_FAMILY.function) loadFunction()
	if (currentTypeFamily === TYPE_FAMILY.lNodeType) loadLNodeType()
}

export function getAvailableElementsToImport<
	GenericImportedTypeFamily extends AvailableImportedTypeFamily
>(
	importedTypeFamily: GenericImportedTypeFamily,
	importedTypeElements: TypeElementByIds<GenericImportedTypeFamily>
) {
	const availableElementsToImportEntries = Object.entries(
		importedTypeElements
	).filter(([importedTypeElementIdOrUuid, importedTypeElement]) => {
		const isElementAlreadyPresentInTypeElementsPerFamily = Object.values(
			typeElementsStore.typeElementsPerFamily[importedTypeFamily]
		).some((typeElement) => {
			if (importedTypeFamily === TYPE_FAMILY.lNodeType)
				return (
					typeElement.attributes?.id === importedTypeElementIdOrUuid
				)
			return (
				typeElement.attributes?.originUuid ===
				importedTypeElementIdOrUuid
			)
		})

		if (isElementAlreadyPresentInTypeElementsPerFamily) return false
		return true
	})

	return Object.fromEntries(availableElementsToImportEntries)
}

//====== CREATE ======//

export async function addImportedElement(
	typeElementKey: string,
	typeElementFamily: AvailableImportedTypeFamily
) {
	const { element } =
		importsStore.importedTypeElementsPerFamily[typeElementFamily].available[
			typeElementKey
		]

	const childElementsToAdd = Array.from(element.children)
	if (childElementsToAdd.length)
		await addImportedChildElements(childElementsToAdd)

	await createNewTypeBasedOnImport({
		typeElementFamily,
		elementToAdd: element
	})
}

export async function addAllImportedElements(
	typeElementFamily: AvailableImportedTypeFamily
) {
	for (const importedTypeElementKey of Object.keys(
		importsStore.importedTypeElementsPerFamily[typeElementFamily].available
	)) {
		await addImportedElement(importedTypeElementKey, typeElementFamily)
	}
}

//====== DELETE ======//

export function removeImportedElements(
	currentColumnKey: AvailableColumnsWhereImportIsAllowed
) {
	const currentTypeFamily = COLUMN_KEY_TO_TYPE_FAMILY[currentColumnKey]

	if (currentTypeFamily === TYPE_FAMILY.function) {
		importsStore.loadedFunction.elementByIds = {}
		importsStore.loadedFunction.dependencies = {}
		importsStore.isContainerOpen.functionType = false
	}
	if (currentTypeFamily === TYPE_FAMILY.lNodeType) {
		importsStore.loadedLNodeType = {}
		importsStore.isContainerOpen.lNodeType = false
	}
}
