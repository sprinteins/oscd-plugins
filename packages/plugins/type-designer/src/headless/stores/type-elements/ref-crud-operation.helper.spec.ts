import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mockAddUnstableNamespaceToRootElement,
	mockCreateAndDispatchEditEvent,
	mockCreateStandardElement,
	mockUuid,
	mockStores
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
				null
			) as XMLDocument | null
		},
		pluginLocalStore: {
			addUnstableNamespaceToRootElement: vi.fn(),
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1'
		},
		typeElementsStore: {
			typeElementsPerFamily: {
				lNodeType: {}
			}
		}
	}
}))

mockStores.pluginLocalStore.addUnstableNamespaceToRootElement =
	mockAddUnstableNamespaceToRootElement

vi.mock('uuid', () => ({
	v4: mockUuid
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	createStandardElement: mockCreateStandardElement,
	createAndDispatchEditEvent: mockCreateAndDispatchEditEvent
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: mockStores.pluginGlobalStore
}))

vi.mock('@/headless/stores', () => ({
	pluginLocalStore: mockStores.pluginLocalStore,
	typeElementsStore: mockStores.typeElementsStore
}))

import { REF_FAMILY } from '@/headless/constants/type-elements'

import { createNewRef, deleteRef } from './ref-crud-operation.helper'

function createXmlDocument(): XMLDocument {
	return document.implementation.createDocument(null, 'SCL', null)
}

function createXmlElement(xmlDocument: XMLDocument, tagName: string): Element {
	return xmlDocument.createElement(tagName)
}

beforeEach(() => {
	vi.clearAllMocks()
	mockCreateAndDispatchEditEvent.mockReset()

	mockStores.pluginGlobalStore.host = {} as EventTarget
	mockStores.pluginGlobalStore.xmlDocument = createXmlDocument()

	mockStores.typeElementsStore.typeElementsPerFamily = {
		lNodeType: {}
	}

	mockCreateStandardElement.mockImplementation(
		({
			xmlDocument,
			element
		}: {
			xmlDocument: XMLDocument
			element: { family: string }
		}) => xmlDocument.createElement(element.family)
	)
})

