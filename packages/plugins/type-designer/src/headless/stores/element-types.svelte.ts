import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createStandardElement,
	createAndDispatchEditEvent,
	attributesToObject
} from '@oscd-plugins/core-api/plugin/v1'
import { xmlDocumentStore, pluginStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore } from './sidebar.svelte'
// TYPES
import type {
	ElementTypesPerFamily,
	Columns,
	ElementType,
	AvailableFamilies
} from './types.element-types'

class UseElementTypesStore {
	//====== CONSTANTS ======//

	allowedTargetsByFamily: Record<
		AvailableFamilies | 'lNodeType',
		Array<keyof Columns>
	> = {
		bay: [],
		generalEquipment: ['bay'],
		conductingEquipment: ['bay'],
		function: ['bay'],
		eqFunction: ['equipment'],
		lNodeType: ['function']
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
		const lNodeTypes =
			xmlDocumentStore.dataTypeTemplatesSubElements?.lNodeType

		const elements: {
			[key: string]: ElementType<'lNodeType'>
		} = {}
		if (lNodeTypes?.length)
			for (const [index, lNodeType] of lNodeTypes.entries()) {
				elements[uuidv4()] = {
					name:
						lNodeType.getAttribute('id') ||
						`LNodeType_${index + 1}`,
					element: lNodeType,
					attributes: attributesToObject<'ed2', 'lNodeType'>(
						lNodeType.attributes
					),
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

	parentNewElement = $derived({
		bay: xmlDocumentStore.substationSubElements?.[0].voltageLevel?.[0],
		generalEquipment:
			xmlDocumentStore.substationSubElements?.[0].voltageLevel?.[0],
		conductingEquipment:
			xmlDocumentStore.substationSubElements?.[0].voltageLevel?.[0],
		function: xmlDocumentStore.substationSubElements?.[0].voltageLevel?.[0],
		eqFunction:
			xmlDocumentStore.substationSubElements?.[0].voltageLevel?.[0]
	})

	//====== PRIVATE ACTIONS ======//

	//====== PUBLIC ACTIONS ======//

	createNewElementType({
		family,
		attributes
	}: {
		family: AvailableFamilies
		attributes: {
			name: string
			type?: string
		}
	}) {
		if (!xmlDocumentStore.xmlDocument) throw new Error('No XML document')
		if (!pluginStore.host) throw new Error('No host')

		const newElement = createStandardElement({
			xmlDocument: xmlDocumentStore.xmlDocument,
			element: family,
			attributes: attributes,
			standardVersion: 'ed2'
		})

		createAndDispatchEditEvent({
			host: pluginStore.host,
			edit: {
				parent: this.parentNewElement[family],
				node: newElement,
				reference: null
			}
		})

		this.elementTypesPerFamily[family][uuidv4()] = {
			name: attributes.name,
			element: newElement,
			attributes: attributesToObject<'ed2', typeof family>(
				newElement.attributes
			),
			family,
			allowedTargets: this.allowedTargetsByFamily[family],
			typeRefs: []
		}
	}

	updateElementType(attributeKey: string) {
		if (!pluginStore.host) throw new Error('No host')
		if (!sidebarStore.currentElementType)
			throw new Error('No current element type')
		if (
			sidebarStore.currentElementTypeFamily === 'lNodeType' ||
			!sidebarStore.currentElementTypeKey
		)
			throw new Error('No current element type key')

		this.elementTypesPerFamily[sidebarStore.currentElementTypeFamily][
			sidebarStore.currentElementTypeKey
		].attributes[attributeKey]
		createAndDispatchEditEvent({
			host: pluginStore.host,
			edit: {
				element: sidebarStore.currentElementType.element,
				attributes: sidebarStore.currentElementType.attributes,
				attributesNS: {}
			}
		})
	}
}

export const elementTypesStore = new UseElementTypesStore()
