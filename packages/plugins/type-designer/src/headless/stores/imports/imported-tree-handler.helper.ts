// CORE
import { areElementsIdentical } from '@oscd-plugins/core-api/plugin/v1'
import { ssdStore } from '@oscd-plugins/core-ui-svelte'

// STORES
import { importsStore, pluginLocalStore } from '@/headless/stores'
// HELPERS
import { setNameAttribute } from './import-naming.helper'
import { setUuidAttributesRecursively } from './import-attribute.helper'

//====== MAIN ======//

export async function handleImportOfAnyElement(
	currentImportedElement: Element
) {
	if (hasAlreadyBeenTreated(currentImportedElement)) return

	const localTwinElement = getLocalTwinElement(currentImportedElement)

	if (localTwinElement)
		await addReplaceAction(currentImportedElement, localTwinElement)
	else await addCreateAction(currentImportedElement)

	if (hasRefToImportAsType(currentImportedElement)) {
		const currentChildrenElements = Array.from(
			currentImportedElement.children
		)
		for (const child of currentChildrenElements)
			await handleImportOfRefAsType(child)
	}
}

//====== ACTIONS ======//

async function addCreateAction(currentImportedElement: Element) {
	setUuidAttributesRecursively(currentImportedElement)
	setNameAttribute(currentImportedElement)

	const { idOrUuid, localParent, localNextSibling } =
		await getElementActionPayload(currentImportedElement)

	importsStore.currentImportActionsByElementIds.push({
		[idOrUuid]: [
			{
				parent: localParent,
				node: currentImportedElement,
				reference: localNextSibling
			},
			undefined
		]
	})
}

async function addReplaceAction(
	currentImportedElement: Element,
	localElement: Element
) {
	if (areElementsIdentical(localElement, currentImportedElement)) return

	setUuidAttributesRecursively(currentImportedElement)

	const { idOrUuid, localParent, localNextSibling } =
		await getElementActionPayload(currentImportedElement)

	importsStore.currentImportActionsByElementIds.push({
		[idOrUuid]: [
			{
				parent: localParent,
				node: currentImportedElement,
				reference: localNextSibling
			},
			{
				node: currentImportedElement
			}
		]
	})
}

//====== HANDLER ======//

async function handleImportOfRefAsType(currentImportedElement: Element) {
	const { attribute, idOrUuid } = getTypeIdOrUuidFromRef(
		currentImportedElement
	)
	const currentRefAsTypeElement =
		importsStore.importedXmlDocument?.documentElement.querySelector(
			`[${attribute}="${idOrUuid}"]`
		)

	if (!currentRefAsTypeElement) return

	await handleImportOfAnyElement(currentRefAsTypeElement)
}

//====== GENERATOR ======//

async function generateLocalTemplateWrapperIfNeeded(
	currentImportedElement: Element
) {
	const isCurrentParentTemplate =
		currentImportedElement.parentElement?.getAttribute('name') ===
		'TEMPLATE'
	if (!isCurrentParentTemplate) return

	pluginLocalStore.updateSCLVersion()
	pluginLocalStore.addUnstableNamespaceToRootElement()
	await ssdStore.createTemplateWrapper()
}

//====== TESTER ======//

function hasAlreadyBeenTreated(currentImportedElement: Element) {
	const idOrUuid = getElementIdOrUuid(currentImportedElement)
	if (
		importsStore.currentImportActionsByElementIds.find(
			(currentImportActionByElementIds) =>
				currentImportActionByElementIds[idOrUuid]
		)
	)
		return true
	return false
}

function hasRefToImportAsType(currentImportedElement: Element) {
	const currentChildren = Array.from(currentImportedElement.children)
	return currentChildren.some((child) => {
		if (
			child.hasAttribute('lnType') ||
			child.hasAttribute('type') ||
			child.hasAttribute('templateUuid')
		)
			return true
		return false
	})
}

function getLocalTwinElement(currentImportedElement: Element) {
	const currentIdOrUuid = getElementIdOrUuid(currentImportedElement)

	return (
		pluginLocalStore.rootElement?.querySelector(
			`[id="${currentIdOrUuid}"]`
		) ||
		pluginLocalStore.rootElement?.querySelector(
			`[uuid="${currentIdOrUuid}"]`
		)
	)
}

//====== GETTER ======//

function getElementIdOrUuid(currentImportedElement: Element) {
	const idOrUuid =
		currentImportedElement.getAttribute('id') ||
		currentImportedElement.getAttribute('uuid')

	if (!idOrUuid) throw new Error('Element has no id or uuid')
	return idOrUuid
}

function getTypeIdOrUuidFromRef(currentImportedElement: Element) {
	const lnType = currentImportedElement.getAttribute('lnType')
	const type = currentImportedElement.getAttribute('type')
	const templateUuid = currentImportedElement.getAttribute('templateUuid')

	return {
		attribute: templateUuid ? 'uuid' : 'id',
		idOrUuid: templateUuid || type || lnType
	}
}

function getLocalParentByTagName(currentImportedElement: Element) {
	const importedParentElementTagName =
		currentImportedElement.parentElement?.tagName
	if (!importedParentElementTagName) return

	const localParent = pluginLocalStore.rootElement?.getElementsByTagName(
		importedParentElementTagName
	)

	const isLocalParentUniqueEquivalent = localParent?.length === 1

	if (isLocalParentUniqueEquivalent) return localParent[0]
}

function getLocalParentById(currentImportedElement: Element) {
	const importedParentUuid =
		currentImportedElement?.parentElement?.getAttribute('uuid')
	const importedParentId =
		currentImportedElement?.parentElement?.getAttribute('id')

	if (importedParentUuid)
		return pluginLocalStore.rootElement?.querySelector(
			`[${pluginLocalStore.namespaces.currentUnstableRevision.prefix}\\:originUuid="${importedParentUuid}"]`
		)

	if (importedParentId)
		return pluginLocalStore.rootElement?.querySelector(
			`[id="${importedParentId}"]`
		)
}

function getLocalNextSibling(
	currentImportedElement: Element,
	localParent: Element
) {
	const currentTagName = currentImportedElement.tagName
	const lastOfItsLocalKind =
		Array.from(localParent.getElementsByTagName(currentTagName)).at(-1) ||
		null

	return lastOfItsLocalKind
}

async function getElementActionPayload(currentImportedElement: Element) {
	const idOrUuid = getElementIdOrUuid(currentImportedElement)

	if (!ssdStore.hasTemplateWrapper)
		await generateLocalTemplateWrapperIfNeeded(currentImportedElement)

	const localParent =
		getLocalParentByTagName(currentImportedElement) ||
		getLocalParentById(currentImportedElement)
	if (!localParent) throw new Error('Element has no local parent')

	const localNextSibling = getLocalNextSibling(
		currentImportedElement,
		localParent
	)

	return {
		idOrUuid,
		localParent,
		localNextSibling
	}
}
