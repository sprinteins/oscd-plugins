import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mockAddUnstableNamespaceToRootElement,
	mockCreateAndDispatchEditEvent,
	mockCreateStandardElement,
	mockUuid,
	mockStores,
	mockConstants,
} = vi.hoisted(() => ({
	mockAddUnstableNamespaceToRootElement: vi.fn(),
	mockCreateAndDispatchEditEvent: vi.fn(),
	mockCreateStandardElement: vi.fn(),
	mockUuid: vi.fn(() => 'test-uuid'),
	mockStores: {
		pluginGlobalStore: {
			host: {} as EventTarget | null,
			xmlDocument: document.implementation.createDocument(
				null,
				'SCL',
				null,
			) as XMLDocument | null,
		},
		pluginLocalStore: {
			addUnstableNamespaceToRootElement: vi.fn(),
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1',
		},
		typeElementsStore: {
			typeElementsPerFamily: {
				lNodeType: {},
			},
		},
	},
	mockConstants: {
		REF_FAMILY: {
			generalEquipment: 'generalEquipment',
			conductingEquipment: 'conductingEquipment',
			function: 'function',
			eqFunction: 'eqFunction',
			lNode: 'lNode',
		},
	},
}))

mockStores.pluginLocalStore.addUnstableNamespaceToRootElement =
	mockAddUnstableNamespaceToRootElement

vi.mock('uuid', () => ({
	v4: mockUuid,
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	createStandardElement: mockCreateStandardElement,
	createAndDispatchEditEvent: mockCreateAndDispatchEditEvent,
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: mockStores.pluginGlobalStore,
}))

vi.mock('@/headless/stores', () => ({
	pluginLocalStore: mockStores.pluginLocalStore,
	typeElementsStore: mockStores.typeElementsStore,
}))

vi.mock('@/headless/constants', () => mockConstants)

import {
	createNewRef,
	deleteRef,
} from './ref-crud-operation.helper'

function createXmlDocument(): XMLDocument {
	return document.implementation.createDocument(null, 'SCL', null)
}

function createXmlElement(
	xmlDocument: XMLDocument,
	tagName: string,
): Element {
	return xmlDocument.createElement(tagName)
}

beforeEach(() => {
	vi.clearAllMocks()

	mockStores.pluginGlobalStore.host = {}
	mockStores.pluginGlobalStore.xmlDocument = createXmlDocument()

	mockStores.typeElementsStore.typeElementsPerFamily = {
		lNodeType: {},
	}

	mockCreateStandardElement.mockImplementation(
		({
			xmlDocument,
			element,
		}: {
			xmlDocument: XMLDocument
			element: { family: string }
		}) => xmlDocument.createElement(element.family),
	)
})

