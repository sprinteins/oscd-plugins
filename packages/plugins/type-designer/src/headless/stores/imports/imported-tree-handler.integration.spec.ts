import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mockAreElementsIdentical,
	mockCreateTemplateWrapper,
	mockStores,
	mockUuid,
} = vi.hoisted(() => ({
	mockAreElementsIdentical: vi.fn(),
	mockCreateTemplateWrapper: vi.fn(),
	mockUuid: vi.fn(() => 'new-import-uuid'),
	mockStores: {
		importsStore: {
			currentImportActionsByElementIds: [] as Array<
				Record<string, unknown>
			>,
			loadedXmlDocument: null as XMLDocument | null,
		},
		pluginLocalStore: {
			rootElement: null as Element | null,
			updateSCLVersion: vi.fn(),
			addUnstableNamespaceToRootElement: vi.fn(),
			namespaces: {
				currentUnstableRevision: {
					uri: 'urn:type-designer:test',
				},
			},
		},
		ssdStore: {
			hasTemplateWrapper: true,
			createTemplateWrapper: vi.fn(),
		},
		typeElementsStore: {
			typeElementsPerFamily: {},
		},
	},
}))

mockStores.ssdStore.createTemplateWrapper = mockCreateTemplateWrapper

vi.mock('uuid', () => ({
	v4: mockUuid,
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	areElementsIdentical: mockAreElementsIdentical,
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	ssdStore: mockStores.ssdStore,
}))

vi.mock('@/headless/stores', () => ({
	importsStore: mockStores.importsStore,
	pluginLocalStore: mockStores.pluginLocalStore,
	typeElementsStore: mockStores.typeElementsStore,
}))

import { handleImportOfAnyElement } from './imported-tree-handler.helper'

const originUuidNamespace = 'urn:type-designer:test'

type ImportAction = {
	parent: Element
	node: Element
	reference: Element | null
}

type ImportActionEntry = [ImportAction, { node: Element } | undefined]

function createXmlDocument(): XMLDocument {
	return document.implementation.createDocument(null, 'SCL', null)
}

function createElement(
	xmlDocument: XMLDocument,
	tagName: string,
): Element {
	return xmlDocument.createElement(tagName)
}

function getImportAction(
	idOrUuid: string,
): ImportActionEntry {
	const actionByElementId =
		mockStores.importsStore
			.currentImportActionsByElementIds[0] as Record<
			string,
			ImportActionEntry
		>

	return actionByElementId[idOrUuid]
}

beforeEach(() => {
	vi.clearAllMocks()

	mockUuid.mockReturnValue('new-import-uuid')
	mockAreElementsIdentical.mockReturnValue(false)

	mockStores.importsStore.currentImportActionsByElementIds = []
	mockStores.importsStore.loadedXmlDocument = null

	mockStores.ssdStore.hasTemplateWrapper = true

	mockStores.typeElementsStore.typeElementsPerFamily = {}
})

