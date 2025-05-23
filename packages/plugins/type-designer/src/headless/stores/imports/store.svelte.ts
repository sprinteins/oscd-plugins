// CONSTANTS
import { TYPE_FAMILY } from '@/headless/constants'
// HELPERS
import {
	findAndSortLoadedElements,
	removeLoadedElements,
	handleImportsAndFireDialogDecision,
	handleAllImportsAndFireDialogDecision
} from './imported-type-crud-operation.helper'
import { loadFromCompas, loadFromLocal } from './load-file.helper'
// TYPES
import type { EditEvent, RemoveEvent } from '@/headless/stores'

class UseImportsStore {
	//====== STATES ======//

	fileInput = $state<HTMLInputElement>()
	currentFilename = $state('')
	loadedXmlDocument = $state.raw<XMLDocument>()
	lastImportSource = $state<'compas' | 'local'>()

	currentImportActionsByElementIds = $state<
		Record<string, [EditEvent, RemoveEvent | undefined]>[]
	>([])

	//====== COMPUTED ======//

	loadedTypeElementsPerFamily = $derived.by(() => ({
		[TYPE_FAMILY.bay]: findAndSortLoadedElements({
			family: TYPE_FAMILY.bay,
			selector: 'VoltageLevel[name=TEMPLATE] > Bay:not([name=TEMPLATE])'
		}),
		[TYPE_FAMILY.generalEquipment]: findAndSortLoadedElements({
			family: TYPE_FAMILY.generalEquipment,
			selector: 'Bay[name=TEMPLATE] > GeneralEquipment'
		}),
		[TYPE_FAMILY.conductingEquipment]: findAndSortLoadedElements({
			family: TYPE_FAMILY.conductingEquipment,
			selector: 'Bay[name=TEMPLATE] > ConductingEquipment'
		}),
		[TYPE_FAMILY.function]: findAndSortLoadedElements({
			family: TYPE_FAMILY.function,
			selector: 'Bay[name=TEMPLATE] > Function'
		}),
		[TYPE_FAMILY.lNodeType]: findAndSortLoadedElements({
			family: TYPE_FAMILY.lNodeType,
			selector: 'LNodeType'
		})
	}))

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

	//====== PROXY TO HELPERS ======//

	// imports
	loadFromCompas = loadFromCompas
	loadFromLocal = loadFromLocal
	removeLoadedElements = removeLoadedElements
	handleImportsAndFireDialogDecision = handleImportsAndFireDialogDecision
	handleAllImportsAndFireDialogDecision =
		handleAllImportsAndFireDialogDecision
}

export const importsStore = new UseImportsStore()
