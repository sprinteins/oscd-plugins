import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockCreateAndDispatchEditEvent,
  mockCreateStandardElement,
  mockCreateTemplateWrapper,
  mockDeleteElement,
  mockFindAllStandardElementsBySelector,
  mockUuid,
  mockStores,
} = vi.hoisted(() => {
  const mockCreateTemplateWrapper = vi.fn()
  const mockDeleteElement = vi.fn()

  return {
    mockCreateAndDispatchEditEvent: vi.fn(),
    mockCreateStandardElement: vi.fn(),
    mockCreateTemplateWrapper,
    mockDeleteElement,
    mockFindAllStandardElementsBySelector: vi.fn(),
    mockUuid: vi.fn(() => 'test-uuid'),
    mockStores: {
      pluginGlobalStore: {
        host: {} as EventTarget | null,
        xmlDocument: document.implementation.createDocument(
          null,
          'SCL',
          null,
        ),
        deleteElement: mockDeleteElement,
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
        createTemplateWrapper: mockCreateTemplateWrapper,
        cleanTemplateWrapper: vi.fn(),
      },
    },
  }
})

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

import {
  CONDUCTING_EQUIPMENTS,
  TYPE_FAMILY,
} from '@/headless/constants/type-elements'

import {
  createNewType,
  deleteTypeAndRefs,
  getTypeInsertBeforeReference,
  getTypeParent,
} from './type-crud-operation.helper'

const singleTerminalEquipmentKey = Object.entries(
  CONDUCTING_EQUIPMENTS,
).find(([, equipment]) => equipment.numberOfTerminals === 1)?.[0]

if (!singleTerminalEquipmentKey) {
  throw new Error(
    'Expected a conducting-equipment constant with one terminal',
  )
}

function createElement(tagName: string): Element {
  return document.createElement(tagName)
}

