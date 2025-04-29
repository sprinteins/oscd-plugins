// STORES
import { importsStore, pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	REF_FAMILY,
	TYPE_FAMILY,
	COLUMNS,
	EQUIPMENTS
} from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from './consolidate-types.helper'
import { createNewType, deleteTypeAndRefs } from './type-crud-operation.helper'
import { createNewRef } from './ref-crud-operation.helper'
import {
	getTypeNextOccurrence,
	getElementsWithSameNameBase
} from './type-naming.helper'
import { getFilteredTypeElementByIds } from './filter.helper'
import { duplicateElement } from '@/headless/stores/type-elements/common-crud-operation.helper'
// TYPES
import type { TypeElementsByFamily, Columns, AvailableTypeFamily } from '@/headless/stores'

class UseTypeElementsStore {
	//====== INITIALIZATION ======//

	typeElementsPerFamily: TypeElementsByFamily = $derived.by(() => ({
		[TYPE_FAMILY.bay]: getAndMapTypeElements({
			family: TYPE_FAMILY.bay,
			typeElements: pluginLocalStore.bayTypeElements,
			rootElement: pluginLocalStore.rootElement
		}),
		[TYPE_FAMILY.generalEquipment]: getAndMapTypeElements({
			family: TYPE_FAMILY.generalEquipment,
			typeElements:
				pluginLocalStore.bayTemplateSubElements?.generalEquipment,
			rootElement: pluginLocalStore.rootElement
		}),
		[TYPE_FAMILY.conductingEquipment]: getAndMapTypeElements({
			family: TYPE_FAMILY.conductingEquipment,
			typeElements:
				pluginLocalStore.bayTemplateSubElements?.conductingEquipment,
			rootElement: pluginLocalStore.rootElement
		}),
		[TYPE_FAMILY.function]: getAndMapTypeElements({
			family: TYPE_FAMILY.function,
			typeElements: pluginLocalStore.bayTemplateSubElements?.function,
			rootElement: pluginLocalStore.rootElement
		}),
		[TYPE_FAMILY.lNodeType]: getAndMapTypeElements({
			family: TYPE_FAMILY.lNodeType,
			typeElements:
				pluginLocalStore.dataTypeTemplatesSubElements?.lNodeType,
			rootElement: pluginLocalStore.rootElement
		})
	}))

	filtersByColumns = $state({
		[COLUMNS.bayType]: '',
		[COLUMNS.equipmentType]: '',
		[COLUMNS.functionType]: '',
		[COLUMNS.lNodeType]: ''
	})

	mapRefTagNameToRefFamily = $derived({
		[pluginLocalStore.currentDefinition[REF_FAMILY.generalEquipment].tag]:
			REF_FAMILY.generalEquipment,
		[pluginLocalStore.currentDefinition[REF_FAMILY.conductingEquipment]
			.tag]: REF_FAMILY.conductingEquipment,
		[pluginLocalStore.currentDefinition[REF_FAMILY.function].tag]:
			REF_FAMILY.function,
		[pluginLocalStore.currentDefinition[REF_FAMILY.eqFunction].tag]:
			REF_FAMILY.eqFunction,
		[pluginLocalStore.currentDefinition[REF_FAMILY.lNode].tag]:
			REF_FAMILY.lNode
	})