describe('createNewRef', () => {
	it.each([
		{
			family: 'generalEquipment',
			expectedAttributes: {
				virtual: 'false',
				templateUuid: 'type-id',
				uuid: 'test-uuid',
			},
		},
		{
			family: 'conductingEquipment',
			expectedAttributes: {
				virtual: 'false',
				templateUuid: 'type-id',
				uuid: 'test-uuid',
			},
		},
		{
			family: 'function',
			expectedAttributes: {
				templateUuid: 'type-id',
				uuid: 'test-uuid',
			},
		},
		{
			family: 'eqFunction',
			expectedAttributes: {
				templateUuid: 'type-id',
				uuid: 'test-uuid',
			},
		},
	])(
		'creates a "$family" reference with the expected attributes',
		({ family, expectedAttributes }) => {
			const xmlDocument = createXmlDocument()
			const parentTypeWrapper = createXmlElement(
				xmlDocument,
				'ParentType',
			)
			const newReference = createXmlElement(xmlDocument, family)

			mockStores.pluginGlobalStore.xmlDocument = xmlDocument
			mockCreateStandardElement.mockReturnValue(newReference)

			createNewRef({
				family: family as never,
				sourceTypeIdOrUuid: 'type-id',
				parentTypeWrapper,
			})

			expect(
				mockAddUnstableNamespaceToRootElement,
			).toHaveBeenCalledOnce()

			expect(mockCreateStandardElement).toHaveBeenCalledWith({
				xmlDocument,
				element: {
					family,
				},
				attributes: expectedAttributes,
				currentEdition: 'edition-2',
				currentUnstableRevision: 'revision-1',
			})

			expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
				host: mockStores.pluginGlobalStore.host,
				edit: {
					parent: parentTypeWrapper,
					node: newReference,
					reference: null,
				},
			})
		},
	)

	it('creates an LNode reference with the next lnInst occurrence', () => {
		const xmlDocument = createXmlDocument()
		const parentTypeWrapper = createXmlElement(
			xmlDocument,
			'Function',
		)

		const existingLNode1 = createXmlElement(xmlDocument, 'LNode')
		existingLNode1.setAttribute('lnType', 'lNode-type-id')

		const existingLNode2 = createXmlElement(xmlDocument, 'LNode')
		existingLNode2.setAttribute('lnType', 'lNode-type-id')

		parentTypeWrapper.append(existingLNode1, existingLNode2)

		const newLNodeReference = createXmlElement(xmlDocument, 'LNode')

		mockStores.pluginGlobalStore.xmlDocument = xmlDocument
		mockStores.typeElementsStore.typeElementsPerFamily.lNodeType = {
			'lNode-type-id': {
				attributes: {
					lnClass: 'PTOC',
				},
			},
		}

		mockCreateStandardElement.mockReturnValue(newLNodeReference)

		createNewRef({
			family: 'lNode' as never,
			sourceTypeIdOrUuid: 'lNode-type-id',
			parentTypeWrapper,
		})

		expect(mockCreateStandardElement).toHaveBeenCalledWith({
			xmlDocument,
			element: {
				family: 'lNode',
			},
			attributes: {
				lnClass: 'PTOC',
				lnInst: '3',
				iedName: 'None',
				lnType: 'lNode-type-id',
				uuid: 'test-uuid',
			},
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1',
		})
	})

	it('throws when no XML document is available', () => {
		mockStores.pluginGlobalStore.xmlDocument = null

		expect(() =>
			createNewRef({
				family: 'function' as never,
				sourceTypeIdOrUuid: 'type-id',
				parentTypeWrapper: document.createElement('Parent'),
			}),
		).toThrow('No XML document')

		expect(mockCreateStandardElement).not.toHaveBeenCalled()
	})

	it('throws when no host is available', () => {
		mockStores.pluginGlobalStore.host = null

		expect(() =>
			createNewRef({
				family: 'function' as never,
				sourceTypeIdOrUuid: 'type-id',
				parentTypeWrapper: document.createElement('Parent'),
			}),
		).toThrow('No host')

		expect(mockCreateStandardElement).not.toHaveBeenCalled()
	})
})

describe('deleteRef', () => {
	it('dispatches a remove edit for a non-LNode reference', () => {
		const xmlDocument = createXmlDocument()
		const referenceToDelete = createXmlElement(
			xmlDocument,
			'FunctionRef',
		)

		deleteRef({
			refElementToDelete: referenceToDelete,
			refFamily: 'function' as never,
		})

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: [
				{
					node: referenceToDelete,
				},
			],
		})
	})

	it('renumbers remaining LNode references after deletion', () => {
		const xmlDocument = createXmlDocument()
		const parent = createXmlElement(xmlDocument, 'Function')

		const firstLNode = createXmlElement(xmlDocument, 'LNode')
		firstLNode.setAttribute('lnInst', '7')

		const lNodeToDelete = createXmlElement(xmlDocument, 'LNode')
		lNodeToDelete.setAttribute('lnInst', '8')

		const lastLNode = createXmlElement(xmlDocument, 'LNode')
		lastLNode.setAttribute('lnInst', '9')

		parent.append(firstLNode, lNodeToDelete, lastLNode)

		deleteRef({
			refElementToDelete: lNodeToDelete,
			refFamily: 'lNode' as never,
		})

		expect(firstLNode.getAttribute('lnInst')).toBe('1')
		expect(lastLNode.getAttribute('lnInst')).toBe('2')

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: [
				{
					node: lNodeToDelete,
				},
				{
					parent,
					node: firstLNode,
					reference: null,
				},
				{
					parent,
					node: lastLNode,
					reference: null,
				},
			],
		})
	})

	it('throws when no host is available for deletion', () => {
		mockStores.pluginGlobalStore.host = null

		expect(() =>
			deleteRef({
				refElementToDelete: document.createElement('Reference'),
				refFamily: 'function' as never,
			}),
		).toThrow('No host available')
	})
})