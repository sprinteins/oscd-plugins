import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockCleanTemplateWrapper,
  mockCreateAndDispatchEditEvent,
  mockCreateStandardElement,
  mockCreateTemplateWrapper,
  mockFindAllStandardElementsBySelector,
  mockStores,
  mockUuid,
} = vi.hoisted(() => {
  const mockCleanTemplateWrapper = vi.fn()
  const mockCreateTemplateWrapper = vi.fn()

  return {
    mockCleanTemplateWrapper,
    mockCreateAndDispatchEditEvent: vi.fn(),
    mockCreateStandardElement: vi.fn(),
    mockCreateTemplateWrapper,
    mockFindAllStandardElementsBySelector: vi.fn(),
    mockUuid: vi.fn(() => 'function-type-uuid'),
    mockStores: {
      pluginGlobalStore: {
        host: null as EventTarget | null,
        xmlDocument: null as XMLDocument | null,
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
        addUnstableNamespaceToRootElement: vi.fn(),
      },
      typeElementsStore: {
        newComputedTypeName: {},
        newEquipmentType: undefined,
        typeElementsPerFamily: {},
      },
      ssdStore: {
        voltageLevelTemplateElement: null as Element | null,
        bayTemplateElement: null as Element | null,
        createTemplateWrapper: mockCreateTemplateWrapper,
        cleanTemplateWrapper: mockCleanTemplateWrapper,
      },
    },
  }
})

vi.mock('uuid', () => ({
  v4: mockUuid,
}))

vi.mock('@oscd-plugins/core-api/plugin/v1', () => ({
  createStandardElement: mockCreateStandardElement,
  createAndDispatchEditEvent: mockCreateAndDispatchEditEvent,
  findAllStandardElementsBySelector:
    mockFindAllStandardElementsBySelector,
  typeGuard: {
    isPropertyOfObject: () => false,
  },
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
  REF_FAMILY,
  TYPE_FAMILY,
} from '@/headless/constants/type-elements'

import {
  createNewType,
  deleteTypeAndRefs,
} from './type-crud-operation.helper'
import { createNewRef } from './ref-crud-operation.helper'

function createXmlDocument(): XMLDocument {
  return document.implementation.createDocument(null, 'SCL', null)
}

beforeEach(() => {
  vi.clearAllMocks()

  const xmlDocument = createXmlDocument()
  const rootElement = xmlDocument.documentElement
  const bayTemplate = xmlDocument.createElement('Bay')

  bayTemplate.setAttribute('name', 'TEMPLATE')
  rootElement.append(bayTemplate)

  mockStores.pluginGlobalStore.xmlDocument = xmlDocument
  mockStores.pluginGlobalStore.host = new EventTarget()

  mockStores.pluginLocalStore.rootElement = rootElement
  mockStores.pluginLocalStore.currentDefinition = {
    [REF_FAMILY.function]: {
      tag: 'FunctionRef',
    },
  }

  mockStores.ssdStore.bayTemplateElement = bayTemplate

  mockStores.typeElementsStore.newComputedTypeName = {
    [TYPE_FAMILY.bay]: 'NewBay',
    [TYPE_FAMILY.generalEquipment]: 'NewGeneralEquipment',
    [TYPE_FAMILY.conductingEquipment]:
      'NewConductingEquipment',
    [TYPE_FAMILY.function]: 'ProtectionFunction_1',
  }

  mockStores.typeElementsStore.typeElementsPerFamily = {
    [TYPE_FAMILY.bay]: {},
    [TYPE_FAMILY.generalEquipment]: {},
    [TYPE_FAMILY.conductingEquipment]: {},
    [TYPE_FAMILY.function]: {},
    [TYPE_FAMILY.lNodeType]: {},
  }

  mockCreateTemplateWrapper.mockResolvedValue(undefined)

  mockCreateStandardElement.mockImplementation(
    ({
      xmlDocument: currentXmlDocument,
      element,
      attributes,
    }: {
      xmlDocument: XMLDocument
      element: { family: string }
      attributes: Record<string, string>
    }) => {
      const isReference = 'templateUuid' in attributes

      const tagName =
        element.family === TYPE_FAMILY.function && isReference
          ? 'FunctionRef'
          : 'Function'

      const newElement =
        currentXmlDocument.createElement(tagName)

      for (const [name, value] of Object.entries(attributes)) {
        newElement.setAttribute(name, value)
      }

      return newElement
    },
  )

  mockCreateAndDispatchEditEvent.mockImplementation(
    ({
      edit,
    }: {
      edit: {
        parent: Element
        node: Element
      }
    }) => {
      edit.parent.append(edit.node)
    },
  )

  mockFindAllStandardElementsBySelector.mockImplementation(
    ({
      selector,
      root,
    }: {
      selector: string
      root: Element
    }) => Array.from(root.querySelectorAll(selector)),
  )

  mockStores.pluginGlobalStore.deleteElement.mockImplementation(
    (element: Element) => {
      element.remove()
    },
  )
})

describe('Integration: type and reference lifecycle', () => {
  it('creates a function type and reference, then removes both', async () => {
    const bayTemplate = mockStores.ssdStore.bayTemplateElement

    expect(bayTemplate).not.toBeNull()

    if (!bayTemplate) {
      throw new Error('Expected a bay template element')
    }

    await createNewType({
      family: TYPE_FAMILY.function,
    })

    const functionType = bayTemplate.querySelector('Function')

    expect(functionType).not.toBeNull()

    if (!functionType) {
      throw new Error('Expected a created function type')
    }

    expect(functionType.getAttribute('name')).toBe(
      'ProtectionFunction_1',
    )
    expect(functionType.getAttribute('uuid')).toBe(
      'function-type-uuid',
    )

    mockStores.typeElementsStore.typeElementsPerFamily[
      TYPE_FAMILY.function
    ] = {
      'function-type-uuid': {
        element: functionType,
        parameters: {
          refFamily: REF_FAMILY.function,
        },
      },
    }

    createNewRef({
      family: REF_FAMILY.function,
      sourceTypeIdOrUuid: 'function-type-uuid',
      parentTypeWrapper: bayTemplate,
    })

    const functionReference =
      bayTemplate.querySelector('FunctionRef')

    expect(functionReference).not.toBeNull()
    expect(functionReference?.getAttribute('templateUuid')).toBe(
      'function-type-uuid',
    )

    deleteTypeAndRefs({
      family: TYPE_FAMILY.function,
      id: 'function-type-uuid',
    })

    expect(bayTemplate.querySelector('Function')).toBeNull()
    expect(bayTemplate.querySelector('FunctionRef')).toBeNull()

    expect(
      mockFindAllStandardElementsBySelector,
    ).toHaveBeenCalledWith({
      selector: 'FunctionRef',
      root: mockStores.pluginLocalStore.rootElement,
    })

    expect(mockCleanTemplateWrapper).toHaveBeenCalledOnce()
  })
})