	columns: Columns = $derived({
		[COLUMNS.bayType]: {
			name: 'Bay Types',
			groupedTypeElements: {
				bay: getFilteredTypeElementByIds(
					this.filtersByColumns.bayType,
					this.typeElementsPerFamily.bay
				)
			}
		},
		[COLUMNS.equipmentType]: {
			name: 'Equipment Types',
			groupedTypeElements: {
				generalEquipment: getFilteredTypeElementByIds(
					this.filtersByColumns.equipmentType,
					this.typeElementsPerFamily.generalEquipment
				),
				conductingEquipment: getFilteredTypeElementByIds(
					this.filtersByColumns.equipmentType,
					this.typeElementsPerFamily.conductingEquipment
				)
			}
		},
		[COLUMNS.functionType]: {
			name: 'Function Types',
			groupedTypeElements: {
				function: getFilteredTypeElementByIds(
					this.filtersByColumns.functionType,
					this.typeElementsPerFamily.function
				)
			},
			importedTypeElements: {
				function: {
					available: getFilteredTypeElementByIds(
						this.filtersByColumns.functionType,
						importsStore.loadedTypeElementsPerFamily.function
							.available
					),
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.functionType,
						importsStore.loadedTypeElementsPerFamily.function.all
					)
				}
			}
		},
		[COLUMNS.lNodeType]: {
			name: 'LN Types',
			groupedTypeElements: {
				lNodeType: getFilteredTypeElementByIds(
					this.filtersByColumns.lNodeType,
					this.typeElementsPerFamily.lNodeType
				)
			},
			importedTypeElements: {
				lNodeType: {
					available: getFilteredTypeElementByIds(
						this.filtersByColumns.lNodeType,
						importsStore.loadedTypeElementsPerFamily.lNodeType
							.available
					),
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.lNodeType,
						importsStore.loadedTypeElementsPerFamily.lNodeType.all
					)
				}
			}
		}
	})

	//====== PROXY TO HELPERS ======//
	// common
	duplicateElement = duplicateElement
	// type
	createNewType = createNewType
	deleteTypeAndRefs = deleteTypeAndRefs
	// ref
	createNewRef = createNewRef
	// naming
	getTypeNextOccurrence = getTypeNextOccurrence
	getElementsWithSameNameBase = getElementsWithSameNameBase

	//====== NEW TYPE ======//

	newTypeNameInputValueByColumnKey = $state({
		[COLUMNS.bayType]: '',
		[COLUMNS.functionType]: ''
	})
	newEquipmentType = $state<keyof typeof EQUIPMENTS>()
	selectedEquipmentName = $derived(
		this.newEquipmentType && EQUIPMENTS[this.newEquipmentType].label
	)
	namePrefixByTypeFamily = $derived({
		[TYPE_FAMILY.bay]: this.newTypeNameInputValueByColumnKey[
			COLUMNS.bayType
		]
			? this.newTypeNameInputValueByColumnKey[COLUMNS.bayType]
			: 'Bay',
		[TYPE_FAMILY.generalEquipment]: this.selectedEquipmentName || '',
		[TYPE_FAMILY.conductingEquipment]: this.selectedEquipmentName || '',
		[TYPE_FAMILY.function]: this.newTypeNameInputValueByColumnKey[
			COLUMNS.functionType
		]
			? this.newTypeNameInputValueByColumnKey[COLUMNS.functionType]
			: 'Func'
	})
	nextOccurrenceByTypeFamily = $derived({
		[TYPE_FAMILY.bay]: this.getTypeNextOccurrence({
			family: TYPE_FAMILY.bay,
			valueToTest: this.namePrefixByTypeFamily[TYPE_FAMILY.bay],
			removeOccurrencePartToTestedValue: true
		}),
		[TYPE_FAMILY.generalEquipment]: this.getTypeNextOccurrence({
			family: TYPE_FAMILY.generalEquipment,
			valueToTest:
				this.namePrefixByTypeFamily[TYPE_FAMILY.generalEquipment],
			removeOccurrencePartToTestedValue: true
		}),
		[TYPE_FAMILY.conductingEquipment]: this.getTypeNextOccurrence({
			family: TYPE_FAMILY.conductingEquipment,
			valueToTest:
				this.namePrefixByTypeFamily[TYPE_FAMILY.conductingEquipment],
			removeOccurrencePartToTestedValue: true
		}),
		[TYPE_FAMILY.function]: this.getTypeNextOccurrence({
			family: TYPE_FAMILY.function,
			valueToTest: this.namePrefixByTypeFamily[TYPE_FAMILY.function],
			removeOccurrencePartToTestedValue: true
		})
	})
	newComputedTypeName = $derived.by(() => {
		return {
			[TYPE_FAMILY.bay]: this.getComputedName(TYPE_FAMILY.bay),
			[TYPE_FAMILY.generalEquipment]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.generalEquipment]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.generalEquipment]}`,
			[TYPE_FAMILY.conductingEquipment]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.conductingEquipment]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.conductingEquipment]}`,
			[TYPE_FAMILY.function]: this.getComputedName(TYPE_FAMILY.function)
		}
	})


	private getComputedName(family: "function" | "bay") : string {
		// const inputValue = this.newTypeNameInputValueByColumnKey[this.columnKeyByTypeFamily[family]]
		
		const inputValue = "Func_1"

		if (inputValue) {
			const match = inputValue.match(/^(.+?)(?:_(\d+))?$/)
			if (match) {
				const baseName = match[1]
				const existingIndex = match[2]
				
				if (existingIndex) {
					const elementWithSameName = Object.values(this.typeElementsPerFamily[family])
						.find(element => element.parameters.label === inputValue)
					
					console.log("elementWithSameName", elementWithSameName)
					if (!elementWithSameName) {
						return inputValue
					}
					return `${inputValue}_1`
				}
				return `${baseName}_${this.nextOccurrenceByTypeFamily[family]}`
			}
		}

		return `${this.namePrefixByTypeFamily[family]}_${this.nextOccurrenceByTypeFamily[family]}`
	}
}

export const typeElementsStore = new UseTypeElementsStore()
