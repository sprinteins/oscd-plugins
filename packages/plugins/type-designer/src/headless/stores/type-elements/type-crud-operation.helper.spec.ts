import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mockCreateAndDispatchEditEvent,
	mockCreateStandardElement,
	mockCreateTemplateWrapper,
	mockDeleteElement,
	mockFindAllStandardElementsBySelector,
	mockUuid,
	mockStores,
	mockConstants,
} = vi.hoisted(() => ({
	mockCreateAndDispatchEditEvent: vi.fn(),
	mockCreateStandardElement: vi.fn(),
	mockCreateTemplateWrapper: vi.fn(),
	mockDeleteElement: vi.fn(),
	mockFindAllStandardElementsBySelector: vi.fn(),
	mockUuid: vi.fn(() => 'test-uuid'),
	mockStores: {
		pluginGlobalStore: {
			host: {} as EventTarget,
			xmlDocument: document.implementation.createDocument(null, 'SCL', null),
			deleteElement: vi.fn(),
		},
		pluginLocalStore: {
			updateSCLVersion: vi.fn(),
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1',
			rootElement: null as Element | null,
			rootSubElements: {
				dataTypeTemplates: null as Element | null,
			},
			currentDefinition: {},
		},
		typeElementsStore: {
			newComputedTypeName: {
				bay: 'NewBay',
				generalEquipment: 'NewGeneralEquipment',
				conductingEquipment: 'NewConductingEquipment',
				function: 'NewFunction',
			},
			newEquipmentType: undefined as string | undefined,
			typeElementsPerFamily: {
				bay: {},
				generalEquipment: {},
				conductingEquipment: {},
				function: {},
				lNodeType: {},
			},
		},
		ssdStore: {
			voltageLevelTemplateElement: null as Element | null,
			bayTemplateElement: null as Element | null,
			createTemplateWrapper: vi.fn(),
			cleanTemplateWrapper: vi.fn(),
		},
	},
	mockConstants: {
		TYPE_FAMILY: {
			bay: 'bay',
			generalEquipment: 'generalEquipment',
			conductingEquipment: 'conductingEquipment',
			function: 'function',
			lNodeType: 'lNodeType',
		},
		CONDUCTING_EQUIPMENTS: {
			singleTerminalEquipment: {
				type: 'SingleTerminalEquipment',
				numberOfTerminals: 1,
			},
		},
		EQUIPMENTS: {
			singleTerminalEquipment: {
				type: 'SingleTerminalEquipment',
			},
			unknownEquipment: {
				type: 'UnknownEquipment',
			},
		},
	},
}))

mockStores.pluginGlobalStore.deleteElement = mockDeleteElement
mockStores.ssdStore.createTemplateWrapper = mockCreateTemplateWrapper

vi.mock('uuid', () => ({
	v4: mockUuid,
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
	typeGuard: {
		isPropertyOfObject: (
			key: string,
			object: Record<string, unknown>,
		): boolean => key in object,
	},
	createStandardElement: mockCreateStandardElement,
	createAndDispatchEditEvent: mockCreateAndDispatchEditEvent,
	findAllStandardElementsBySelector: mockFindAllStandardElementsBySelector,
}))

vi.mock('@oscd-plugins/core-ui-svelte', () => ({
	pluginGlobalStore: mockStores.pluginGlobalStore,
	ssdStore: mockStores.ssdStore,
}))

vi.mock('@/headless/stores', () => ({
	pluginLocalStore: mockStores.pluginLocalStore,
	typeElementsStore: mockStores.typeElementsStore,
}))

vi.mock('@/headless/constants', () => mockConstants)

import {
	createNewType,
	deleteTypeAndRefs,
	getTypeInsertBeforeReference,
	getTypeParent,
} from './type-crud-operation.helper'

function createElement(tagName: string): Element {
	return document.createElement(tagName)
}

