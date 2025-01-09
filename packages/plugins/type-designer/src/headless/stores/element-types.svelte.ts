import { v4 as uuidv4 } from 'uuid'
import {
	createStandardElement,
	attributesToObject
} from '@oscd-plugins/core-api/plugin/v1'
import { xmlDocumentStore } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'
import type {
	ElementTypesPerFamily,
	Columns,
	ElementType,
	AvailableFamilies
} from './types.element-types'
import type { DataTypeTemplates } from '@oscd-plugins/core-standard/ed2'

class UseElementTypesStore {
	//====== CONSTANTS ======//

	allowedTargetsByFamily: Record<
		AvailableFamilies | 'lNodeType',
		Array<keyof Columns>
	> = {
		bay: [],
		generalEquipment: ['bay', 'function'],
		conductingEquipment: ['bay', 'function'],
		function: ['bay'],
		eqFunction: ['bay', 'equipment'],
		lNodeType: ['bay', 'equipment', 'function']
	}

	//====== STATES ======//

	elementTypesPerFamily: ElementTypesPerFamily = $state({
		bay: {},
		generalEquipment: {},
		conductingEquipment: {},
		function: {},
		eqFunction: {}
	})

	//====== DERIVED STATES ======//

	lNodeTypeElementTypes = $derived.by(() => {
		const lNodeTypes = xmlDocumentStore.dataTypeTemplatesElements.lNodeType

		const elements: {
			[key: string]: ElementType<'lNodeType'>
		} = {}
		if (lNodeTypes?.length)
			for (const [index, lNodeType] of lNodeTypes.entries()) {
				elements[uuidv4()] = {
					name:
						lNodeType.getAttribute('id') ||
						`LNodeType_${index + 1}`,
					element: lNodeType as Xml.SclElement<'lNodeType'>,
					attributes: attributesToObject(
						lNodeType.attributes
					) as DataTypeTemplates.LNodeType['attributes'],
					family: 'lNodeType',
					allowedTargets: this.allowedTargetsByFamily.lNodeType,
					typeRefs: []
				}
			}

		return elements
	})

	columns: Columns = $derived({
		bay: {
			name: 'Bay Types',
			groupedElementTypes: {
				bay: this.elementTypesPerFamily.bay
			}
		},
		equipment: {
			name: 'Equipment Types',
			groupedElementTypes: {
				generalEquipment: this.elementTypesPerFamily.generalEquipment,
				conductingEquipment:
					this.elementTypesPerFamily.conductingEquipment
			}
		},
		function: {
			name: 'Function Types',
			groupedElementTypes: {
				function: this.elementTypesPerFamily.function,
				eqFunction: this.elementTypesPerFamily.eqFunction
			}
		},
		lNodeType: {
			name: 'LN Types',
			groupedElementTypes: {
				lNodeType: this.lNodeTypeElementTypes
			}
		}
	})

	nextElementName = $derived({
		bay: `Bay_${Object.keys(this.elementTypesPerFamily.bay).length + 1}`,
		generalEquipment: `_${Object.keys(this.elementTypesPerFamily.generalEquipment).length + 1}`,
		conductingEquipment: `_${Object.keys(this.elementTypesPerFamily.conductingEquipment).length + 1}`,
		function: `Func_${Object.keys(this.elementTypesPerFamily.function).length + 1}`,
		eqFunction: `EqFunc_${Object.keys(this.elementTypesPerFamily.eqFunction).length + 1}`
	})

	//====== PUBLIC ACTIONS ======//

	async createNewElementType(
		family: AvailableFamilies,
		attributes: {
			name: string
			type?: string
		}
	) {
		const newElement = (await createStandardElement({
			xmlDocument: document,
			element: family,
			attributes: attributes
		})) as Xml.SclElement<typeof family>

		this.elementTypesPerFamily[family][uuidv4()] = {
			name: attributes.name,
			element: newElement as Xml.SclElement<typeof family>,
			attributes: attributesToObject<typeof family>(
				newElement.attributes
			),
			family,
			allowedTargets: this.allowedTargetsByFamily[family],
			typeRefs: []
		}
	}
}

export const elementTypesStore = new UseElementTypesStore()
