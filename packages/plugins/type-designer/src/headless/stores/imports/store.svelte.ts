// CORE
import { findAllStandardElementsBySelector } from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import { TYPE_FAMILY, COLUMNS } from '@/headless/constants'
// HELPERS
import {
	importElements,
	getAvailableElementsToImport,
	addImportedElement,
	removeImportedElements
} from './imported-type-crud-operation.helper'
import { loadFromCompas, loadFromLocal } from './load-file.helper'
// TYPES
import type {
	TypeElementByIds,
	AvailableColumnsWhereImportIsAllowed
} from '@/headless/stores'

class UseImportsStore {
	//====== STATES ======//

	importedXmlDocument = $state<XMLDocument>()
	currentImportColumnKey = $state<AvailableColumnsWhereImportIsAllowed>()

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

	importedFunction: {
		elementByIds: TypeElementByIds<typeof TYPE_FAMILY.function>
		dependencies: TypeElementByIds<typeof TYPE_FAMILY.lNodeType>
	} = $state({
		elementByIds: {},
		dependencies: {}
	})

	importedLNodeType: TypeElementByIds<typeof TYPE_FAMILY.lNodeType> = $state(
		{}
	)

	importedTypeElementsPerFamily = $derived({
		[TYPE_FAMILY.function]: {
			available: getAvailableElementsToImport(
				TYPE_FAMILY.function,
				this.importedFunction.elementByIds
			),
			all: this.importedFunction.elementByIds
		},
		[TYPE_FAMILY.lNodeType]: {
			available: {
				...getAvailableElementsToImport(
					TYPE_FAMILY.lNodeType,
					this.importedLNodeType
				),
				...getAvailableElementsToImport(
					TYPE_FAMILY.lNodeType,
					this.importedFunction.dependencies
				)
			},
			all: {
				...this.importedFunction.dependencies,
				...this.importedLNodeType
			}
		}
	})

	//====== PROXY TO HELPERS ======//

	// imports
	importElements = importElements
	loadFromCompas = loadFromCompas
	loadFromLocal = loadFromLocal
	addImportedElement = addImportedElement
	removeImportedElements = removeImportedElements
}

export const importsStore = new UseImportsStore()
