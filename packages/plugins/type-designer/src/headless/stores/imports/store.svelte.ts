// CORE
import { findAllStandardElementsBySelector } from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import { TYPE_FAMILY, COLUMNS } from '@/headless/constants'
// HELPERS
import {
	loadElements,
	getAvailableElementsToImport,
	handleImportsAndFireDialogDecision,
	handleAllImportsAndFireDialogDecision,
	removeImportedElements
} from './imported-type-crud-operation.helper'
import { loadFromCompas, loadFromLocal } from './load-file.helper'
// TYPES
import type {
	TypeElementByIds,
	AvailableColumnsWhereImportIsAllowed
} from '@/headless/stores'
import type { EditEvent, RemoveEvent } from './types'

class UseImportsStore {
	//====== STATES ======//

	importedXmlDocument = $state<XMLDocument>()
	currentImportColumnKey = $state<AvailableColumnsWhereImportIsAllowed>()

	currentImportActionsByElementIds = $state<
		Record<string, [EditEvent, RemoveEvent | undefined]>[]
	>([])

	currentImportActions = $derived(
		this.currentImportActionsByElementIds.flatMap(
			(currentImportActionByElementIds) =>
				Object.values(currentImportActionByElementIds)
		)
	)

	currentImportedElementGroupedByActions = $derived.by(() => {
		return this.currentImportActionsByElementIds.reduce(
			(groupedActions, currentImportActionByElementIds) => {
				for (const [
					elementId,
					[editEvent, removeEvent]
				] of Object.entries(currentImportActionByElementIds)) {
					const elementTagName = editEvent.node.tagName
					const elementNameOrId =
						editEvent.node.getAttribute('name') || elementId

					const fullLabel = `${elementTagName} - ${elementNameOrId}`

					if (removeEvent) {
						groupedActions.replace.push(fullLabel)
					} else {
						groupedActions.create.push(fullLabel)
					}
				}
				return groupedActions
			},
			{ create: [], replace: [] } as {
				create: string[]
				replace: string[]
			}
		)
	})

	fileInput: Record<
		AvailableColumnsWhereImportIsAllowed,
		HTMLInputElement | null
	> = $state({
		[COLUMNS.functionType]: null,
		[COLUMNS.lNodeType]: null
	})

	currentFilenameByColumnKey = $state({
		functionType: '',
		lNodeType: ''
	})

	lastImportSource = $state<'compas' | 'local'>()

	isContainerOpen = $state<
		Record<AvailableColumnsWhereImportIsAllowed, boolean>
	>({
		functionType: false,
		lNodeType: false
	})

	//====== COMPUTED ======//

	functionFromBayTemplateElements = $derived.by(() => {
		if (this.importedXmlDocument)
			return findAllStandardElementsBySelector<'function', 'ed2Rev1'>({
				selector: 'Bay[name=TEMPLATE] > Function',
				root: this.importedXmlDocument.documentElement
			})
	})

	lNodeTypeElements = $derived.by(() => {
		if (this.importedXmlDocument)
			return findAllStandardElementsBySelector<'lNodeType', 'ed2Rev1'>({
				selector: 'LNodeType',
				root: this.importedXmlDocument.documentElement
			})
	})

	loadedFunction: {
		elementByIds: TypeElementByIds<typeof TYPE_FAMILY.function>
		dependencies: TypeElementByIds<typeof TYPE_FAMILY.lNodeType>
	} = $state({
		elementByIds: {},
		dependencies: {}
	})

	loadedLNodeType: TypeElementByIds<typeof TYPE_FAMILY.lNodeType> = $state({})

	loadedTypeElementsPerFamily = $derived({
		[TYPE_FAMILY.function]: {
			available: getAvailableElementsToImport(
				TYPE_FAMILY.function,
				this.loadedFunction.elementByIds
			),
			all: this.loadedFunction.elementByIds
		},
		[TYPE_FAMILY.lNodeType]: {
			available: {
				...getAvailableElementsToImport(
					TYPE_FAMILY.lNodeType,
					this.loadedLNodeType
				),
				...getAvailableElementsToImport(
					TYPE_FAMILY.lNodeType,
					this.loadedFunction.dependencies
				)
			},
			all: {
				...this.loadedFunction.dependencies,
				...this.loadedLNodeType
			}
		}
	})

	//====== PROXY TO HELPERS ======//

	// imports
	loadElements = loadElements
	loadFromCompas = loadFromCompas
	loadFromLocal = loadFromLocal
	handleImportsAndFireDialogDecision = handleImportsAndFireDialogDecision
	handleAllImportsAndFireDialogDecision =
		handleAllImportsAndFireDialogDecision
	removeImportedElements = removeImportedElements
}

export const importsStore = new UseImportsStore()
