import { v4 as uuidv4 } from 'uuid'
// STORES
import { pluginLocalStore } from '@/headless/stores'

/**
 * BUSINESS RULES: ~ refers to revision 90-30 page 182
 * This function follow the definition in terms of uuid attributes
 * The use case is not really covered : we are importing templates into templates
 * originUuid attribute is created to keep track of the original template
 * only if the element does not have an originUuid attribute (coming from another import)
 * @param element
 * @returns
 */
export function setUuidAttributesRecursively(element: Element) {
	const isLNodeTypeOrChild = element.tagName === 'LNodeType' || 
		element.closest('LNodeType') !== null;

	if (isLNodeTypeOrChild) {
		for (const child of Array.from(element.children)) {
			setUuidAttributesRecursively(child)
		}
		return
	}

	const hasId = element.hasAttribute('id')

	if (!hasId) {
		const uuid = element.getAttribute('uuid')
		const templateUuid = element.getAttribute('templateUuid')
		const originUuid = element.getAttributeNS(
			pluginLocalStore.namespaces.currentUnstableRevision.uri,
			'originUuid'
		)

		if (!originUuid && uuid)
			element.setAttributeNS(
				pluginLocalStore.namespaces.currentUnstableRevision.uri,
				'originUuid',
				templateUuid || uuid
			)
		element.setAttribute('uuid', uuidv4())
	}

	for (const child of Array.from(element.children))
		setUuidAttributesRecursively(child)
}
