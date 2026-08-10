import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mocks } = vi.hoisted(() => {
  const typeElement = (label: string) => ({
    parameters: {
      label,
    },
  })

  return {
    mocks: {
      createNewType: vi.fn(),
      deleteTypeAndRefs: vi.fn(),
      createNewRef: vi.fn(),
      deleteRef: vi.fn(),
      duplicateElement: vi.fn(),
      getTypeNextOccurrence: vi.fn(() => 3),
      getElementsWithSameNameBase: vi.fn(() => []),
      computeNameWithOptionalSuffix: vi.fn(
        (
          _family: string,
          inputValue: string | undefined,
          defaultPrefix: string,
          nextOccurrence: number,
        ) =>
          `${inputValue?.trim() || defaultPrefix}_${nextOccurrence}`,
      ),
      getAndMapTypeElements: vi.fn(
        ({ family }: { family: string }) => {
          const typeElementsByFamily: Record<
            string,
            Record<string, unknown>
          > = {
            bay: {
              bay1: typeElement('Main Bay'),
              bay2: typeElement('Secondary Bay'),
            },
            generalEquipment: {
              generalEquipment1: typeElement('Control Cabinet'),
            },
            conductingEquipment: {
              conductingEquipment1: typeElement('Circuit Breaker'),
            },
            function: {
              function1: typeElement('Protection Function'),
            },
            lNodeType: {
              lNodeType1: typeElement('PTOC'),
            },
          }

          return typeElementsByFamily[family] ?? {}
        },
      ),
      pluginLocalStore: {
        bayTypeElements: [],
        bayTemplateSubElements: {
          generalEquipment: [],
          conductingEquipment: [],
          function: [],
        },
        dataTypeTemplatesSubElements: {
          lNodeType: [],
        },
        rootElement: document.createElement('SCL'),
        currentDefinition: {
          generalEquipment: { tag: 'GeneralEquipmentRef' },
          conductingEquipment: {
            tag: 'ConductingEquipmentRef',
          },
          function: { tag: 'FunctionRef' },
          eqFunction: { tag: 'EqFunctionRef' },
          lNode: { tag: 'LNode' },
        },
      },
      importsStore: {
        loadedTypeElementsPerFamily: {
          bay: {
            all: {
              importedBay1: typeElement('Imported Bay'),
            },
            toUpdate: {},
            toAdd: {
              importedBay1: typeElement('Imported Bay'),
            },
          },
          generalEquipment: {
            all: {},
            toUpdate: {},
            toAdd: {},
          },
          conductingEquipment: {
            all: {},
            toUpdate: {},
            toAdd: {},
          },
          function: {
            all: {
              importedFunction1: typeElement('Imported Function'),
            },
            toUpdate: {},
            toAdd: {},
          },
          lNodeType: {
            all: {},
            toUpdate: {},
            toAdd: {},
          },
        },
      },
    },
  }
})

vi.mock('@/headless/stores', () => ({
  importsStore: mocks.importsStore,
  pluginLocalStore: mocks.pluginLocalStore,
}))

vi.mock('./consolidate-types.helper', () => ({
  getAndMapTypeElements: mocks.getAndMapTypeElements,
}))

vi.mock('./type-crud-operation.helper', () => ({
  createNewType: mocks.createNewType,
  deleteTypeAndRefs: mocks.deleteTypeAndRefs,
}))

vi.mock('./ref-crud-operation.helper', () => ({
  createNewRef: mocks.createNewRef,
  deleteRef: mocks.deleteRef,
}))

vi.mock('./type-naming.helper', () => ({
  getTypeNextOccurrence: mocks.getTypeNextOccurrence,
  getElementsWithSameNameBase:
    mocks.getElementsWithSameNameBase,
  computeNameWithOptionalSuffix:
    mocks.computeNameWithOptionalSuffix,
}))

