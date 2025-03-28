// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import {
	TYPE_FAMILY,
	COLUMN_KEY_TO_TYPE_FAMILY,
	ALLOWED_USER_DECISIONS
} from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from '../type-elements/consolidate-types.helper'
import { handleImportOfAnyElement } from './imported-tree-handler.helper'
// STORES
import { importsStore, typeElementsStore } from '@/headless/stores'
// COMPONENTS
import UpdateConfirmationDialog from '@/ui/components/import/update-confirmation-dialog.svelte'
// TYPES
import type {
	TypeElementByIds,
	AvailableColumnsWhereImportIsAllowed,
	AvailableImportedTypeFamily,
	UserDecision,
	EditEvent,
	RemoveEvent
} from '@/headless/stores'
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'

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

	const hasFunctions = !!Object.keys(importsStore.loadedFunction.elementByIds)
		.length
	const hasDependencies =
		!!Object.keys(importsStore.loadedFunction.dependencies).length &&
		!!Object.keys(
			importsStore.loadedTypeElementsPerFamily.lNodeType.available
		).length

	importsStore.isContainerOpen.functionType = true
	importsStore.isContainerOpen.lNodeType = hasFunctions && hasDependencies
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

function addImportedType(params: { forceCreate: boolean }) {
	const host = pluginGlobalStore.host
	if (!host) throw new Error('Host is not defined')

	const flattenedActions: (EditEvent | RemoveEvent)[] = []
	for (const [editEvent, removeEvent] of importsStore.currentImportActions) {
		flattenedActions.push(editEvent)
		if (!params.forceCreate && removeEvent)
			flattenedActions.push(removeEvent)
	}

	createAndDispatchEditEvent({
		host,
		edit: flattenedActions
	})

	importsStore.currentImportActionsByElementIds = []
}

function handleUserDecision(decision: UserDecision) {
	return {
		proceed: () => addImportedType({ forceCreate: false }),
		forceCreate: () => addImportedType({ forceCreate: true }),
		cancel: () => {
			importsStore.currentImportActionsByElementIds = []
		}
	}[decision]()
}

async function fireUserDecisionDialog() {
	dialogStore.innerComponent = UpdateConfirmationDialog
	const decision = await dialogStore.openDialog()

	if (
		decision &&
		typeGuard.isTuplesIncludingString(decision, ALLOWED_USER_DECISIONS)
	)
		handleUserDecision(decision)
}

export async function handleImportsAndFireDialogDecision(
	typeElementKey: string,
	typeElementFamily: AvailableImportedTypeFamily
) {
	const { element: currentImportedRootElement } =
		importsStore.loadedTypeElementsPerFamily[typeElementFamily].available[
			typeElementKey
		]

	await handleImportOfAnyElement(currentImportedRootElement)
	await fireUserDecisionDialog()
}

export async function handleAllImportsAndFireDialogDecision(
	typeElementFamily: AvailableImportedTypeFamily
) {
	for (const loadedTypeElementKey of Object.keys(
		importsStore.loadedTypeElementsPerFamily[typeElementFamily].available
	)) {
		const { element: currentImportedRootElement } =
			importsStore.loadedTypeElementsPerFamily[typeElementFamily]
				.available[loadedTypeElementKey]
		await handleImportOfAnyElement(currentImportedRootElement)
	}
	await fireUserDecisionDialog()
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
