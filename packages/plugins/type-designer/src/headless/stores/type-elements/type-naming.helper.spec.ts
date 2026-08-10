import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockTypeElementsPerFamily } = vi.hoisted(() => ({
  mockTypeElementsPerFamily: {
    bay: {},
    function: {},
  },
}))

vi.mock('@/headless/stores', () => ({
  typeElementsStore: {
    typeElementsPerFamily: mockTypeElementsPerFamily,
  },
}))

import { TYPE_FAMILY } from '@/headless/constants/type-elements'

import {
  computeNameWithOptionalSuffix,
  getElementsWithSameNameBase,
  getNewNameWithOccurrence,
  getNumberOfCharactersToRemoveOccurrencePart,
  getTypeNextOccurrence,
} from './type-naming.helper'

type TestedFamily =
  | typeof TYPE_FAMILY.bay
  | typeof TYPE_FAMILY.function

function resetElements(): void {
  mockTypeElementsPerFamily.bay = {}
  mockTypeElementsPerFamily.function = {}
}

function setElements(
  family: TestedFamily,
  names: string[],
): void {
  mockTypeElementsPerFamily[family] = Object.fromEntries(
    names.map((name, index) => [
      `${family}-${index}`,
      {
        attributes: { name },
        parameters: { label: name },
      },
    ]),
  )
}

function createElementWithName(name: string): Element {
  const element = document.createElement('Bay')
  element.setAttribute('name', name)

  return element
}

beforeEach(() => {
  resetElements()
})

describe('getNumberOfCharactersToRemoveOccurrencePart', () => {
  it.each([
    {
      elementName: undefined,
      hasUnderscore: false,
      expected: 0,
    },
    {
      elementName: 'Bay',
      hasUnderscore: false,
      expected: 3,
    },
    {
      elementName: 'Bay_12',
      hasUnderscore: true,
      expected: 3,
    },
    {
      elementName: 'Bay_12',
      hasUnderscore: false,
      expected: 4,
    },
  ])(
    'returns $expected for "$elementName" with hasUnderscore=$hasUnderscore',
    ({ elementName, hasUnderscore, expected }) => {
      const result = getNumberOfCharactersToRemoveOccurrencePart({
        elementName,
        hasUnderscore,
      })

      expect(result).toBe(expected)
    },
  )
})

describe('getElementsWithSameNameBase', () => {
  it('returns elements with the same base name when occurrences are removed', () => {
    setElements(TYPE_FAMILY.bay, [
      'Bay_copy_1',
      'Bay_copy_3',
      'Other_copy_1',
    ])

    const result = getElementsWithSameNameBase({
      family: TYPE_FAMILY.bay,
      valueToTest: 'Bay_copy',
      removeOccurrencePartToTestedValue: true,
    })

    expect(result).toHaveLength(2)
    expect(result.map((element) => element.attributes.name)).toEqual([
      'Bay_copy_1',
      'Bay_copy_3',
    ])
  })

  it('searches across all families when no family is provided', () => {
    setElements(TYPE_FAMILY.bay, ['Bay_copy_1'])
    setElements(TYPE_FAMILY.function, ['Bay_copy_2'])

    const result = getElementsWithSameNameBase({
      valueToTest: 'Bay_copy',
      removeOccurrencePartToTestedValue: true,
    })

    expect(result).toHaveLength(2)
  })
})

describe('getTypeNextOccurrence', () => {
  it.each([
    {
      existingNames: [],
      expected: 1,
    },
    {
      existingNames: ['Bay_copy_1'],
      expected: 2,
    },
    {
      existingNames: ['Bay_copy_1', 'Bay_copy_3', 'Bay_copy_10'],
      expected: 11,
    },
  ])(
    'returns $expected as the next occurrence for $existingNames',
    ({ existingNames, expected }) => {
      setElements(TYPE_FAMILY.bay, existingNames)

      const result = getTypeNextOccurrence({
        family: TYPE_FAMILY.bay,
        valueToTest: 'Bay_copy',
        removeOccurrencePartToTestedValue: true,
      })

      expect(result).toBe(expected)
    },
  )
})

describe('getNewNameWithOccurrence', () => {
  it.each([
    {
      existingNames: [],
      elementName: 'Bay',
      suffix: 'copy',
      skipFirstOccurrence: false,
      expected: 'Bay_copy_1',
    },
    {
      existingNames: ['Bay_copy_1', 'Bay_copy_2'],
      elementName: 'Bay',
      suffix: 'copy',
      skipFirstOccurrence: false,
      expected: 'Bay_copy_3',
    },
    {
      existingNames: [],
      elementName: 'Bay',
      suffix: 'copy',
      skipFirstOccurrence: true,
      expected: 'Bay_copy',
    },
    {
      existingNames: ['Bay_copy_1', 'Bay_copy_2'],
      elementName: 'Bay_copy_1',
      suffix: 'copy',
      skipFirstOccurrence: false,
      expected: 'Bay_copy_3',
    },
  ])(
    'returns "$expected" when cloning "$elementName"',
    ({
      existingNames,
      elementName,
      suffix,
      skipFirstOccurrence,
      expected,
    }) => {
      setElements(TYPE_FAMILY.bay, existingNames)

      const result = getNewNameWithOccurrence({
        element: createElementWithName(elementName),
        family: TYPE_FAMILY.bay,
        suffix,
        skipFirstOccurrence,
      })

      expect(result).toBe(expected)
    },
  )
})

describe('computeNameWithOptionalSuffix', () => {
  it.each([
    {
      inputValue: 'Function',
      defaultPrefix: 'Function',
      nextOccurrence: 1,
      expected: 'Function_1',
    },
    {
      inputValue: '  Function  ',
      defaultPrefix: 'Function',
      nextOccurrence: 2,
      expected: 'Function_2',
    },
    {
      inputValue: undefined,
      defaultPrefix: 'Function',
      nextOccurrence: 3,
      expected: 'Function_3',
    },
    {
      inputValue: 'CustomFunction_7',
      defaultPrefix: 'Function',
      nextOccurrence: 2,
      expected: 'CustomFunction_7',
    },
  ])(
    'returns "$expected" for input "$inputValue"',
    ({ inputValue, defaultPrefix, nextOccurrence, expected }) => {
      const result = computeNameWithOptionalSuffix(
        TYPE_FAMILY.function,
        inputValue,
        defaultPrefix,
        nextOccurrence,
      )

      expect(result).toBe(expected)
    },
  )

  it('appends the occurrence when an explicitly suffixed name already exists', () => {
    setElements(TYPE_FAMILY.function, ['CustomFunction_7'])

    const result = computeNameWithOptionalSuffix(
      TYPE_FAMILY.function,
      'CustomFunction_7',
      'Function',
      2,
    )

    expect(result).toBe('CustomFunction_7_2')
  })
})