function resetStores(): void {
	mockStores.pluginGlobalStore.host = {}
	mockStores.pluginGlobalStore.xmlDocument =
		document.implementation.createDocument(null, 'SCL', null)

	mockStores.pluginLocalStore.rootElement = null
	mockStores.pluginLocalStore.rootSubElements.dataTypeTemplates = null
	mockStores.pluginLocalStore.currentDefinition = {}

	mockStores.typeElementsStore.newEquipmentType = undefined
	mockStores.typeElementsStore.typeElementsPerFamily = {
		bay: {},
		generalEquipment: {},
		conductingEquipment: {},
		function: {},
		lNodeType: {},
	}

	mockStores.ssdStore.voltageLevelTemplateElement = null
	mockStores.ssdStore.bayTemplateElement = null
}

beforeEach(() => {
	vi.clearAllMocks()
	resetStores()

	mockCreateTemplateWrapper.mockResolvedValue(undefined)

	mockCreateStandardElement.mockImplementation(
		({ element }: { element: { family: string } }) =>
			createElement(element.family),
	)
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe('getTypeParent', () => {
	it('returns the voltage-level template for bay types', () => {
		const voltageLevelTemplate = createElement('VoltageLevel')
		mockStores.ssdStore.voltageLevelTemplateElement = voltageLevelTemplate

		expect(getTypeParent('bay' as never)).toBe(voltageLevelTemplate)
	})

	it.each([
		'generalEquipment',
		'conductingEquipment',
		'function',
	] as const)(
		'returns the bay template for "%s" types',
		(family) => {
			const bayTemplate = createElement('Bay')
			mockStores.ssdStore.bayTemplateElement = bayTemplate

			expect(getTypeParent(family as never)).toBe(bayTemplate)
		},
	)

	it('returns DataTypeTemplates for lNodeType', () => {
		const dataTypeTemplates = createElement('DataTypeTemplates')
		mockStores.pluginLocalStore.rootSubElements.dataTypeTemplates =
			dataTypeTemplates

		expect(getTypeParent('lNodeType' as never)).toBe(
			dataTypeTemplates,
		)
	})
})

describe('getTypeInsertBeforeReference', () => {
	it('returns the first ConductingEquipment before inserting GeneralEquipment', () => {
		const bayTemplate = createElement('Bay')
		const conductingEquipment = createElement('ConductingEquipment')

		bayTemplate.append(conductingEquipment)
		mockStores.ssdStore.bayTemplateElement = bayTemplate

		expect(
			getTypeInsertBeforeReference('generalEquipment' as never),
		).toBe(conductingEquipment)
	})

	it('uses the first Function as fallback before inserting GeneralEquipment', () => {
		const bayTemplate = createElement('Bay')
		const functionElement = createElement('Function')

		bayTemplate.append(functionElement)
		mockStores.ssdStore.bayTemplateElement = bayTemplate

		expect(
			getTypeInsertBeforeReference('generalEquipment' as never),
		).toBe(functionElement)
	})

	it('returns the first Function before inserting ConductingEquipment', () => {
		const bayTemplate = createElement('Bay')
		const functionElement = createElement('Function')

		bayTemplate.append(functionElement)
		mockStores.ssdStore.bayTemplateElement = bayTemplate

		expect(
			getTypeInsertBeforeReference('conductingEquipment' as never),
		).toBe(functionElement)
	})

	it.each(['bay', 'function', 'lNodeType'] as const)(
		'returns null for "%s"',
		(family) => {
			expect(getTypeInsertBeforeReference(family as never)).toBeNull()
		},
	)
})

describe('createNewType', () => {
	it('creates and dispatches a new bay type', async () => {
		const voltageLevelTemplate = createElement('VoltageLevel')
		const createdBay = createElement('Bay')

		mockStores.ssdStore.voltageLevelTemplateElement = voltageLevelTemplate
		mockCreateStandardElement.mockReturnValue(createdBay)

		await createNewType({
			family: 'bay' as never,
		})

		expect(
			mockStores.pluginLocalStore.updateSCLVersion,
		).toHaveBeenCalledOnce()
		expect(mockCreateTemplateWrapper).toHaveBeenCalledOnce()

		expect(mockCreateStandardElement).toHaveBeenCalledWith({
			xmlDocument: mockStores.pluginGlobalStore.xmlDocument,
			element: { family: 'bay' },
			attributes: {
				name: 'NewBay',
				uuid: 'test-uuid',
			},
			currentEdition: 'edition-2',
			currentUnstableRevision: 'revision-1',
		})

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: {
				parent: voltageLevelTemplate,
				node: createdBay,
				reference: null,
			},
		})
	})

	it('creates configured Terminal children for conducting equipment', async () => {
		const bayTemplate = createElement('Bay')
		const createdConductingEquipment = createElement(
			'ConductingEquipment',
		)

		mockStores.ssdStore.bayTemplateElement = bayTemplate
		mockStores.typeElementsStore.newEquipmentType =
			'singleTerminalEquipment'

		mockCreateStandardElement.mockImplementation(
			({ element }: { element: { family: string } }) => {
				if (element.family === 'conductingEquipment') {
					return createdConductingEquipment
				}

				return createElement('Terminal')
			},
		)

		await createNewType({
			family: 'conductingEquipment' as never,
			withChildren: true,
		})

		expect(mockCreateStandardElement).toHaveBeenCalledTimes(2)
		expect(createdConductingEquipment.children).toHaveLength(1)
		expect(createdConductingEquipment.children[0].tagName).toBe(
			'TERMINAL',
		)

		expect(mockCreateAndDispatchEditEvent).toHaveBeenCalledWith({
			host: mockStores.pluginGlobalStore.host,
			edit: {
				parent: bayTemplate,
				node: createdConductingEquipment,
				reference: null,
			},
		})
	})

	it('throws when no host is available', async () => {
		mockStores.pluginGlobalStore.host = null as never

		await expect(
			createNewType({ family: 'bay' as never }),
		).rejects.toThrow('No host')

		expect(mockCreateStandardElement).not.toHaveBeenCalled()
	})
})

