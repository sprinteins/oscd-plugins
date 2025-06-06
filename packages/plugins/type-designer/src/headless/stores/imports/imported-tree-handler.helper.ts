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

	const localTwinElement =
		getElementEquivalentInWorkingDocumentByIdUuidOrOriginUuid(
			currentImportedElement
		)

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
	const elementToCreate = currentImportedElement.cloneNode(true) as Element

	setUuidAttributesRecursively(elementToCreate)
	setNameAttribute(elementToCreate)

	const { idOrUuid, localParent, localNextSibling } =
		await getElementActionPayload(currentImportedElement)

	importsStore.currentImportActionsByElementIds.push({
		[idOrUuid]: [
			{
				parent: localParent,
				node: elementToCreate,
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
	if (
		areElementsIdentical({
			firstElement: localElement,
			secondElement: currentImportedElement,
			attributesToIgnore: ['uuid', 'templateUuid', 'originUuid', 'name']
		})
	)
		return

	const elementToReplace = currentImportedElement.cloneNode(true) as Element

	const elementToRemove =
		getElementEquivalentInWorkingDocumentByIdUuidOrOriginUuid(
			currentImportedElement
		)

	if (!elementToRemove) throw new Error('Element to remove is not defined')

	setUuidAttributesRecursively(elementToReplace)
	if (
		elementToReplace.getAttribute('name') !==
		elementToRemove.getAttribute('name')
	)
		setNameAttribute(elementToReplace)

	const { idOrUuid, localParent, localNextSibling } =
		await getElementActionPayload(currentImportedElement)

	importsStore.currentImportActionsByElementIds.push({
		[idOrUuid]: [
			{
				parent: localParent,
				node: elementToReplace,
				reference: localNextSibling
			},
			{
				node: elementToRemove
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
		importsStore.loadedXmlDocument?.documentElement.querySelector(
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

	let selector = importedParentElementTagName

	if (selector === 'Bay' || selector === 'VoltageLevel')
		selector = `${selector}[name=TEMPLATE]`

	const localParent = pluginLocalStore.rootElement?.querySelectorAll(selector)

	const isLocalParentUniqueEquivalent = localParent?.length === 1

	if (isLocalParentUniqueEquivalent) return localParent[0]
}

function getLocalParentById(currentImportedElement: Element) {
	if (!currentImportedElement?.parentElement)
		throw new Error('Element has no parent element')

	return getElementEquivalentInWorkingDocumentByIdUuidOrOriginUuid(
		currentImportedElement.parentElement
	)
}

function getLocalNextSibling(
	currentImportedElement: Element,
	localParent: Element
) {
	const currentTagName = currentImportedElement.tagName
	const lastOfItsLocalKind = Array.from(
		localParent.getElementsByTagName(currentTagName)
	).at(-1)

	const nextSiblingOfLastOfItsLocalKind =
		lastOfItsLocalKind?.nextElementSibling || null

	return nextSiblingOfLastOfItsLocalKind
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

function getElementEquivalentInWorkingDocumentByIdUuidOrOriginUuid(
	element: Element
) {
	if (!pluginLocalStore.rootElement)
		throw new Error('Root element is not defined')

	const idOrUuid = getElementIdOrUuid(element)

	const elementById = pluginLocalStore.rootElement.querySelector(
		`[id="${idOrUuid}"]`
	)

	const elementByUuid = pluginLocalStore.rootElement.querySelector(
		`[uuid="${idOrUuid}"]`
	)

	const elementByOriginUuid =
		pluginLocalStore.rootElement.querySelector(`[id="${idOrUuid}"]`) ||
		Array.from(pluginLocalStore.rootElement.querySelectorAll('*')).find(
			(el) =>
				el.getAttributeNS(
					pluginLocalStore.namespaces.currentUnstableRevision.uri,
					'originUuid'
				) === idOrUuid
		)

	return elementById || elementByUuid || elementByOriginUuid
}
