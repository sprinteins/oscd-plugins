import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mockUuid,
	mockStores,
} = vi.hoisted(() => ({
	mockUuid: vi.fn(),
	mockStores: {
		pluginLocalStore: {
			namespaces: {
				currentUnstableRevision: {
					uri: 'urn:type-designer:test',
				},
			},
		},
		ssdStore: {
			bayTemplateElement: null as Element | null,
		},
	},
}))

vi.mock('uuid', () => ({
	v4: mockUuid,
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	ssdStore: mockStores.ssdStore,
}))

vi.mock('@/headless/stores', () => ({
	pluginLocalStore: mockStores.pluginLocalStore,
}))

import {
	getCurrentImportedActionsWithUpdatedTemplateUuids,
	setUuidAttributesRecursively,
} from './import-attribute.helper'

const originUuidNamespace = 'urn:type-designer:test'

function createXmlDocument(): XMLDocument {
	return document.implementation.createDocument(null, 'SCL', null)
}

function createXmlElement(
	xmlDocument: XMLDocument,
	tagName: string,
): Element {
	return xmlDocument.createElement(tagName)
}

function setOriginUuid(element: Element, originUuid: string): void {
	element.setAttributeNS(
		originUuidNamespace,
		'originUuid',
		originUuid,
	)
}

function getOriginUuid(element: Element): string | null {
	return element.getAttributeNS(originUuidNamespace, 'originUuid')
}

beforeEach(() => {
	vi.clearAllMocks()

	mockUuid.mockReturnValue('new-uuid')
	mockStores.ssdStore.bayTemplateElement = null
})

describe('setUuidAttributesRecursively', () => {
	it('sets originUuid and replaces uuid recursively', () => {
		const xmlDocument = createXmlDocument()

		const root = createXmlElement(xmlDocument, 'Bay')
		root.setAttribute('uuid', 'root-old-uuid')

		const child = createXmlElement(xmlDocument, 'Function')
		child.setAttribute('uuid', 'child-old-uuid')

		root.append(child)

		setUuidAttributesRecursively(root)

		expect(getOriginUuid(root)).toBe('root-old-uuid')
		expect(root.getAttribute('uuid')).toBe('new-uuid')

		expect(getOriginUuid(child)).toBe('child-old-uuid')
		expect(child.getAttribute('uuid')).toBe('new-uuid')

		expect(mockUuid).toHaveBeenCalledTimes(2)
	})

	it('preserves an already existing originUuid', () => {
		const xmlDocument = createXmlDocument()
		const element = createXmlElement(xmlDocument, 'Function')

		element.setAttribute('uuid', 'current-uuid')
		setOriginUuid(element, 'original-import-uuid')

		setUuidAttributesRecursively(element)

		expect(getOriginUuid(element)).toBe('original-import-uuid')
		expect(element.getAttribute('uuid')).toBe('new-uuid')
	})

	it('assigns a uuid even when the element previously had no uuid', () => {
		const xmlDocument = createXmlDocument()
		const element = createXmlElement(xmlDocument, 'Function')

		setUuidAttributesRecursively(element)

		expect(getOriginUuid(element)).toBeNull()
		expect(element.getAttribute('uuid')).toBe('new-uuid')
	})

	it('does not modify LNodeType elements or their descendants', () => {
		const xmlDocument = createXmlDocument()

		const lNodeType = createXmlElement(xmlDocument, 'LNodeType')
		lNodeType.setAttribute('uuid', 'lnode-old-uuid')

		const child = createXmlElement(xmlDocument, 'DO')
		child.setAttribute('uuid', 'child-old-uuid')

		lNodeType.append(child)

		setUuidAttributesRecursively(lNodeType)

		expect(lNodeType.getAttribute('uuid')).toBe('lnode-old-uuid')
		expect(getOriginUuid(lNodeType)).toBeNull()

		expect(child.getAttribute('uuid')).toBe('child-old-uuid')
		expect(getOriginUuid(child)).toBeNull()

		expect(mockUuid).not.toHaveBeenCalled()
	})
})

describe('getCurrentImportedActionsWithUpdatedTemplateUuids', () => {
	it('updates templateUuid references using imported elements', () => {
		const xmlDocument = createXmlDocument()

		const importedType = createXmlElement(xmlDocument, 'Function')
		importedType.setAttribute('uuid', 'new-function-uuid')
		setOriginUuid(importedType, 'old-function-uuid')

		const importedReference = createXmlElement(
			xmlDocument,
			'FunctionRef',
		)
		importedReference.setAttribute(
			'templateUuid',
			'old-function-uuid',
		)

		importedType.append(importedReference)

		const importActions = [
			[
				{
					node: importedType,
				},
				undefined,
			],
		] as never

		const result =
			getCurrentImportedActionsWithUpdatedTemplateUuids(
				importActions,
			)

		expect(result).toBe(importActions)
		expect(importedReference.getAttribute('templateUuid')).toBe(
			'new-function-uuid',
		)
	})

	it('updates references using elements in the working SSD document', () => {
		const xmlDocument = createXmlDocument()

		const bayTemplate = createXmlElement(xmlDocument, 'Bay')

		const existingType = createXmlElement(xmlDocument, 'Function')
		existingType.setAttribute('uuid', 'current-function-uuid')
		setOriginUuid(existingType, 'original-function-uuid')

		bayTemplate.append(existingType)
		mockStores.ssdStore.bayTemplateElement = bayTemplate

		const importedReference = createXmlElement(
			xmlDocument,
			'FunctionRef',
		)
		importedReference.setAttribute(
			'templateUuid',
			'original-function-uuid',
		)

		const importActions = [
			[
				{
					node: importedReference,
				},
				undefined,
			],
		] as never

		getCurrentImportedActionsWithUpdatedTemplateUuids(importActions)

		expect(importedReference.getAttribute('templateUuid')).toBe(
			'current-function-uuid',
		)
	})

	it('keeps an unknown templateUuid unchanged', () => {
		const xmlDocument = createXmlDocument()

		const importedReference = createXmlElement(
			xmlDocument,
			'FunctionRef',
		)
		importedReference.setAttribute(
			'templateUuid',
			'unknown-uuid',
		)

		const importActions = [
			[
				{
					node: importedReference,
				},
				undefined,
			],
		] as never

		getCurrentImportedActionsWithUpdatedTemplateUuids(importActions)

		expect(importedReference.getAttribute('templateUuid')).toBe(
			'unknown-uuid',
		)
	})
})