describe('deleteTypeAndRefs', () => {
	it('deletes a bay type without searching for associated references', () => {
		const bay = createElement('Bay')

		mockStores.typeElementsStore.typeElementsPerFamily.bay = {
			'bay-id': {
				element: bay,
			},
		}

		deleteTypeAndRefs({
			family: 'bay' as never,
			id: 'bay-id',
		})

		expect(mockFindAllStandardElementsBySelector).not.toHaveBeenCalled()
		expect(mockDeleteElement).toHaveBeenCalledWith(bay)
		expect(
			mockStores.ssdStore.cleanTemplateWrapper,
		).toHaveBeenCalledOnce()
	})

	it('deletes associated references before deleting a function type', () => {
		const functionType = createElement('Function')
		const rootElement = createElement('SCL')
		const matchingReference = createElement('FunctionRef')
		const unrelatedReference = createElement('FunctionRef')

		matchingReference.setAttribute('templateUuid', 'function-id')
		unrelatedReference.setAttribute('templateUuid', 'other-id')

		mockStores.pluginLocalStore.rootElement = rootElement
		mockStores.pluginLocalStore.currentDefinition = {
			function: { tag: 'FunctionRef' },
		}

		mockStores.typeElementsStore.typeElementsPerFamily.function = {
			'function-id': {
				element: functionType,
				parameters: {
					refFamily: 'function',
				},
			},
		}

		mockFindAllStandardElementsBySelector.mockReturnValue([
			matchingReference,
			unrelatedReference,
		])

		deleteTypeAndRefs({
			family: 'function' as never,
			id: 'function-id',
		})

		expect(mockFindAllStandardElementsBySelector).toHaveBeenCalledWith({
			selector: 'FunctionRef',
			root: rootElement,
		})
		expect(mockDeleteElement).toHaveBeenCalledWith(matchingReference)
		expect(mockDeleteElement).toHaveBeenCalledWith(functionType)
		expect(mockDeleteElement).not.toHaveBeenCalledWith(unrelatedReference)
	})
})