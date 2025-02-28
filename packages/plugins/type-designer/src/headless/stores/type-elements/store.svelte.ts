// STORES
import { pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	REF_FAMILY,
	TYPE_FAMILY,
	COLUMNS,
	EQUIPMENTS
} from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from './consolidate-types.helper'
import {
	createNewType,
	duplicateType,
	deleteTypeAndRefs
} from './type-crud-operation.helper'
import { createNewRef } from './ref-crud-operation.helper'
import { getTypeNextOccurrence } from './type-naming.helper'
import { getFilteredTypeElementByIds } from './filter.helper'
// TYPES
import type { TypeElementsByFamily, Columns } from '@/headless/stores'

class UseTypeElementsStore {
	//====== INITIALIZATION ======//

	typeElementsPerFamily: TypeElementsByFamily = $derived.by(() => ({
		[TYPE_FAMILY.bay]: getAndMapTypeElements(
			TYPE_FAMILY.bay,
			pluginLocalStore.bayTypeElements
		),
		[TYPE_FAMILY.generalEquipment]: getAndMapTypeElements(
			TYPE_FAMILY.generalEquipment,
			pluginLocalStore.bayTemplateSubElements?.generalEquipment
		),
		[TYPE_FAMILY.conductingEquipment]: getAndMapTypeElements(
			TYPE_FAMILY.conductingEquipment,
			pluginLocalStore.bayTemplateSubElements?.conductingEquipment
		),
		[TYPE_FAMILY.function]: getAndMapTypeElements(
			TYPE_FAMILY.function,
			pluginLocalStore.bayTemplateSubElements?.function
		),
		[TYPE_FAMILY.lNodeType]: getAndMapTypeElements(
			TYPE_FAMILY.lNodeType,
			pluginLocalStore.dataTypeTemplatesSubElements?.lNodeType
		)
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
			}
		},
		[COLUMNS.lNodeType]: {
			name: 'LN Types',
			groupedTypeElements: {
				lNodeType: getFilteredTypeElementByIds(
					this.filtersByColumns.lNodeType,
					this.typeElementsPerFamily.lNodeType
				)
			}
		}
	})

	//====== PROXY TO HELPERS ======//

	// type
	createNewType = createNewType
	duplicateType = duplicateType
	deleteTypeAndRefs = deleteTypeAndRefs
	// ref
	createNewRef = createNewRef
	// naming
	getTypeNextOccurrence = getTypeNextOccurrence

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
			[TYPE_FAMILY.bay]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.bay]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.bay]}`,
			[TYPE_FAMILY.generalEquipment]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.generalEquipment]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.generalEquipment]}`,
			[TYPE_FAMILY.conductingEquipment]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.conductingEquipment]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.conductingEquipment]}`,
			[TYPE_FAMILY.function]: `${this.namePrefixByTypeFamily[TYPE_FAMILY.function]}_${this.nextOccurrenceByTypeFamily[TYPE_FAMILY.function]}`
		}
	})
}

export const typeElementsStore = new UseTypeElementsStore()
