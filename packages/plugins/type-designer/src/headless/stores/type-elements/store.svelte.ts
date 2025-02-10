// STORES
import { pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY_MAP, TYPE_FAMILY_MAP } from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from './consolidate-types.helper'
import {
	createNewType,
	updateType,
	duplicateType,
	deleteType
} from './type-crud-operation.helper'
import { createNewRef } from './ref-crud-operation.helper'
import { getTypeNextOccurrence } from './type-naming.helper'
// TYPES
import type {
	TypeElementsPerFamily,
	Columns,
	AvailableTypeFamily,
	AvailableRefFamily
} from '@/headless/stores'

class UseTypeElementsStore {
	//====== STATES ======//

	typeElementsPerFamily: TypeElementsPerFamily = $derived.by(() => ({
		bay: getAndMapTypeElements(
			TYPE_FAMILY_MAP.bay,
			pluginLocalStore.templateBaysSubElements
		),
		generalEquipmentType: getAndMapTypeElements(
			TYPE_FAMILY_MAP.generalEquipmentType,
			pluginLocalStore.equipmentTypeTemplatesSubElements
				?.generalEquipmentType
		),
		conductingEquipmentType: getAndMapTypeElements(
			TYPE_FAMILY_MAP.conductingEquipmentType,
			pluginLocalStore.equipmentTypeTemplatesSubElements
				?.conductingEquipmentType
		),
		functionTemplate: getAndMapTypeElements(
			TYPE_FAMILY_MAP.functionTemplate,
			pluginLocalStore.rootSubElements?.functionTemplate
		),
		lNodeType: getAndMapTypeElements(
			TYPE_FAMILY_MAP.lNodeType,
			pluginLocalStore.dataTypeTemplatesSubElements?.lNodeType
		)
	}))

	columns: Columns = $derived({
		bay: {
			name: 'Bay Types',
			groupedTypeElements: {
				bay: this.typeElementsPerFamily.bay
			}
		},
		equipmentTypeTemplates: {
			name: 'Equipment Types',
			groupedTypeElements: {
				generalEquipmentType:
					this.typeElementsPerFamily.generalEquipmentType,
				conductingEquipmentType:
					this.typeElementsPerFamily.conductingEquipmentType
			}
		},
		functionTemplate: {
			name: 'Function Types',
			groupedTypeElements: {
				functionTemplate: this.typeElementsPerFamily.functionTemplate
			}
		},
		lNodeType: {
			name: 'LN Types',
			groupedTypeElements: {
				lNodeType: this.typeElementsPerFamily.lNodeType
			}
		}
	})

	getUniqueTypeRefsFunctionIds(family: AvailableTypeFamily) {
		return Array.from(
			// remove duplicates with a Set
			new Set(
				Object.values(this.typeElementsPerFamily[family]).flatMap(
					(element) => element.refs?.functionTemplate || []
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

		// is EqFunction if it is not part of ConductingEquipment or Bay per Definition
		const eqFunctionsIds = generalEquipmentTypeRefsFunctionIds.filter(
			(id) =>
				!conductingEquipmentTypeRefsFunctionIds.includes(id) &&
				!bayTypeRefsFunctionIds.includes(id)
		)

		const functionsIds = [
			...generalEquipmentTypeRefsFunctionIds,
			...conductingEquipmentTypeRefsFunctionIds,
			...bayTypeRefsFunctionIds
		].filter((id) => !eqFunctionsIds.includes(id))

		return {
			eqFunctionsIds,
			functionsIds
		}
	})

	mapRefTagNameToFamily = $derived({
		[pluginLocalStore.currentDefinition[REF_FAMILY_MAP.bay].tag]:
			REF_FAMILY_MAP.bay,
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

	//====== PRIVATE ACTIONS ======//

	private getFunctionTemplateRefFamily(elementId: string) {
		if (this.functionsIdsByType.eqFunctionsIds.includes(elementId))
			return REF_FAMILY_MAP.eqFunction
		if (this.functionsIdsByType.functionsIds.includes(elementId))
			return REF_FAMILY_MAP.function
		return 'genericFunction'
	}

	getRefFamilyFromTypeFamily(
		typeFamily: AvailableTypeFamily,
		elementId: string
	): AvailableRefFamily | 'genericFunction' {
		return {
			[REF_FAMILY_MAP.bay]: () => REF_FAMILY_MAP.bay,
			[TYPE_FAMILY_MAP.generalEquipmentType]: () =>
				REF_FAMILY_MAP.generalEquipment,
			[TYPE_FAMILY_MAP.conductingEquipmentType]: () =>
				REF_FAMILY_MAP.conductingEquipment,
			[TYPE_FAMILY_MAP.functionTemplate]: () =>
				this.getFunctionTemplateRefFamily(elementId),
			[TYPE_FAMILY_MAP.lNodeType]: () => REF_FAMILY_MAP.lNode
		}[typeFamily]()
	}

	//====== PROXY TO HELPERS ======//
	// type
	createNewType = createNewType
	duplicateType = duplicateType
	updateType = updateType
	deleteType = deleteType
	// ref
	createNewRef = createNewRef
	// naming
	getTypeNextOccurrence = getTypeNextOccurrence
}

export const typeElementsStore = new UseTypeElementsStore()
