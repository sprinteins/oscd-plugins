// STORES
import { pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY_MAP, TYPE_FAMILY_MAP, COLUMNS } from '@/headless/constants'
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
import type {
	TypeElementsByFamily,
	Columns,
	AvailableTypeFamily,
	AvailableRefFamily
} from '@/headless/stores'

class UseTypeElementsStore {
	//====== STATES ======//

	typeElementsPerFamily: TypeElementsByFamily = $derived.by(() => ({
		[TYPE_FAMILY_MAP.bay]: getAndMapTypeElements(
			TYPE_FAMILY_MAP.bay,
			pluginLocalStore.templateBaysSubElements
		),
		[TYPE_FAMILY_MAP.generalEquipmentType]: getAndMapTypeElements(
			TYPE_FAMILY_MAP.generalEquipmentType,
			pluginLocalStore.equipmentTypeTemplatesSubElements
				?.generalEquipmentType
		),
		[TYPE_FAMILY_MAP.conductingEquipmentType]: getAndMapTypeElements(
			TYPE_FAMILY_MAP.conductingEquipmentType,
			pluginLocalStore.equipmentTypeTemplatesSubElements
				?.conductingEquipmentType
		),
		[TYPE_FAMILY_MAP.functionTemplate]: getAndMapTypeElements(
			TYPE_FAMILY_MAP.functionTemplate,
			pluginLocalStore.rootSubElements?.functionTemplate
		),
		[TYPE_FAMILY_MAP.lNodeType]: getAndMapTypeElements(
			TYPE_FAMILY_MAP.lNodeType,
			pluginLocalStore.dataTypeTemplatesSubElements?.lNodeType
		)
	}))

	filtersByColumns = $state({
		[COLUMNS.bay]: '',
		[COLUMNS.equipmentTypeTemplates]: '',
		[COLUMNS.functionTemplate]: '',
		[COLUMNS.lNodeType]: ''
	})

	columns: Columns = $derived({
		[COLUMNS.bay]: {
			name: 'Bay Types',
			groupedTypeElements: {
				bay: getFilteredTypeElementByIds(
					this.filtersByColumns.bay,
					this.typeElementsPerFamily.bay
				)
			}
		},
		[COLUMNS.equipmentTypeTemplates]: {
			name: 'Equipment Types',
			groupedTypeElements: {
				generalEquipmentType: getFilteredTypeElementByIds(
					this.filtersByColumns.equipmentTypeTemplates,
					this.typeElementsPerFamily.generalEquipmentType
				),
				conductingEquipmentType: getFilteredTypeElementByIds(
					this.filtersByColumns.equipmentTypeTemplates,
					this.typeElementsPerFamily.conductingEquipmentType
				)
			}
		},
		[COLUMNS.functionTemplate]: {
			name: 'Function Types',
			groupedTypeElements: {
				functionTemplate: getFilteredTypeElementByIds(
					this.filtersByColumns.functionTemplate,
					this.typeElementsPerFamily.functionTemplate
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

	getUniqueTypeRefsFunctionIds(family: AvailableTypeFamily): string[] {
		return Array.from(
			// remove duplicates with a Set
			new Set(
				Object.values(this.typeElementsPerFamily[family]).flatMap(
					(element) =>
						element.refs
							? [
									...Object.keys(element.refs.function),
									...Object.keys(element.refs.eqFunction)
								]
							: []
				)
			)
		)
	}

	functionsIdsByType = $derived.by(() => {
		const bayTypeRefsFunctionIds = this.getUniqueTypeRefsFunctionIds('bay')
		const generalEquipmentTypeRefsFunctionIds =
			this.getUniqueTypeRefsFunctionIds('generalEquipmentType')
		const conductingEquipmentTypeRefsFunctionIds =
			this.getUniqueTypeRefsFunctionIds('conductingEquipmentType')

		const eqFunctionsIds = [
			...generalEquipmentTypeRefsFunctionIds,
			...conductingEquipmentTypeRefsFunctionIds
		]

		const functionsIds = [...bayTypeRefsFunctionIds]

		return {
			eqFunctionsIds,
			functionsIds
		}
	})

	mapRefTagNameToRefFamily = $derived({
		[pluginLocalStore.currentDefinition[REF_FAMILY_MAP.generalEquipment]
			.tag]: REF_FAMILY_MAP.generalEquipment,
		[pluginLocalStore.currentDefinition[REF_FAMILY_MAP.conductingEquipment]
			.tag]: REF_FAMILY_MAP.conductingEquipment,
		[pluginLocalStore.currentDefinition[REF_FAMILY_MAP.function].tag]:
			REF_FAMILY_MAP.function,
		[pluginLocalStore.currentDefinition[REF_FAMILY_MAP.eqFunction].tag]:
			REF_FAMILY_MAP.eqFunction,
		[pluginLocalStore.currentDefinition[REF_FAMILY_MAP.lNode].tag]:
			REF_FAMILY_MAP.lNode
	})

	parentElementWrapperPerColumnKey: Record<
		Exclude<keyof Columns, 'lNodeType'>,
		Element | undefined | null
	> = $derived({
		bay: pluginLocalStore.substationsSubElements?.[0].voltageLevel?.[0],
		equipmentTypeTemplates:
			pluginLocalStore.rootSubElements?.equipmentTypeTemplates,
		functionTemplate:
			pluginLocalStore.currentUnstableRevisionRootPrivateWrapper
	})

	//====== PRIVATE METHODS ======//

	private getFunctionTemplateRefFamily(elementId: string) {
		if (this.functionsIdsByType.eqFunctionsIds.includes(elementId))
			return REF_FAMILY_MAP.eqFunction
		if (this.functionsIdsByType.functionsIds.includes(elementId))
			return REF_FAMILY_MAP.function
		return 'genericFunction'
	}

	getRefFamilyFromTypeFamily(
		typeFamily: Exclude<AvailableTypeFamily, 'bay'>,
		elementId: string
	): AvailableRefFamily | 'genericFunction' {
		return {
			[TYPE_FAMILY_MAP.generalEquipmentType]: () =>
				REF_FAMILY_MAP.generalEquipment,
			[TYPE_FAMILY_MAP.conductingEquipmentType]: () =>
				REF_FAMILY_MAP.conductingEquipment,
			[TYPE_FAMILY_MAP.functionTemplate]: () =>
				this.getFunctionTemplateRefFamily(elementId),
			[TYPE_FAMILY_MAP.lNodeType]: () => REF_FAMILY_MAP.lNode
		}[typeFamily]()
	}

	//====== PUBLIC METHODS ======//

	//====== PROXY TO HELPERS ======//
	// type
	createNewType = createNewType
	duplicateType = duplicateType
	deleteTypeAndRefs = deleteTypeAndRefs
	// ref
	createNewRef = createNewRef
	// naming
	getTypeNextOccurrence = getTypeNextOccurrence
}

export const typeElementsStore = new UseTypeElementsStore()
