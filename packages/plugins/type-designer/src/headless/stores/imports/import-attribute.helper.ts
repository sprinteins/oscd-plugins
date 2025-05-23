import { v4 as uuidv4 } from 'uuid'
// CORE
import { ssdStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore } from '@/headless/stores'
// TYPES
import type { EditEvent, RemoveEvent } from '@/headless/stores'

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
	const isLNodeType = element.tagName === 'LNodeType'
	if (isLNodeType) return

	const uuid = element.getAttribute('uuid')
	const originUuid = element.getAttributeNS(
		pluginLocalStore.namespaces.currentUnstableRevision.uri,
		'originUuid'
	)

	if (!originUuid && uuid)
		element.setAttributeNS(
			pluginLocalStore.namespaces.currentUnstableRevision.uri,
			'originUuid',
			uuid
		)
	element.setAttribute('uuid', uuidv4())

	for (const child of Array.from(element.children))
		setUuidAttributesRecursively(child)
}

/**
 * Updates templateUuid references in imported elements.
 * This function finds the relationships between originUuid and uuid attributes,
 * in the imported Document context AND in the working XML Document context.
 * It then updates any templateUuid references to match the new uuids.
 *
 * @param importActions Array of import actions (edit events and optional remove events)
 * @returns The same array of import actions with updated templateUuid references
 */
export function getCurrentImportedActionsWithUpdatedTemplateUuids(
	importActions: [EditEvent, RemoveEvent | undefined][]
): [EditEvent, RemoveEvent | undefined][] {
	let originUuidToUuidMap: Record<string, string> = {}

	for (const [editEvent] of importActions) {
		originUuidToUuidMap = {
			...originUuidToUuidMap,
			...mapElementOriginUuidToUuid(editEvent.node)
		}
	}

	const workingXmlDocumentElements =
		ssdStore.bayTemplateElement?.querySelectorAll('*')

	for (const element of workingXmlDocumentElements || []) {
		originUuidToUuidMap = {
			...originUuidToUuidMap,
			...mapElementOriginUuidToUuid(element)
		}
	}

	for (const [editEvent] of importActions)
		updateTemplateUuidReferencesRecursively(
			editEvent.node,
			originUuidToUuidMap
		)

	return importActions
}

function mapElementOriginUuidToUuid(element: Element) {
	const originUuidToUuidMap: Record<string, string> = {}

	const uuid = element.getAttribute('uuid')
	const originUuid = element.getAttributeNS(
		pluginLocalStore.namespaces.currentUnstableRevision.uri,
		'originUuid'
	)

	if (originUuid && uuid) originUuidToUuidMap[originUuid] = uuid

	return originUuidToUuidMap
}

function updateTemplateUuidReferencesRecursively(
	element: Element,
	originUuidToUuidMap: Record<string, string>
): void {
	const templateUuid = element.getAttribute('templateUuid')
	if (templateUuid && originUuidToUuidMap[templateUuid])
		element.setAttribute('templateUuid', originUuidToUuidMap[templateUuid])

	for (const child of Array.from(element.children))
		updateTemplateUuidReferencesRecursively(child, originUuidToUuidMap)
}
