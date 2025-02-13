// CORE
import {
	createStandardElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	REF_FAMILY_MAP,
	REF_ATTRIBUTES_KIND_BY_REF_FAMILY,
	KIND
} from '@/headless/constants'
// TYPES
import type { AvailableRefFamily } from '@/headless/stores'

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

	let attributesPayload: {
		attributes?: { lnType: string } | { type: string }
		attributesNS?: {
			namespace: { uri: string; prefix: string }
			attributes: { type: string }
		}[]
	}

	if (params.family === REF_FAMILY_MAP.lNode) {
		attributesPayload = {
			attributes: {
				lnType: params.sourceTypeIdOrUuid
			}
		}
	} else {
		attributesPayload =
			REF_ATTRIBUTES_KIND_BY_REF_FAMILY[params.family] === KIND.custom
				? {
						attributesNS: [
							{
								namespace:
									pluginLocalStore.namespaces.currentPlugin,
								attributes: {
									type: params.sourceTypeIdOrUuid
								}
							}
						]
					}
				: {
						attributes: {
							type: params.sourceTypeIdOrUuid
						}
					}
	}
	const newRefElement = createStandardElement({
		xmlDocument: pluginGlobalStore.xmlDocument,
		element: {
			family: params.family
		},
		...attributesPayload,
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
