// CORE
import {
	typeGuard,
	findAllStandardElementsBySelector,
	areElementsIdentical,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
import { dialogStore, pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import { TYPE_FAMILY, ALLOWED_USER_DECISIONS } from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from '../type-elements/consolidate-types.helper'
import { handleImportOfAnyElement } from './imported-tree-handler.helper'
import { getCurrentImportedActionsWithUpdatedTemplateUuids } from './import-attribute.helper'
// STORES
import { importsStore, typeElementsStore } from '@/headless/stores'
// COMPONENTS
import UpdateConfirmationDialog from '@/ui/components/import/update-confirmation-dialog.svelte'
// TYPES
import type {
	TypeElementByIds,
	UserDecision,
	EditEvent,
	RemoveEvent,
	AvailableTypeFamily,
	ImportScope
} from '@/headless/stores'

//====== READ ======//

export function findAndSortLoadedElements(params: {
	family: AvailableTypeFamily
	selector: string
}) {
	const rawElements = importsStore.loadedXmlDocument
		? findAllStandardElementsBySelector<typeof params.family, 'ed2Rev1'>({
				selector: params.selector,
				root: importsStore.loadedXmlDocument.documentElement
			})
		: []

	const mappedRawElements = getAndMapTypeElements({
		family: params.family,
		typeElements: rawElements,
		rootElement: importsStore.loadedXmlDocument?.documentElement
	})

	const sortedElements = sortLoadedElements({
		family: params.family,
		elements: mappedRawElements
	})

	return {
		raw: mappedRawElements,
		...sortedElements
	}
}

//====== CREATE ======//

function addImportedType(params: { forceCreate: boolean }) {
	const host = pluginGlobalStore.host
	if (!host) throw new Error('Host is not defined')

	const flattenedActions: (EditEvent | RemoveEvent)[] = []
	const currentImportedActionsWithUpdatedTemplateUuids =
		getCurrentImportedActionsWithUpdatedTemplateUuids(
			importsStore.currentImportActions
		)

	for (const [
		editEvent,
		removeEvent
	] of currentImportedActionsWithUpdatedTemplateUuids) {
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
	dialogStore.mountInnerComponent({
		innerComponent: UpdateConfirmationDialog
	})
	const decision = await dialogStore.openDialog()

	if (
		decision &&
		typeGuard.isTuplesIncludingString(decision, ALLOWED_USER_DECISIONS)
	)
		handleUserDecision(decision)
}

export async function handleImportsAndFireDialogDecision(
	typeElementKey: string,
	typeElementFamily: AvailableTypeFamily
) {
	const { element: currentImportedRootElement } =
		importsStore.loadedTypeElementsPerFamily[typeElementFamily].all[
			typeElementKey
		]

	await handleImportOfAnyElement(currentImportedRootElement)
	await fireUserDecisionDialog()
}

export async function handleAllImportsAndFireDialogDecision(
	typeElementFamily: AvailableTypeFamily[],
	importScope: 'all' | ImportScope
) {
	for (const currentFamily of typeElementFamily) {
		for (const importedTypeElement of Object.values(
			importsStore.loadedTypeElementsPerFamily[currentFamily][importScope]
		))
			await handleImportOfAnyElement(importedTypeElement.element)
	}

	await fireUserDecisionDialog()
}

//====== DELETE ======//

export function removeLoadedElements() {
	importsStore.currentFilename = ''
	importsStore.loadedXmlDocument = undefined
}

//====== LOCAL HELPERS ======//

function sortLoadedElements(params: {
	family: AvailableTypeFamily
	elements: TypeElementByIds<typeof params.family>
}) {
	return Object.entries(params.elements).reduce(
		(accumulator, [loadedTypeElementIdOrUuid, loadedTypeElement]) => {
			const matchingElement = Object.values(
				typeElementsStore.typeElementsPerFamily[params.family]
			).find((typeElement) => {
				const isIdMatch =
					params.family === TYPE_FAMILY.lNodeType
						? typeElement.attributes?.id ===
							loadedTypeElementIdOrUuid
						: typeElement.attributes?.originUuid ===
							loadedTypeElementIdOrUuid

				return isIdMatch
			})

			if (matchingElement) {
				const isIdentical = areElementsIdentical({
					firstElement: matchingElement.element,
					secondElement: loadedTypeElement.element,
					attributesToIgnore: [
						'uuid',
						'templateUuid',
						'originUuid',
						'name'
					]
				})

				if (!isIdentical) {
					accumulator.all[loadedTypeElementIdOrUuid] =
						loadedTypeElement
					accumulator.toUpdate[loadedTypeElementIdOrUuid] =
						loadedTypeElement
				}
			} else {
				accumulator.all[loadedTypeElementIdOrUuid] = loadedTypeElement
				accumulator.toAdd[loadedTypeElementIdOrUuid] = loadedTypeElement
			}
			return accumulator
		},
		{
			all: {} as TypeElementByIds<AvailableTypeFamily>,
			toUpdate: {} as TypeElementByIds<AvailableTypeFamily>,
			toAdd: {} as TypeElementByIds<AvailableTypeFamily>
		}
	)
}
