import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createStandardElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY } from '@/headless/constants'
// TYPES
import type { AvailableRefFamily } from '@/headless/stores'

function getRefAttributes(params: {
	typeId: string
	refFamily: AvailableRefFamily
	parentTypeWrapper: Element
}) {
	return {
		[REF_FAMILY.generalEquipment]: () => ({
			virtual: 'false',
			templateUuid: params.typeId,
			uuid: uuidv4()
		}),
		[REF_FAMILY.conductingEquipment]: () => ({
			virtual: 'false',
			templateUuid: params.typeId,
			uuid: uuidv4()
		}),
		[REF_FAMILY.function]: () => ({
			templateUuid: params.typeId,
			uuid: uuidv4()
		}),
		[REF_FAMILY.eqFunction]: () => ({
			templateUuid: params.typeId,
			uuid: uuidv4()
		}),
		[REF_FAMILY.lNode]: () => ({
			lnClass:
				typeElementsStore.typeElementsPerFamily.lNodeType[params.typeId]
					.attributes.lnClass,
			lnInst: (
				Array.from(params.parentTypeWrapper.children).filter(
					(child) => child.getAttribute('lnType') === params.typeId
				).length + 1
			).toString(),
			iedName: 'None',
			lnType: params.typeId,
			uuid: uuidv4()
		})
	}[params.refFamily]()
}

/**
 * Creates a new reference element and dispatches an edit event.
 *
 * @param params - The parameters for creating the new reference.
 * @param params.family - The family of the reference.
 * @param params.sourceTypeIdOrUuid - The source type ID or UUID.
 * @param params.parentTypeWrapper - The parent element to which the new reference will be added.
 *
 * @throws If there is no XML document or host available in the global store.
 */
export function createNewRef(params: {
	family: AvailableRefFamily
	sourceTypeIdOrUuid: string
	parentTypeWrapper: Element
}) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')
	if (!pluginGlobalStore.host) throw new Error('No host')

	pluginLocalStore.addUnstableNamespaceToRootElement()

	const newRefElement = createStandardElement({
		xmlDocument: pluginGlobalStore.xmlDocument,
		element: {
			family: params.family
		},
		attributes: getRefAttributes({
			typeId: params.sourceTypeIdOrUuid,
			refFamily: params.family,
			parentTypeWrapper: params.parentTypeWrapper
		}),
		currentEdition: pluginLocalStore.currentEdition,
		currentUnstableRevision: pluginLocalStore.currentUnstableRevision
	})

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent: params.parentTypeWrapper,
			node: newRefElement,
			reference: null
		}
	})
}
