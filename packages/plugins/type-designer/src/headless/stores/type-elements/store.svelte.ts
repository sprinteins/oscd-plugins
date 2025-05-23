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
	getElementsWithSameNameBase,
	computeNameWithOptionalSuffix
} from './type-naming.helper'
import { getFilteredTypeElementByIds } from './filter.helper'
import { duplicateElement } from '@/headless/stores/type-elements/common-crud-operation.helper'
// TYPES
import type { TypeElementsByFamily, Columns } from '@/headless/stores'

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
			},
			importedTypeElements: {
				bay: {
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.bayType,
						importsStore.loadedTypeElementsPerFamily.bay.all
					),
					toUpdate: getFilteredTypeElementByIds(
						this.filtersByColumns.bayType,
						importsStore.loadedTypeElementsPerFamily.bay.toUpdate
					),
					toAdd: getFilteredTypeElementByIds(
						this.filtersByColumns.bayType,
						importsStore.loadedTypeElementsPerFamily.bay.toAdd
					)
				}
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
			},
			importedTypeElements: {
				generalEquipment: {
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.equipmentType,
						importsStore.loadedTypeElementsPerFamily
							.generalEquipment.all
					),
					toUpdate: getFilteredTypeElementByIds(
						this.filtersByColumns.equipmentType,
						importsStore.loadedTypeElementsPerFamily
							.generalEquipment.toUpdate
					),
					toAdd: getFilteredTypeElementByIds(
						this.filtersByColumns.equipmentType,
						importsStore.loadedTypeElementsPerFamily
							.generalEquipment.toAdd
					)
				},
				conductingEquipment: {
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.equipmentType,
						importsStore.loadedTypeElementsPerFamily
							.conductingEquipment.all
					),
					toUpdate: getFilteredTypeElementByIds(
						this.filtersByColumns.equipmentType,
						importsStore.loadedTypeElementsPerFamily
							.conductingEquipment.toUpdate
					),
					toAdd: getFilteredTypeElementByIds(
						this.filtersByColumns.equipmentType,
						importsStore.loadedTypeElementsPerFamily
							.conductingEquipment.toAdd
					)
				}
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
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.functionType,
						importsStore.loadedTypeElementsPerFamily.function.all
					),
					toUpdate: getFilteredTypeElementByIds(
						this.filtersByColumns.functionType,
						importsStore.loadedTypeElementsPerFamily.function
							.toUpdate
					),
					toAdd: getFilteredTypeElementByIds(
						this.filtersByColumns.functionType,
						importsStore.loadedTypeElementsPerFamily.function.toAdd
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
					all: getFilteredTypeElementByIds(
						this.filtersByColumns.lNodeType,
						importsStore.loadedTypeElementsPerFamily.lNodeType.all
					),
					toUpdate: getFilteredTypeElementByIds(
						this.filtersByColumns.lNodeType,
						importsStore.loadedTypeElementsPerFamily.lNodeType
							.toUpdate
					),
					toAdd: getFilteredTypeElementByIds(
						this.filtersByColumns.lNodeType,
						importsStore.loadedTypeElementsPerFamily.lNodeType.toAdd
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
			[TYPE_FAMILY.bay]: computeNameWithOptionalSuffix(
				'bay',
				this.newTypeNameInputValueByColumnKey[COLUMNS.bayType],
				this.namePrefixByTypeFamily[TYPE_FAMILY.bay],
				this.nextOccurrenceByTypeFamily[TYPE_FAMILY.bay]
			),
			[TYPE_FAMILY.generalEquipment]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.generalEquipment]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.generalEquipment]}`,
			[TYPE_FAMILY.conductingEquipment]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.conductingEquipment]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.conductingEquipment]}`,
			[TYPE_FAMILY.function]: computeNameWithOptionalSuffix(
				'function',
				this.newTypeNameInputValueByColumnKey[COLUMNS.functionType],
				this.namePrefixByTypeFamily[TYPE_FAMILY.function],
				this.nextOccurrenceByTypeFamily[TYPE_FAMILY.function]
			)
		}
	})
}

export const typeElementsStore = new UseTypeElementsStore()
