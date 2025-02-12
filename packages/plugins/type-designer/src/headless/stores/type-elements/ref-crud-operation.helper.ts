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
		attributes?: { lnType: string } | { type: string }
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
		attributesPayload =
			REF_ATTRIBUTES_KIND_BY_REF_FAMILY[family] === KIND.custom
				? {
						attributesNS: [
							{
								namespace:
									pluginLocalStore.namespaces.currentPlugin,
								attributes: {
									type: sourceTypeIdOrUuid
								}
							}
						]
					}
				: {
						attributes: {
							type: sourceTypeIdOrUuid
						}
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