function resetStores(): void {
  mockStores.pluginGlobalStore.host = {} as EventTarget
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

describe('getTypeParent', () => {
  it('GIVEN a voltage-level template WHEN the parent for a Bay type is requested THEN the voltage-level template is returned', () => {
    const voltageLevelTemplate = createElement('VoltageLevel')
    mockStores.ssdStore.voltageLevelTemplateElement =
      voltageLevelTemplate

    expect(getTypeParent(TYPE_FAMILY.bay)).toBe(
      voltageLevelTemplate,
    )
  })

  it.each([
    TYPE_FAMILY.generalEquipment,
    TYPE_FAMILY.conductingEquipment,
    TYPE_FAMILY.function,
  ] as const)(
    'GIVEN a Bay template WHEN the parent for "%s" types is requested THEN the Bay template is returned',
    (family) => {
      const bayTemplate = createElement('Bay')
      mockStores.ssdStore.bayTemplateElement = bayTemplate

      expect(getTypeParent(family)).toBe(bayTemplate)
    },
  )

  it('GIVEN DataTypeTemplates WHEN the parent for an lNodeType is requested THEN DataTypeTemplates are returned', () => {
    const dataTypeTemplates = createElement('DataTypeTemplates')
    mockStores.pluginLocalStore.rootSubElements.dataTypeTemplates =
      dataTypeTemplates

    expect(getTypeParent(TYPE_FAMILY.lNodeType)).toBe(
      dataTypeTemplates,
    )
  })
})

describe('getTypeInsertBeforeReference', () => {
  it('GIVEN ConductingEquipment in the Bay template WHEN the insert reference for GeneralEquipment is requested THEN the first ConductingEquipment is returned', () => {
    const bayTemplate = createElement('Bay')
    const conductingEquipment = createElement('ConductingEquipment')

    bayTemplate.append(conductingEquipment)
    mockStores.ssdStore.bayTemplateElement = bayTemplate

    expect(
      getTypeInsertBeforeReference(TYPE_FAMILY.generalEquipment),
    ).toBe(conductingEquipment)
  })

  it('GIVEN no ConductingEquipment but a Function in the Bay template WHEN the insert reference for GeneralEquipment is requested THEN the first Function is returned', () => {
    const bayTemplate = createElement('Bay')
    const functionElement = createElement('Function')

    bayTemplate.append(functionElement)
    mockStores.ssdStore.bayTemplateElement = bayTemplate

    expect(
      getTypeInsertBeforeReference(TYPE_FAMILY.generalEquipment),
    ).toBe(functionElement)
  })

  it('GIVEN a Function in the Bay template WHEN the insert reference for ConductingEquipment is requested THEN the first Function is returned', () => {
    const bayTemplate = createElement('Bay')
    const functionElement = createElement('Function')

    bayTemplate.append(functionElement)
    mockStores.ssdStore.bayTemplateElement = bayTemplate

    expect(
      getTypeInsertBeforeReference(TYPE_FAMILY.conductingEquipment),
    ).toBe(functionElement)
  })

  it.each([
    TYPE_FAMILY.bay,
    TYPE_FAMILY.function,
    TYPE_FAMILY.lNodeType,
  ] as const)('GIVEN the "%s" type family WHEN its insert reference is requested THEN null is returned', (family) => {
    expect(getTypeInsertBeforeReference(family)).toBeNull()
  })
})

describe('createNewType', () => {
  it('GIVEN a valid Bay type context WHEN a new Bay type is created THEN the type is created and its edit is dispatched', async () => {
    const voltageLevelTemplate = createElement('VoltageLevel')
    const createdBay = createElement('Bay')

    mockStores.ssdStore.voltageLevelTemplateElement =
      voltageLevelTemplate
    mockCreateStandardElement.mockReturnValue(createdBay)

    await createNewType({
      family: TYPE_FAMILY.bay,
    })

    expect(
      mockStores.pluginLocalStore.updateSCLVersion,
    ).toHaveBeenCalledOnce()
    expect(mockCreateTemplateWrapper).toHaveBeenCalledOnce()

    expect(mockCreateStandardElement).toHaveBeenCalledWith({
      xmlDocument: mockStores.pluginGlobalStore.xmlDocument,
      element: { family: TYPE_FAMILY.bay },
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

  it('GIVEN conducting equipment configured with terminals WHEN a new type is created with children THEN the configured Terminal children are created', async () => {
    const bayTemplate = createElement('Bay')
    const createdConductingEquipment = createElement(
      'ConductingEquipment',
    )

    mockStores.ssdStore.bayTemplateElement = bayTemplate
    mockStores.typeElementsStore.newEquipmentType =
      singleTerminalEquipmentKey

    mockCreateStandardElement.mockImplementation(
      ({ element }: { element: { family: string } }) => {
        if (element.family === TYPE_FAMILY.conductingEquipment) {
          return createdConductingEquipment
        }

        return createElement('Terminal')
      },
    )

    await createNewType({
      family: TYPE_FAMILY.conductingEquipment,
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

  it('GIVEN no host WHEN a new type is created THEN an error is thrown', async () => {
    mockStores.pluginGlobalStore.host = null

    await expect(
      createNewType({ family: TYPE_FAMILY.bay }),
    ).rejects.toThrow('No host')

    expect(mockCreateStandardElement).not.toHaveBeenCalled()
  })
})

describe('deleteTypeAndRefs', () => {
  it('GIVEN a Bay type without reference handling WHEN the type is deleted THEN it is removed without searching for associated references', () => {
    const bay = createElement('Bay')

    mockStores.typeElementsStore.typeElementsPerFamily.bay = {
      'bay-id': {
        element: bay,
      },
    }

    deleteTypeAndRefs({
      family: TYPE_FAMILY.bay,
      id: 'bay-id',
    })

    expect(mockFindAllStandardElementsBySelector).not.toHaveBeenCalled()
    expect(mockDeleteElement).toHaveBeenCalledWith(bay)
    expect(
      mockStores.ssdStore.cleanTemplateWrapper,
    ).toHaveBeenCalledOnce()
  })

  it('GIVEN a Function type with associated references WHEN the type is deleted THEN its matching references are deleted first', () => {
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
      family: TYPE_FAMILY.function,
      id: 'function-id',
    })

    expect(mockFindAllStandardElementsBySelector).toHaveBeenCalledWith({
      selector: 'FunctionRef',
      root: rootElement,
    })
    expect(mockDeleteElement).toHaveBeenCalledWith(matchingReference)
    expect(mockDeleteElement).toHaveBeenCalledWith(functionType)
    expect(mockDeleteElement).not.toHaveBeenCalledWith(
      unrelatedReference,
    )
  })
})