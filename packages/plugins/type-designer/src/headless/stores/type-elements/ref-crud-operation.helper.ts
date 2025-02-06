// CORE
import {
	createStandardElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY_MAP } from '@/headless/constants'
// TYPES
import type { AvailableRefFamily } from '@/headless/stores'

export function createNewRef({
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