describe('Integration: imported-tree handler workflow', () => {
	it('GIVEN an imported Function without a local equivalent WHEN it is imported THEN a create action is added with originUuid and a new UUID', async () => {
		const localDocument = createXmlDocument()
		const localRoot = localDocument.documentElement

		const localTemplateBay = createElement(localDocument, 'Bay')
		localTemplateBay.setAttribute('name', 'TEMPLATE')
		localRoot.append(localTemplateBay)

		mockStores.pluginLocalStore.rootElement = localRoot

		const importedDocument = createXmlDocument()
		const importedTemplateBay = createElement(
			importedDocument,
			'Bay',
		)
		importedTemplateBay.setAttribute('name', 'TEMPLATE')

		const importedFunction = createElement(
			importedDocument,
			'Function',
		)
		importedFunction.setAttribute('uuid', 'imported-function-uuid')
		importedFunction.setAttribute('name', 'ImportedFunction')

		importedTemplateBay.append(importedFunction)

		await handleImportOfAnyElement(importedFunction)

		expect(
			mockStores.importsStore.currentImportActionsByElementIds,
		).toHaveLength(1)

		const [createAction, removeAction] = getImportAction(
			'imported-function-uuid',
		)

		expect(createAction.parent).toBe(localTemplateBay)
		expect(createAction.reference).toBeNull()
		expect(removeAction).toBeUndefined()

		expect(createAction.node.getAttribute('name')).toBe(
			'ImportedFunction',
		)
		expect(createAction.node.getAttribute('uuid')).toBe(
			'new-import-uuid',
		)
		expect(
			createAction.node.getAttributeNS(
				originUuidNamespace,
				'originUuid',
			),
		).toBe('imported-function-uuid')

		expect(mockUuid).toHaveBeenCalledOnce()
	})

	it('GIVEN an imported Function that was already processed WHEN it is imported again THEN no duplicate import action is created', async () => {
		const localDocument = createXmlDocument()
		const localRoot = localDocument.documentElement

		const localTemplateBay = createElement(localDocument, 'Bay')
		localTemplateBay.setAttribute('name', 'TEMPLATE')
		localRoot.append(localTemplateBay)

		mockStores.pluginLocalStore.rootElement = localRoot

		const importedDocument = createXmlDocument()
		const importedTemplateBay = createElement(
			importedDocument,
			'Bay',
		)
		importedTemplateBay.setAttribute('name', 'TEMPLATE')

		const importedFunction = createElement(
			importedDocument,
			'Function',
		)
		importedFunction.setAttribute('uuid', 'imported-function-uuid')
		importedFunction.setAttribute('name', 'ImportedFunction')

		importedTemplateBay.append(importedFunction)

		await handleImportOfAnyElement(importedFunction)
		await handleImportOfAnyElement(importedFunction)

		expect(
			mockStores.importsStore.currentImportActionsByElementIds,
		).toHaveLength(1)
		expect(mockUuid).toHaveBeenCalledOnce()
	})

	it('GIVEN a differing local element with the same UUID WHEN the imported element is processed THEN a replace action is created', async () => {
		const localDocument = createXmlDocument()
		const localRoot = localDocument.documentElement

		const localTemplateBay = createElement(localDocument, 'Bay')
		localTemplateBay.setAttribute('name', 'TEMPLATE')

		const localFunction = createElement(localDocument, 'Function')
		localFunction.setAttribute('uuid', 'function-uuid')
		localFunction.setAttribute('name', 'ExistingFunction')
		localFunction.setAttribute('description', 'old-description')

		localTemplateBay.append(localFunction)
		localRoot.append(localTemplateBay)

		mockStores.pluginLocalStore.rootElement = localRoot
		mockAreElementsIdentical.mockReturnValue(false)

		const importedDocument = createXmlDocument()
		const importedTemplateBay = createElement(
			importedDocument,
			'Bay',
		)
		importedTemplateBay.setAttribute('name', 'TEMPLATE')

		const importedFunction = createElement(
			importedDocument,
			'Function',
		)
		importedFunction.setAttribute('uuid', 'function-uuid')
		importedFunction.setAttribute('name', 'ImportedFunction')
		importedFunction.setAttribute('description', 'new-description')

		importedTemplateBay.append(importedFunction)

		await handleImportOfAnyElement(importedFunction)

		const [createAction, removeAction] =
			getImportAction('function-uuid')

		expect(createAction.parent).toBe(localTemplateBay)
		expect(createAction.node.getAttribute('uuid')).toBe(
			'new-import-uuid',
		)
		expect(
			createAction.node.getAttribute('description'),
		).toBe('new-description')

		expect(removeAction).toEqual({
			node: localFunction,
		})
	})

	it('GIVEN identical local and imported elements WHEN the imported element is processed THEN no import action is created', async () => {
		const localDocument = createXmlDocument()
		const localRoot = localDocument.documentElement

		const localTemplateBay = createElement(localDocument, 'Bay')
		localTemplateBay.setAttribute('name', 'TEMPLATE')

		const localFunction = createElement(localDocument, 'Function')
		localFunction.setAttribute('uuid', 'function-uuid')
		localFunction.setAttribute('name', 'ExistingFunction')

		localTemplateBay.append(localFunction)
		localRoot.append(localTemplateBay)

		mockStores.pluginLocalStore.rootElement = localRoot
		mockAreElementsIdentical.mockReturnValue(true)

		const importedDocument = createXmlDocument()
		const importedTemplateBay = createElement(
			importedDocument,
			'Bay',
		)
		importedTemplateBay.setAttribute('name', 'TEMPLATE')

		const importedFunction = createElement(
			importedDocument,
			'Function',
		)
		importedFunction.setAttribute('uuid', 'function-uuid')
		importedFunction.setAttribute('name', 'ImportedFunction')

		importedTemplateBay.append(importedFunction)

		await handleImportOfAnyElement(importedFunction)

		expect(
			mockStores.importsStore.currentImportActionsByElementIds,
		).toHaveLength(0)
		expect(mockUuid).not.toHaveBeenCalled()
	})
})