import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	typeGuard,
	createStandardElement,
	createAndDispatchEditEvent,
	findAllStandardElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore, ssdStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import {
	CONDUCTING_EQUIPMENTS,
	TYPE_FAMILY,
	EQUIPMENTS
} from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily } from '@/headless/stores'

//====== LOCAL HELPERS ======//

function getTypeAttributes(
	typeFamily: Exclude<AvailableTypeFamily, 'lNodeType'>
) {
	return {
		[TYPE_FAMILY.bay]: () => ({
			name: typeElementsStore.newComputedTypeName[TYPE_FAMILY.bay],
			uuid: uuidv4()
		}),
		[TYPE_FAMILY.generalEquipment]: () => ({
			name: typeElementsStore.newComputedTypeName[
				TYPE_FAMILY.generalEquipment
			],
			virtual: 'false',
			uuid: uuidv4(),
			type:
				typeElementsStore.newEquipmentType &&
				EQUIPMENTS[typeElementsStore.newEquipmentType].type
		}),
		[TYPE_FAMILY.conductingEquipment]: () => ({
			name: typeElementsStore.newComputedTypeName[
				TYPE_FAMILY.conductingEquipment
			],
			virtual: 'false',
			uuid: uuidv4(),
			type:
				typeElementsStore.newEquipmentType &&
				EQUIPMENTS[typeElementsStore.newEquipmentType].type
		}),
		[TYPE_FAMILY.function]: () => ({
			name: typeElementsStore.newComputedTypeName[TYPE_FAMILY.function],
			uuid: uuidv4()
		})
	}[typeFamily]()
}

function getTerminalOccurrence() {
	if (!typeElementsStore.newEquipmentType)
		throw new Error('No equipment type')
	return (
		(typeGuard.isPropertyOfObject(
			typeElementsStore.newEquipmentType,
			CONDUCTING_EQUIPMENTS
		) &&
			CONDUCTING_EQUIPMENTS[typeElementsStore.newEquipmentType]
				.numberOfTerminals) ||
		2
	)
}

function getTypeChildTemplate(
	typeFamily: Extract<AvailableTypeFamily, 'conductingEquipment'>
) {
	return {
		[TYPE_FAMILY.conductingEquipment]: () => ({
			family: 'terminal' as const,
			occurrence: getTerminalOccurrence(),
			attributes: {
				name: 'None',
				connectivityNode: 'None',
				cNodeName: 'None'
			}
		})
	}[typeFamily]()
}

function getTypeChildren(
	typeFamily: Extract<AvailableTypeFamily, 'conductingEquipment'>
) {
	const { occurrence: childOccurrence, ...childTemplate } =
		getTypeChildTemplate(typeFamily)
	return Array.from({ length: childOccurrence }, () => childTemplate)
}

export function getTypeParent(family: AvailableTypeFamily) {
	return {
		[TYPE_FAMILY.bay]: () => ssdStore.voltageLevelTemplateElement,
		[TYPE_FAMILY.generalEquipment]: () => ssdStore.bayTemplateElement,
		[TYPE_FAMILY.conductingEquipment]: () => ssdStore.bayTemplateElement,
		[TYPE_FAMILY.function]: () => ssdStore.bayTemplateElement,
		[TYPE_FAMILY.lNodeType]: () =>
			pluginLocalStore.rootSubElements.dataTypeTemplates
	}[family]()
}

export function getTypeInsertBeforeReference(
	family: AvailableTypeFamily
): Element | null {
	return {
		[TYPE_FAMILY.bay]: () => null,
		[TYPE_FAMILY.generalEquipment]: () =>
			ssdStore.bayTemplateElement?.getElementsByTagName(
				'ConductingEquipment'
			)[0] ||
			getTypeInsertBeforeReference(TYPE_FAMILY.conductingEquipment),
		[TYPE_FAMILY.conductingEquipment]: () =>
			ssdStore.bayTemplateElement?.getElementsByTagName('Function')[0] ||
			null,
		[TYPE_FAMILY.function]: () => null,
		[TYPE_FAMILY.lNodeType]: () => null
	}[family]()
}

//====== CREATE ======//

/**
 * Creates a new type element and optionally its children.
 *
 * This function performs the following steps:
 * 1. Updates the SCL version of the XML Document
 * 2. Creates the TEMPLATE wrapper if needed in the XML Document.
 * 3. Validates the presence of necessary global store properties.
 * 4. Creates a new type element based on the provided type family.
 * 5. If `withChildren` is true and the type family is 'conductingEquipment',
 *    it creates and appends child elements to the new type element.
 * 6. Determines the appropriate parent element based on the type family.
 * 7. Dispatches an edit event to add the new element to the XML Document.
 *
 * @param params - The parameters for creating a new type element.
 * @param params.family - The family of the type element to create.
 * @param params.withChildren - Optional flag to indicate whether to create child elements.
 * @throws Will throw an error if the host, XML document, type family, or parent element is not available.
 */
export async function createNewType(params: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	withChildren?: boolean
}) {
	pluginLocalStore.updateSCLVersion()
	await ssdStore.createTemplateWrapper()

	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')
	if (!params.family) throw new Error('No type family')

	const newTypeElement = createStandardElement({
		xmlDocument: pluginGlobalStore.xmlDocument,
		element: { family: params.family },
		attributes: getTypeAttributes(params.family),
		currentEdition: pluginLocalStore.currentEdition,
		currentUnstableRevision: pluginLocalStore.currentUnstableRevision
	})

	if (params.withChildren && params.family === 'conductingEquipment') {
		const children = getTypeChildren(params.family)
		for (const child of children) {
			const newChildElement = createStandardElement({
				xmlDocument: pluginGlobalStore.xmlDocument,
				element: { family: child.family },
				attributes: {
					...child.attributes,
					uuid: uuidv4()
				},
				currentEdition: pluginLocalStore.currentEdition,
				currentUnstableRevision:
					pluginLocalStore.currentUnstableRevision
			})
			newTypeElement.appendChild(newChildElement)
		}
	}

	const parent = getTypeParent(params.family)
	if (!parent) throw new Error('No parent element available for the new type')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent,
			node: newTypeElement,
			reference: getTypeInsertBeforeReference(params.family)
		}
	})
}

//====== DELETE ======//

export function deleteTypeAndRefs(params: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	id: string
}) {
	if (params.family !== TYPE_FAMILY.bay)
		deleteAssociatedRefs({ family: params.family, id: params.id })

	pluginGlobalStore.deleteElement(
		typeElementsStore.typeElementsPerFamily[params.family][params.id]
			.element
	)

	ssdStore.cleanTemplateWrapper()
}

function deleteAssociatedRefs(params: {
	family: Exclude<AvailableTypeFamily, 'bay' | 'lNodeType'>
	id: string
}) {
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	const refFamily =
		typeElementsStore.typeElementsPerFamily[params.family][params.id]
			.parameters.refFamily

	if (!refFamily) return

	const tagName = pluginLocalStore.currentDefinition[refFamily].tag

	const getAllRefElements = findAllStandardElementsBySelector({
		selector: tagName,
		root: pluginLocalStore.rootElement
	})

	for (const ref of getAllRefElements) {
		if (ref.getAttribute('templateUuid') === params.id)
			pluginGlobalStore.deleteElement(ref)
	}
}