describe('createNewRef', () => {
	it.each([
		{
			family: REF_FAMILY.generalEquipment,
			expectedAttributes: {
				virtual: 'false',
				templateUuid: 'type-id',
				uuid: 'test-uuid'
			}
		},
		{
			family: REF_FAMILY.conductingEquipment,
			expectedAttributes: {
				virtual: 'false',
				templateUuid: 'type-id',
				uuid: 'test-uuid'
			}
		},
		{
			family: REF_FAMILY.function,
			expectedAttributes: {
				templateUuid: 'type-id',
				uuid: 'test-uuid'
			}
		},
		{
			family: REF_FAMILY.eqFunction,
			expectedAttributes: {
				templateUuid: 'type-id',
				uuid: 'test-uuid'
			}
		}
	])('GIVEN the "$family" reference family WHEN a reference is created THEN it has the expected attributes', ({
		family,
		expectedAttributes
	}) => {
		const xmlDocument = createXmlDocument()
		const parentTypeWrapper = createXmlElement(xmlDocument, 'ParentType')
		const newReference = createXmlElement(xmlDocument, family)

		mockStores.pluginGlobalStore.xmlDocument = xmlDocument
		mockCreateStandardElement.mockReturnValue(newReference)

		createNewRef({
			family: family,
			sourceTypeIdOrUuid: 'type-id',
			parentTypeWrapper
		})

		expect(mockAddUnstableNamespaceToRootElement).toHaveBeenCalledOnce()

		expect(mockCreateStandardElement).toHaveBeenCalledWith({
			xmlDocument,
			element: {
				family
			},
			attributes: expectedAttributes,
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1'
		})

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: {
				parent: parentTypeWrapper,
				node: newReference,
				reference: null
			}
		})
	})

	it('GIVEN existing ConductingEquipment, ConnectivityNode and Function children WHEN multiple ConductingEquipment references are created THEN they are inserted sequentially before later child families', () => {
		const xmlDocument = createXmlDocument()
		const parentTypeWrapper = createXmlElement(xmlDocument, 'Bay')
		const existingConductingEquipment = createXmlElement(
			xmlDocument,
			'ConductingEquipment'
		)
		const connectivityNode = createXmlElement(
			xmlDocument,
			'ConnectivityNode'
		)
		const functionElement = createXmlElement(xmlDocument, 'Function')
		const firstNewReference = createXmlElement(
			xmlDocument,
			'ConductingEquipment'
		)
		const secondNewReference = createXmlElement(
			xmlDocument,
			'ConductingEquipment'
		)

		parentTypeWrapper.append(
			existingConductingEquipment,
			connectivityNode,
			functionElement
		)
		mockStores.pluginGlobalStore.xmlDocument = xmlDocument
		mockCreateStandardElement
			.mockReturnValueOnce(firstNewReference)
			.mockReturnValueOnce(secondNewReference)
		mockCreateAndDispatchEditEvent.mockImplementation(
			({
				edit
			}: {
				edit: {
					parent: Element
					node: Element
					reference: Element | null
				}
			}) => {
				edit.parent.insertBefore(edit.node, edit.reference)
			}
		)

		createNewRef({
			family: REF_FAMILY.conductingEquipment,
			sourceTypeIdOrUuid: 'first-type-id',
			parentTypeWrapper
		})
		createNewRef({
			family: REF_FAMILY.conductingEquipment,
			sourceTypeIdOrUuid: 'second-type-id',
			parentTypeWrapper
		})

		expect(
			Array.from(parentTypeWrapper.children).map(
				(child) => child.localName
			)
		).toEqual([
			'ConductingEquipment',
			'ConductingEquipment',
			'ConductingEquipment',
			'ConnectivityNode',
			'Function'
		])
		expect(mockCreateAndDispatchEditEvent).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				edit: expect.objectContaining({ reference: connectivityNode })
			})
		)
		expect(mockCreateAndDispatchEditEvent).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				edit: expect.objectContaining({ reference: connectivityNode })
			})
		)
	})

	it.each([
		{
			family: REF_FAMILY.generalEquipment,
			boundaryName: 'ConductingEquipment'
		},
		{
			family: REF_FAMILY.generalEquipment,
			boundaryName: 'ConnectivityNode'
		},
		{
			family: REF_FAMILY.generalEquipment,
			boundaryName: 'Function'
		},
		{
			family: REF_FAMILY.conductingEquipment,
			boundaryName: 'ConnectivityNode'
		},
		{
			family: REF_FAMILY.conductingEquipment,
			boundaryName: 'Function'
		}
	])('GIVEN a Bay with $boundaryName as the next child family WHEN a $family reference is created THEN it is inserted before that boundary', ({
		family,
		boundaryName
	}) => {
		const xmlDocument = createXmlDocument()
		const parentTypeWrapper = createXmlElement(xmlDocument, 'Bay')
		const boundary = createXmlElement(xmlDocument, boundaryName)
		const newReference = createXmlElement(xmlDocument, family)

		parentTypeWrapper.append(boundary)
		mockStores.pluginGlobalStore.xmlDocument = xmlDocument
		mockCreateStandardElement.mockReturnValue(newReference)
		mockCreateAndDispatchEditEvent.mockImplementation(
			({
				edit
			}: {
				edit: {
					parent: Element
					node: Element
					reference: Element | null
				}
			}) => {
				edit.parent.insertBefore(edit.node, edit.reference)
			}
		)

		createNewRef({
			family,
			sourceTypeIdOrUuid: 'type-id',
			parentTypeWrapper
		})

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				edit: expect.objectContaining({ reference: boundary })
			})
		)
		expect(
			Array.from(parentTypeWrapper.children).map(
				(child) => child.localName
			)
		).toEqual([family, boundaryName])
	})

	it('GIVEN a non-empty parent with no later child boundary WHEN a Function reference is created THEN it is appended', () => {
		const xmlDocument = createXmlDocument()
		const parentTypeWrapper = createXmlElement(xmlDocument, 'Bay')
		const existingLNode = createXmlElement(xmlDocument, 'LNode')
		const newReference = createXmlElement(xmlDocument, 'Function')

		parentTypeWrapper.append(existingLNode)
		mockStores.pluginGlobalStore.xmlDocument = xmlDocument
		mockCreateStandardElement.mockReturnValue(newReference)
		mockCreateAndDispatchEditEvent.mockImplementation(
			({
				edit
			}: {
				edit: {
					parent: Element
					node: Element
					reference: Element | null
				}
			}) => {
				edit.parent.insertBefore(edit.node, edit.reference)
			}
		)

		createNewRef({
			family: REF_FAMILY.function,
			sourceTypeIdOrUuid: 'type-id',
			parentTypeWrapper
		})

		expect(
			Array.from(parentTypeWrapper.children).map(
				(child) => child.localName
			)
		).toEqual(['LNode', 'Function'])
		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				edit: expect.objectContaining({ reference: null })
			})
		)
	})

	it('GIVEN existing LNode references with the same lnType WHEN a new LNode reference is created THEN the next lnInst occurrence is assigned', () => {
		const xmlDocument = createXmlDocument()
		const parentTypeWrapper = createXmlElement(xmlDocument, 'Function')

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
					lnClass: 'PTOC'
				}
			}
		}

		mockCreateStandardElement.mockReturnValue(newLNodeReference)

		createNewRef({
			family: REF_FAMILY.lNode,
			sourceTypeIdOrUuid: 'lNode-type-id',
			parentTypeWrapper
		})

		expect(mockCreateStandardElement).toHaveBeenCalledWith({
			xmlDocument,
			element: {
				family: REF_FAMILY.lNode
			},
			attributes: {
				lnClass: 'PTOC',
				lnInst: '3',
				iedName: 'None',
				lnType: 'lNode-type-id',
				uuid: 'test-uuid'
			},
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1'
		})
	})

	it('GIVEN no XML document WHEN a reference is created THEN an error is thrown', () => {
		mockStores.pluginGlobalStore.xmlDocument = null

		expect(() =>
			createNewRef({
				family: REF_FAMILY.function,
				sourceTypeIdOrUuid: 'type-id',
				parentTypeWrapper: document.createElement('Parent')
			})
		).toThrow('No XML document')

		expect(mockCreateStandardElement).not.toHaveBeenCalled()
	})

	it('GIVEN no host WHEN a reference is created THEN an error is thrown', () => {
		mockStores.pluginGlobalStore.host = null

		expect(() =>
			createNewRef({
				family: REF_FAMILY.function,
				sourceTypeIdOrUuid: 'type-id',
				parentTypeWrapper: document.createElement('Parent')
			})
		).toThrow('No host')

		expect(mockCreateStandardElement).not.toHaveBeenCalled()
	})
})