vi.mock('./filter.helper', () => ({
  getFilteredTypeElementByIds: (
    filter: string,
    typeElements: Record<
      string,
      { parameters: { label: string } }
    >,
  ) =>
    Object.fromEntries(
      Object.entries(typeElements).filter(([, typeElement]) =>
        typeElement.parameters.label
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    ),
}))

vi.mock(
  '@/headless/stores/type-elements/common-crud-operation.helper',
  () => ({
    duplicateElement: mocks.duplicateElement,
  }),
)

import {
  COLUMNS,
  REF_FAMILY,
  TYPE_FAMILY,
} from '@/headless/constants/type-elements'
import { typeElementsStore } from './store.svelte'

beforeEach(() => {
  vi.clearAllMocks()

  typeElementsStore.filtersByColumns[COLUMNS.bayType] = ''
  typeElementsStore.filtersByColumns[COLUMNS.equipmentType] = ''
  typeElementsStore.filtersByColumns[COLUMNS.functionType] = ''
  typeElementsStore.filtersByColumns[COLUMNS.lNodeType] = ''

  typeElementsStore.newTypeNameInputValueByColumnKey[
    COLUMNS.bayType
  ] = ''
  typeElementsStore.newTypeNameInputValueByColumnKey[
    COLUMNS.functionType
  ] = ''
})

describe('typeElementsStore columns integration', () => {
  it('groups mapped type elements into the expected columns', () => {
    expect(
      typeElementsStore.columns[COLUMNS.bayType]
        .groupedTypeElements,
    ).toMatchObject({
      [TYPE_FAMILY.bay]: {
        bay1: expect.anything(),
        bay2: expect.anything(),
      },
    })

    expect(
      typeElementsStore.columns[COLUMNS.equipmentType]
        .groupedTypeElements,
    ).toMatchObject({
      [TYPE_FAMILY.generalEquipment]: {
        generalEquipment1: expect.anything(),
      },
      [TYPE_FAMILY.conductingEquipment]: {
        conductingEquipment1: expect.anything(),
      },
    })

    expect(
      typeElementsStore.columns[COLUMNS.functionType]
        .groupedTypeElements,
    ).toMatchObject({
      [TYPE_FAMILY.function]: {
        function1: expect.anything(),
      },
    })

    expect(
      typeElementsStore.columns[COLUMNS.lNodeType]
        .groupedTypeElements,
    ).toMatchObject({
      [TYPE_FAMILY.lNodeType]: {
        lNodeType1: expect.anything(),
      },
    })
  })

  it('includes imported type elements in the matching column', () => {
    expect(
      typeElementsStore.columns[COLUMNS.bayType]
        .importedTypeElements,
    ).toMatchObject({
      [TYPE_FAMILY.bay]: {
        all: {
          importedBay1: expect.anything(),
        },
      },
    })

    expect(
      typeElementsStore.columns[COLUMNS.functionType]
        .importedTypeElements,
    ).toMatchObject({
      [TYPE_FAMILY.function]: {
        all: {
          importedFunction1: expect.anything(),
        },
      },
    })
  })

  it('filters current and imported bay types with the same filter value', () => {
    typeElementsStore.filtersByColumns[COLUMNS.bayType] = 'main'

    expect(
      Object.keys(
        typeElementsStore.columns[COLUMNS.bayType]
          .groupedTypeElements[TYPE_FAMILY.bay],
      ),
    ).toEqual(['bay1'])

    expect(
      Object.keys(
        typeElementsStore.columns[COLUMNS.bayType]
          .importedTypeElements[TYPE_FAMILY.bay].all,
      ),
    ).toEqual([])
  })

  it('filters imported bay types independently from current type elements', () => {
    typeElementsStore.filtersByColumns[COLUMNS.bayType] =
      'imported'

    expect(
      Object.keys(
        typeElementsStore.columns[COLUMNS.bayType]
          .groupedTypeElements[TYPE_FAMILY.bay],
      ),
    ).toEqual([])

    expect(
      Object.keys(
        typeElementsStore.columns[COLUMNS.bayType]
          .importedTypeElements[TYPE_FAMILY.bay].all,
      ),
    ).toEqual(['importedBay1'])
  })
})

describe('typeElementsStore name calculation integration', () => {
  it('uses the Bay default prefix and the next occurrence', () => {
    expect(
      typeElementsStore.newComputedTypeName[TYPE_FAMILY.bay],
    ).toBe('Bay_3')
  })

  it('updates the computed Bay name after user input changes', () => {
    typeElementsStore.newTypeNameInputValueByColumnKey[
      COLUMNS.bayType
    ] = '  Custom Bay  '

    expect(
      typeElementsStore.newComputedTypeName[TYPE_FAMILY.bay],
    ).toBe('Custom Bay_3')
  })

  it('uses the Function default prefix and the next occurrence', () => {
    expect(
      typeElementsStore.newComputedTypeName[TYPE_FAMILY.function],
    ).toBe('Func_3')
  })

  it('updates the computed Function name after user input changes', () => {
    typeElementsStore.newTypeNameInputValueByColumnKey[
      COLUMNS.functionType
    ] = 'Protection'

    expect(
      typeElementsStore.newComputedTypeName[TYPE_FAMILY.function],
    ).toBe('Protection_3')
  })
})

describe('typeElementsStore helper proxies', () => {
  it('exposes CRUD helpers through the store', () => {
    expect(typeElementsStore.createNewType).toBe(
      mocks.createNewType,
    )
    expect(typeElementsStore.deleteTypeAndRefs).toBe(
      mocks.deleteTypeAndRefs,
    )
    expect(typeElementsStore.createNewRef).toBe(
      mocks.createNewRef,
    )
    expect(typeElementsStore.deleteRef).toBe(mocks.deleteRef)
  })

  it('exposes shared naming and duplicate helpers through the store', () => {
    expect(typeElementsStore.getTypeNextOccurrence).toBe(
      mocks.getTypeNextOccurrence,
    )
    expect(typeElementsStore.getElementsWithSameNameBase).toBe(
      mocks.getElementsWithSameNameBase,
    )
    expect(typeElementsStore.duplicateElement).toBe(
      mocks.duplicateElement,
    )
  })

  it('uses production reference-family constants in the mocked definition', () => {
    expect(
      mocks.pluginLocalStore.currentDefinition[
        REF_FAMILY.generalEquipment
      ],
    ).toEqual({
      tag: 'GeneralEquipmentRef',
    })

    expect(
      mocks.pluginLocalStore.currentDefinition[REF_FAMILY.lNode],
    ).toEqual({
      tag: 'LNode',
    })
  })
})