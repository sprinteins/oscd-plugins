import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createStandardElement,
	createCustomElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore, pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	REF_FAMILY_MAP,
	TYPE_FAMILY_MAP,
	CUSTOM_TAG_NAME_MAP
} from '@/headless/constants'
// HELPERS
import { getAndMapTypeElements } from './consolidate-types.helper'
// TYPES
import type {
	TypeElementsPerFamily,
	Columns,
	AvailableTypeFamily,
	AvailableRefFamily,
	NewTypeAttributes
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

	getUniqueTypeRefsFunctionIds(family: AvailableTypeFamily): string[] {
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

		// is EqFunction if it is not part of Bay per Definition (checking the ConductingEquipment case)
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
			[TYPE_FAMILY_MAP.bay]: () => REF_FAMILY_MAP.bay,
			[TYPE_FAMILY_MAP.generalEquipmentType]: () =>
				REF_FAMILY_MAP.generalEquipment,
			[TYPE_FAMILY_MAP.conductingEquipmentType]: () =>
				REF_FAMILY_MAP.conductingEquipment,
			[TYPE_FAMILY_MAP.functionTemplate]: () =>
				this.getFunctionTemplateRefFamily(elementId),
			[TYPE_FAMILY_MAP.lNodeType]: () => REF_FAMILY_MAP.lNode
		}[typeFamily]()
	}

	//====== PUBLIC ACTIONS ======//

	//==== TYPE CREATION WRAPPER

	createNewElementType({
		family,
		attributes
	}: {
		family: Exclude<AvailableTypeFamily, 'lNodeType'>
		attributes: NewTypeAttributes
	}) {
		let eventPayload: { node: Element; parent: Element | null | undefined }

		switch (family) {
			case TYPE_FAMILY_MAP.bay:
				eventPayload = this.createBayType({
					family,
					attributes
				})
				break
			case TYPE_FAMILY_MAP.generalEquipmentType:
				eventPayload = this.createEquipmentType({
					family,
					attributes
				})
				break
			case TYPE_FAMILY_MAP.conductingEquipmentType:
				eventPayload = this.createEquipmentType({
					family,
					attributes
				})
				break
			case TYPE_FAMILY_MAP.functionTemplate:
				eventPayload = this.createFunctionTemplate({
					family,
					attributes
				})
				break
		}

		if (!pluginGlobalStore.host) throw new Error('No host')
		if (!eventPayload.parent) throw new Error('No parent element')

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				parent: eventPayload.parent,
				node: eventPayload.node,
				reference: null
			}
		})
	}

	//==== TYPE CREATION SUB FUNCTIONS

	createBayType({
		family,
		attributes
	}: {
		family: typeof TYPE_FAMILY_MAP.bay
		attributes: NewTypeAttributes
	}) {
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

		return {
			node: createStandardElement({
				xmlDocument: pluginGlobalStore.xmlDocument,
				element: { family },
				attributes: {
					...attributes,
					uuid: uuidv4()
				},
				currentEdition: pluginLocalStore.currentEdition,
				currentUnstableRevision:
					pluginLocalStore.currentUnstableRevision
			}),
			parent: pluginLocalStore.substationsSubElements?.[0]
				.voltageLevel?.[0]
		}
	}

	createEquipmentType({
		family,
		attributes
	}: {
		family:
			| typeof TYPE_FAMILY_MAP.generalEquipmentType
			| typeof TYPE_FAMILY_MAP.conductingEquipmentType
		attributes: NewTypeAttributes
	}) {
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

		return {
			node: createCustomElement({
				xmlDocument: pluginGlobalStore.xmlDocument,
				tagName: CUSTOM_TAG_NAME_MAP[family],
				namespace: {
					uri: pluginLocalStore.pluginNamespaceUri,
					prefix: pluginLocalStore.pluginNamespacePrefix
				},
				attributes: {
					...attributes,
					uuid: uuidv4()
				}
			}),
			parent: pluginLocalStore.rootSubElements?.equipmentTypeTemplates
		}
	}

	createFunctionTemplate({
		family,
		attributes
	}: {
		family: typeof TYPE_FAMILY_MAP.functionTemplate
		attributes: NewTypeAttributes
	}) {
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

		return {
			node: createStandardElement({
				xmlDocument: pluginGlobalStore.xmlDocument,
				element: {
					family,
					namespace: {
						uri: pluginGlobalStore.revisionsStores[
							pluginLocalStore.currentUnstableRevision
						].currentNamespaceUri,
						prefix: pluginGlobalStore.revisionsStores[
							pluginLocalStore.currentUnstableRevision
						].currentNamespacePrefix
					}
				},
				attributes: {
					...attributes,
					uuid: uuidv4()
				},
				currentEdition: pluginLocalStore.currentEdition,
				currentUnstableRevision:
					pluginLocalStore.currentUnstableRevision,
				wrapWithPrivateElement: true
			}),
			parent: pluginLocalStore.rootElement
		}
	}

	//==== REF CREATION

	createNewElementRef({
		family,
		sourceTypeIdOrUuid,
		parentTypeWrapper
	}: {
		family: AvailableRefFamily
		sourceTypeIdOrUuid: string
		parentTypeWrapper: Element
	}) {
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')
		if (!pluginGlobalStore.host) throw new Error('No host')

		let attributesPayload: {
			attributes?: { lnType: string }
			attributesNS?: {
				namespace: { uri: string; prefix: string }
				attributes: { type: string }
			}[]
		}

		if (family === REF_FAMILY_MAP.lNode) {
			attributesPayload = {
				attributes: {
					lnType: sourceTypeIdOrUuid
				}
			}
		} else {
			attributesPayload = {
				attributesNS: [
					{
						namespace: {
							uri: pluginGlobalStore.revisionsStores[
								pluginLocalStore.currentUnstableRevision
							].currentNamespaceUri,
							prefix: pluginGlobalStore.revisionsStores[
								pluginLocalStore.currentUnstableRevision
							].currentNamespacePrefix
						},
						attributes: {
							type: sourceTypeIdOrUuid
						}
					}
				]
			}
		}
		const newRefElement = createStandardElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			element: {
				family
			},
			...attributesPayload,
			currentEdition: pluginLocalStore.currentEdition,
			currentUnstableRevision: pluginLocalStore.currentUnstableRevision
		})

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				parent: parentTypeWrapper,
				node: newRefElement,
				reference: null
			}
		})
	}

	updateElementType(attributeKey: string) {
		if (!pluginGlobalStore.host) throw new Error('No host')
		if (!sidebarStore.currentElementType)
			throw new Error('No current element type')

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				element: sidebarStore.currentElementType.element,
				attributes: {
					[attributeKey]:
						sidebarStore.currentElementType.attributes[attributeKey]
				},
				attributesNS: {}
			}
		})
	}
}

export const typeElementsStore = new UseTypeElementsStore()