describe('deleteRef', () => {
	it('GIVEN a non-LNode reference WHEN the reference is deleted THEN a remove edit is dispatched', () => {
		const xmlDocument = createXmlDocument()
		const referenceToDelete = createXmlElement(xmlDocument, 'FunctionRef')

		deleteRef({
			refElementToDelete: referenceToDelete,
			refFamily: REF_FAMILY.function
		})

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: [
				{
					node: referenceToDelete
				}
			]
		})
	})

	it('GIVEN multiple LNode references WHEN one reference is deleted THEN the remaining references are renumbered', () => {
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
			refFamily: REF_FAMILY.lNode
		})

		expect(firstLNode.getAttribute('lnInst')).toBe('1')
		expect(lastLNode.getAttribute('lnInst')).toBe('2')

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: [
				{
					node: lNodeToDelete
				},
				{
					parent,
					node: firstLNode,
					reference: null
				},
				{
					parent,
					node: lastLNode,
					reference: null
				}
			]
		})
	})

	it('GIVEN no host WHEN a reference is deleted THEN an error is thrown', () => {
		mockStores.pluginGlobalStore.host = null

		expect(() =>
			deleteRef({
				refElementToDelete: document.createElement('Reference'),
				refFamily: REF_FAMILY.function
			})
		).toThrow('No host available')
	})
})
